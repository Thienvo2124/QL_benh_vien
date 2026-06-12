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
    const { name, phone, dob, gender, dept, doctor, date, time, reason } = req.body;
    const missingFields = validateRequiredFields({ name, phone, dept, date, time });

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin đặt lịch.",
        missingFields,
      });
    }

    const appointmentDate = new Date(date);
    if (Number.isNaN(appointmentDate.getTime())) {
      return res.status(400).json({ message: "Ngày khám không hợp lệ." });
    }

    const appointment = await Appointment.create({
      name,
      phone,
      dob: dob ? new Date(dob) : undefined,
      gender: gender || "",
      dept,
      doctor: doctor || "",
      date: appointmentDate,
      time,
      reason: reason || "",
      appointmentCode: await createUniqueAppointmentCode(),
    });

    return res.status(201).json({
      message: "Đặt lịch khám thành công.",
      appointmentCode: appointment.appointmentCode,
      appointment,
    });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.get("/", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const { status, date } = req.query;
    const filter = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        return res.status(400).json({ message: "Trạng thái lịch hẹn không hợp lệ." });
      }
      filter.status = status;
    }

    if (date) {
      const start = new Date(date);
      if (Number.isNaN(start.getTime())) {
        return res.status(400).json({ message: "Ngày lọc không hợp lệ." });
      }

      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      filter.date = { $gte: start, $lt: end };
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
