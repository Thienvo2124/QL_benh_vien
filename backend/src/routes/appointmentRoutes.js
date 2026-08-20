const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const { adminOrDoctorOnly, protect } = require("../middleware/authMiddleware");
const { logActivity } = require("../utils/logger");
const { sendBookingConfirmation } = require("../utils/emailService");

const router = express.Router();
const VALID_STATUSES = ["pending", "approved", "rejected", "completed"];

const createUniqueAppointmentCode = async () => {
  const now = new Date();
  const day = now.getDate();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();
  const prefix = `HSBN${day}${month}${year}`;

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  // Dem so luong benh nhan duoc tao trong ngay de cap so
  const count = await Appointment.countDocuments({
    createdAt: { $gte: start, $lte: end }
  });

  const sequentialNum = count + 1;
  return `${prefix}-${sequentialNum}`;
};

const normalizeText = (value) => (typeof value === "string" ? value.trim() : "");

const startOfDay = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const parseDate = (value) => {
  if (!value) {
    return null;
  }

  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  }

  return new Date(value);
};

const validateRequiredFields = ({ name, phone, dept, date, time }) => {
  const missingFields = [];

  if (!name) missingFields.push("name");
  if (!phone) missingFields.push("phone");
  if (!dept) missingFields.push("dept");
  if (!date) missingFields.push("date");
  if (!time) missingFields.push("time");

  return missingFields;
};

