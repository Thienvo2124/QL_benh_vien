const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const { adminOrDoctorOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();
const VALID_STATUSES = ["pending", "approved", "rejected", "completed"];

const generateAppointmentCode = () =>
  `BV${Math.floor(Math.random() * 900000 + 100000)}`;

const createUniqueAppointmentCode = async () => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const appointmentCode = generateAppointmentCode();
    const existing = await Appointment.exists({ appointmentCode });

    if (!existing) {
      return appointmentCode;
    }
  }

  return `BV${Date.now().toString().slice(-8)}`;
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
      dob: req.body.dob,
      gender: normalizeText(req.body.gender),
      dept: normalizeText(req.body.dept),
      doctor: normalizeText(req.body.doctor),
      date: req.body.date,
      time: normalizeText(req.body.time),
      reason: normalizeText(req.body.reason),
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

    const appointment = await Appointment.create({
      name: payload.name,
      phone: payload.phone,
      dob,
      gender: payload.gender || "",
      dept: payload.dept,
      doctor: payload.doctor,
      date: normalizedAppointmentDate,
      time: payload.time,
      reason: payload.reason,
      appointmentCode: await createUniqueAppointmentCode(),
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
    const filter = {};

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

module.exports = router;