router.post("/", async (req, res) => {
  try {
    const payload = {
      name: normalizeText(req.body.name),
      phone: normalizeText(req.body.phone),
      email: req.body.email ? normalizeText(req.body.email) : "",
      dob: req.body.dob,
      gender: normalizeText(req.body.gender),
      dept: normalizeText(req.body.dept),
      doctor: normalizeText(req.body.doctor),
      date: req.body.date,
      time: normalizeText(req.body.time),
      reason: normalizeText(req.body.reason),
      bhyt: req.body.bhyt ? normalizeText(req.body.bhyt) : "",
      address: req.body.address ? normalizeText(req.body.address) : "",
      cccd: req.body.cccd ? normalizeText(req.body.cccd) : "",
    };

    const missingFields = validateRequiredFields(payload);
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin đặt lịch.",
        missingFields,
      });
    }

    const appointmentDate = parseDate(payload.date);
    if (!appointmentDate || Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Ngày khám không hợp lệ." });
    }

    const today = startOfDay(new Date());
    const normalizedAppointmentDate = startOfDay(appointmentDate);
    if (normalizedAppointmentDate < today) {
      return res.status(400).json({ message: "Không thể đặt lịch trong quá khứ." });
    }

    const dob = payload.dob ? parseDate(payload.dob) : undefined;
    if (dob && Number.isNaN(dob.getTime())) {
      return res.status(400).json({ message: "Ngày sinh không hợp lệ." });
    }

    const duplicateAppointment = await Appointment.exists({
      dept: payload.dept,
      doctor: payload.doctor,
      date: normalizedAppointmentDate,
      time: payload.time,
      status: { $ne: "rejected" },
    });

    if (duplicateAppointment) {
      return res.status(409).json({
        message: "Khung giờ này đã có lịch hẹn. Vui lòng chọn thời gian khác.",
      });
    }

    console.log('[DEBUG] bookingSource nhận được từ request:', req.body.bookingSource);
    const appointment = await Appointment.create({
      name: payload.name,
      phone: payload.phone,
      email: payload.email || "",
      dob,
      gender: payload.gender || "",
      dept: payload.dept,
      doctor: payload.doctor,
      date: normalizedAppointmentDate,
      time: payload.time,
      reason: payload.reason,
      appointmentCode: await createUniqueAppointmentCode(),
      initialFee: req.body.initialFee ? Number(req.body.initialFee) : 150000,
      bhyt: payload.bhyt || "",
      address: payload.address || "",
      cccd: payload.cccd || "",
      bookingSource: req.body.bookingSource === 'offline' ? 'offline' : 'online',
    });

    logActivity(`Đặt lịch khám mới (Mã: ${appointment.appointmentCode})`, `Bệnh nhân: ${appointment.name} (${appointment.phone})`, req.ip || "127.0.0.1", "Thành công");

    // Gửi email xác nhận đặt lịch ngầm (không chặn response)
    sendBookingConfirmation(appointment).catch(err => {
      console.error("[appointmentRoutes] Lỗi gửi email xác nhận đặt lịch:", err);
    });

    return res.status(201).json({
      message: "Đặt lịch khám thành công.",
      appointmentCode: appointment.appointmentCode,
      appointment,
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Dữ liệu đặt lịch không hợp lệ.", error: error.message });
    }

    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const { status, date } = req.query;
    const dept = normalizeText(req.query.dept);
    const doctor = normalizeText(req.query.doctor);
    const filter = { isDeleted: { $ne: true } };

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Trạng thái lịch hẹn không hợp lệ." });
      }
      filter.status = status;
    }

    if (date) {
      const start = parseDate(date);
      if (!start || Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Ngày lọc không hợp lệ." });
      }

      const normalizedStart = startOfDay(start);
      const end = new Date(normalizedStart);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: normalizedStart, $lt: end };
    }

    if (dept) {
      filter.dept = dept;
    }

    if (doctor) {
      filter.doctor = doctor;
    }

    const appointments = await Appointment.find(filter)
      .sort({ date: 1, time: 1, createdAt: -1 })
      .select("-__v");

    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    console.log("API appointments/my - phone:", req.user.phone);
    const appointments = await Appointment.find({ phone: req.user.phone, isDeleted: { $ne: true } })
      .sort({ date: 1, time: 1, createdAt: -1 })
      .select("-__v");
    console.log("API appointments/my - count:", appointments.length);
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// GET /api/appointments/trash
// Lấy danh sách lịch hẹn trong thùng rác
router.get("/trash", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const appointments = await Appointment.find({ isDeleted: true })
      .sort({ updatedAt: -1 })
      .select("-__v");
    return res.json(appointments);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PATCH /api/appointments/:id/restore
// Khôi phục lịch hẹn từ thùng rác
router.patch("/:id/restore", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    appointment.isDeleted = false;
    await appointment.save();

    logActivity(`Khôi phục hồ sơ lịch hẹn/bệnh án (Mã: ${appointment.appointmentCode})`, `Tài khoản: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Khôi phục lịch hẹn thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// GET /api/appointments/revenue-stats
// Admin panel revenue statistics
router.get("/revenue-stats", protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Chỉ quản trị viên mới có quyền truy cập số liệu doanh thu." });
    }

    const appointments = await Appointment.find({
      isDeleted: { $ne: true }
    });

    let totalExamRevenue = 0;
    let totalPrescriptionRevenue = 0;
    
    // Groupings
    const dailyRevenue = {};
    const monthlyRevenue = {};
    const deptRevenue = {};
    const paymentMethodStats = {
      "Tiền mặt": 0,
      "Chuyển khoản": 0
    };

    appointments.forEach(app => {
      const dateObj = new Date(app.date || app.createdAt);
      if (Number.isNaN(dateObj.getTime())) return;
      
      const dayStr = dateObj.toLocaleDateString("sv-SE"); // YYYY-MM-DD
      const monthStr = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, "0")}`; // YYYY-MM

      let examRev = 0;
      let rxRev = 0;

      // 1. Exam Fee
      if (app.paymentStatus === "paid") {
        examRev = app.initialFee || 150000;
        totalExamRevenue += examRev;
        
        const method = app.paymentMethod === "Chuyển khoản" ? "Chuyển khoản" : "Tiền mặt";
        paymentMethodStats[method] = (paymentMethodStats[method] || 0) + examRev;
      }

      // 2. Prescription Fee
      if (["paid", "dispensed"].includes(app.prescriptionStatus)) {
        const cost = app.prescription ? app.prescription.reduce((sum, item) => sum + (item.price * item.qty), 0) : 0;
        const disc = app.bhyt ? cost * 0.8 : 0;
        rxRev = cost - disc;
        totalPrescriptionRevenue += rxRev;

        const method = app.prescriptionPaymentMethod === "Chuyển khoản" ? "Chuyển khoản" : "Tiền mặt";
        paymentMethodStats[method] = (paymentMethodStats[method] || 0) + rxRev;
      }

      const totalRev = examRev + rxRev;
      if (totalRev > 0) {
        // Daily group
        dailyRevenue[dayStr] = (dailyRevenue[dayStr] || 0) + totalRev;
        // Monthly group
        monthlyRevenue[monthStr] = (monthlyRevenue[monthStr] || 0) + totalRev;
        // Dept group
        const deptName = app.dept || "Chưa phân khoa";
        deptRevenue[deptName] = (deptRevenue[deptName] || 0) + totalRev;
      }
    });

    // Format daily data for charts (last 30 days)
    const sortedDays = Object.keys(dailyRevenue).sort().slice(-30);
    const dailyData = sortedDays.map(day => ({
      date: day,
      revenue: dailyRevenue[day]
    }));

    // Format monthly data for charts (last 12 months)
    const sortedMonths = Object.keys(monthlyRevenue).sort().slice(-12);
    const monthlyData = sortedMonths.map(month => ({
      month: month,
      revenue: monthlyRevenue[month]
    }));

    // Format dept data
    const deptData = Object.keys(deptRevenue).map(dept => ({
      dept: dept,
      revenue: deptRevenue[dept]
    })).sort((a, b) => b.revenue - a.revenue);

    // Format recent transaction list (last 15 records)
    const sortedAppsForList = [...appointments].sort((a, b) => {
      const timeA = new Date(a.updatedAt || a.date || 0).getTime();
      const timeB = new Date(b.updatedAt || b.date || 0).getTime();
      return timeB - timeA;
    }).slice(0, 15);

    const recentTransactions = sortedAppsForList.map(app => {
      let examFee = 0;
      let rxFee = 0;
      if (app.paymentStatus === 'paid') examFee = app.initialFee || 150000;
      if (['paid', 'dispensed'].includes(app.prescriptionStatus)) {
        const cost = app.prescription ? app.prescription.reduce((sum, item) => sum + (item.price * item.qty), 0) : 0;
        const disc = app.bhyt ? cost * 0.8 : 0;
        rxFee = cost - disc;
      }
      return {
        _id: app._id,
        appointmentCode: app.appointmentCode,
        name: app.name,
        phone: app.phone,
        dept: app.dept,
        date: app.date || app.createdAt,
        examFee,
        prescriptionFee: rxFee,
        totalFee: examFee + rxFee,
        examPaymentMethod: app.paymentMethod,
        prescriptionPaymentMethod: app.prescriptionPaymentMethod,
        cccd: app.cccd || ""
      };
    });

    const allTransactions = appointments.map(app => {
      let examFee = 0;
      let rxFee = 0;
      if (app.paymentStatus === 'paid') examFee = app.initialFee || 150000;
      if (['paid', 'dispensed'].includes(app.prescriptionStatus)) {
        const cost = app.prescription ? app.prescription.reduce((sum, item) => sum + (item.price * item.qty), 0) : 0;
        const disc = app.bhyt ? cost * 0.8 : 0;
        rxFee = cost - disc;
      }
      return {
        _id: app._id,
        appointmentCode: app.appointmentCode,
        name: app.name,
        phone: app.phone,
        dept: app.dept,
        date: app.date || app.createdAt,
        examFee,
        prescriptionFee: rxFee,
        totalFee: examFee + rxFee,
        examPaymentMethod: app.paymentMethod,
        prescriptionPaymentMethod: app.prescriptionPaymentMethod,
        cccd: app.cccd || "",
        status: app.status
      };
    });

    return res.json({
      success: true,
      summary: {
        totalExamRevenue,
        totalPrescriptionRevenue,
        totalRevenue: totalExamRevenue + totalPrescriptionRevenue,
        count: appointments.length
      },
      dailyData,
      monthlyData,
      deptData,
      paymentMethodStats,
      recentTransactions,
      allTransactions
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/:id", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findById(req.params.id).select("-__v");
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    return res.json(appointment);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.patch("/:id/cancel", protect, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    // Chỉ cho phép hủy nếu lịch đó thuộc về chính số điện thoại của user đang đăng nhập
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      phone: req.user.phone,
    });

    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn hoặc bạn không có quyền hủy lịch này." });
    }

    if (appointment.status === 'completed') {
      return res.status(400).json({ message: "Không thể hủy lịch hẹn đã hoàn thành khám." });
    }

    appointment.status = 'rejected';
    await appointment.save();

    return res.json({
      message: "Hủy lịch hẹn thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.patch("/:id/status", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const { status } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    if (!VALID_STATUSES.includes(status)) {
      return res.status(400).json({ message: "Trạng thái lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true },
    ).select("-__v");

    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    return res.json({
      message: "Cập nhật trạng thái lịch hẹn thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PATCH /api/appointments/:id/pay-exam
// Thu phí khám ban đầu, cấp số thứ tự khám
router.patch("/:id/pay-exam", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    if (appointment.paymentStatus === "paid") {
      return res.status(400).json({ message: "Lịch hẹn này đã được đóng phí khám." });
    }

    const dateStart = startOfDay(appointment.date);
    const dateEnd = new Date(dateStart);
    dateEnd.setDate(dateEnd.getDate() + 1);

    // Tính toán số thứ tự (STT) cấp phát theo ngày (toàn viện) để tránh trùng lặp số
    const count = await Appointment.countDocuments({
      date: { $gte: dateStart, $lt: dateEnd },
      paymentStatus: "paid",
    });

    appointment.paymentStatus = "paid";
    appointment.paymentMethod = req.body.paymentMethod || "Tiền mặt";
    appointment.queueNumber = count + 1;
    appointment.status = "approved"; // Phê duyệt trạng thái lịch khám

    await appointment.save();

    logActivity(`Thu phí khám ban đầu & Cấp số khám (Mã: ${appointment.appointmentCode}, STT: ${appointment.queueNumber})`, `Thu ngân: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Thu phí khám và tiếp nhận bệnh nhân thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// DELETE /api/appointments/:id
// Xóa lịch hẹn
router.delete("/:id", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn để xóa." });
    }

    appointment.isDeleted = true;
    await appointment.save();

    logActivity(`Đưa hồ sơ lịch hẹn/bệnh án vào thùng rác (Mã: ${appointment.appointmentCode})`, `Tài khoản: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Đưa lịch hẹn vào thùng rác thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PUT /api/appointments/:id/medical-record
// Bác sĩ lưu chẩn đoán và kê đơn thuốc cho ca khám
router.put("/:id/medical-record", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const { 
      name, gender, phone, email, weight, address, bhyt, cccd, dept, doctor, dob,
      symptoms, diagnosis, treatment, advice, medicines, date, time, initialFee
    } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    // Cập nhật thông tin hành chính của bệnh nhân (nếu được thay đổi)
    if (name !== undefined) appointment.name = name;
    if (gender !== undefined) appointment.gender = gender;
    if (phone !== undefined) appointment.phone = phone;
    if (email !== undefined) appointment.email = email;
    if (weight !== undefined) appointment.weight = weight;
    if (address !== undefined) appointment.address = address;
    if (bhyt !== undefined) appointment.bhyt = bhyt;
    if (cccd !== undefined) appointment.cccd = cccd;
    if (dept !== undefined) appointment.dept = dept;
    if (doctor !== undefined) appointment.doctor = doctor;
    if (dob !== undefined) appointment.dob = dob;
    if (date !== undefined) appointment.date = date;
    if (time !== undefined) appointment.time = time;
    if (initialFee !== undefined) appointment.initialFee = Number(initialFee);

    // Cập nhật thông tin lâm sàng và thuốc
    appointment.symptoms = symptoms || "";
    appointment.diagnosis = diagnosis || "";
    appointment.treatment = treatment || "";
    appointment.advice = advice || "";
    appointment.prescription = medicines || [];
    
    // Nếu là cập nhật, giữ nguyên trạng thái đóng tiền thuốc cũ nếu đã đóng
    if (appointment.prescriptionStatus !== "paid") {
      appointment.prescriptionStatus = (medicines && medicines.length > 0) ? "unpaid" : "none";
    }
    appointment.status = "completed"; // Khám xong

    // Lưu vết người cập nhật cuối cùng
    appointment.updatedBy = `${req.user.fullName || 'Bác sĩ'} (${req.user.phone || 'N/A'})`;
    appointment.updatedByRole = req.user.role || 'doctor';

    await appointment.save();

    logActivity(`Bác sĩ cập nhật hồ sơ bệnh án & đơn thuốc (Mã: ${appointment.appointmentCode})`, `Tài khoản: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Lưu hồ sơ bệnh án và đơn thuốc thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PATCH /api/appointments/:id/pay-prescription
// Thu ngân xác nhận thu tiền thuốc cho đơn thuốc
router.patch("/:id/pay-prescription", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const { paymentMethod } = req.body;

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    if (appointment.prescriptionStatus === "none") {
      return res.status(400).json({ message: "Bệnh nhân này không có đơn thuốc." });
    }

    appointment.prescriptionStatus = "paid";
    appointment.prescriptionPaymentMethod = paymentMethod || "Tiền mặt";

    await appointment.save();

    logActivity(`Thu ngân thu tiền đơn thuốc (Mã: ${appointment.appointmentCode})`, `Thu ngân: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Thanh toán hóa đơn thuốc thành công.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PATCH /api/appointments/:id/dispense
// Dược sĩ xác nhận đã cấp phát thuốc cho bệnh nhân và tự động trừ số lượng thuốc trong kho
router.patch("/:id/dispense", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    if (appointment.prescriptionStatus === "none") {
      return res.status(400).json({ message: "Bệnh nhân này không có đơn thuốc." });
    }

    if (appointment.prescriptionStatus === "unpaid") {
      return res.status(400).json({ message: "Đơn thuốc này chưa được thanh toán tại quầy thu ngân." });
    }

    if (appointment.prescriptionStatus === "dispensed") {
      return res.status(400).json({ message: "Đơn thuốc này đã được cấp phát rồi." });
    }

    // Thực hiện trừ kho thuốc
    const Medicine = require("../models/Medicine");
    const errors = [];
    
    // Kiểm tra hàng tồn kho trước khi trừ
    for (const item of appointment.prescription) {
      if (item.medicineId) {
        const medicine = await Medicine.findById(item.medicineId);
        if (!medicine) {
          errors.push(`Không tìm thấy thuốc ${item.name} trong kho.`);
        } else if (medicine.quantity < item.qty) {
          errors.push(`Thuốc ${item.name} không đủ số lượng trong kho (Còn: ${medicine.quantity}, Yêu cầu: ${item.qty}).`);
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: "Kho không đủ thuốc để cấp phát.", errors });
    }

    // Trừ kho thực tế
    for (const item of appointment.prescription) {
      if (item.medicineId) {
        await Medicine.findByIdAndUpdate(item.medicineId, {
          $inc: { quantity: -item.qty }
        });
      }
    }

    // Cập nhật trạng thái đơn thuốc
    appointment.prescriptionStatus = "dispensed";
    appointment.updatedBy = `${req.user.fullName || 'Dược sĩ'} (${req.user.phone || 'N/A'})`;
    appointment.updatedByRole = req.user.role || 'nurse';

    await appointment.save();

    logActivity(`Cấp phát đơn thuốc thành công & Trừ kho (Mã: ${appointment.appointmentCode})`, `Dược sĩ: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Cấp phát thuốc thành công và đã cập nhật kho dược.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PATCH /api/appointments/:id/undispense
// Dược sĩ hoàn trả đơn đã cấp → trạng thái trở lại "paid" (chờ cấp phát), cộng lại số lượng kho
router.patch("/:id/undispense", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID lịch hẹn không hợp lệ." });
    }

    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: "Không tìm thấy lịch hẹn." });
    }

    if (appointment.prescriptionStatus !== "dispensed") {
      return res.status(400).json({ message: "Chỉ có thể hoàn trả đơn đã được cấp phát." });
    }

    // Cộng lại kho thuốc
    const Medicine = require("../models/Medicine");
    for (const item of appointment.prescription) {
      if (item.medicineId) {
        await Medicine.findByIdAndUpdate(item.medicineId, {
          $inc: { quantity: item.qty }
        });
      }
    }

    // Chuyển trạng thái về "paid" (đã thanh toán, chờ cấp phát)
    appointment.prescriptionStatus = "paid";
    appointment.updatedBy = `${req.user.fullName || 'Dược sĩ'} (${req.user.phone || 'N/A'})`;
    appointment.updatedByRole = req.user.role || 'nurse';

    await appointment.save();

    logActivity(`Hoàn trả đơn thuốc về chờ cấp phát (Mã: ${appointment.appointmentCode})`, `Dược sĩ: ${req.user.fullName || req.user.phone}`, req.ip || "127.0.0.1", "Thành công");

    return res.json({
      message: "Hoàn trả đơn thuốc thành công. Đơn đã chuyển về trạng thái chờ cấp phát.",
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
