const express = require("express");
const SystemSetting = require("../models/SystemSetting");
const { protect, adminOrDoctorOnly } = require("../middleware/authMiddleware");
const router = express.Router();

// GET all settings
router.get("/", async (req, res) => {
  try {
    const settings = await SystemSetting.find({});
    const settingsObj = {};
    settings.forEach((s) => {
      settingsObj[s.key] = s.value;
    });

    // Provide default fallbacks if not initialized
    const defaults = {
      reminder_hours: 3,
      hospName: "Bệnh viện Nhân Dân (Hà Nội)",
      hotline: "(028) 3551 0063",
      emailContact: "info@bvndgiadinh.org.vn",
      openHours: "07:00 - 17:00 (Thứ 2 - Thứ 7)",
      address: "Số 1 Nơ Trang Long, P. Gia Định, Hà Nội",
    };

    const finalSettings = { ...defaults, ...settingsObj };
    return res.json(finalSettings);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// POST update settings (Admin only)
router.post("/", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const payload = req.body;
    for (const [key, value] of Object.entries(payload)) {
      await SystemSetting.findOneAndUpdate(
        { key },
        { key, value },
        { upsert: true, new: true }
      );
    }
    return res.json({ message: "Cập nhật cấu hình hệ thống thành công." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi máy chủ", error: error.message });
  }
});

// POST test-email connectivity (Admin only)
const { sendTestEmail } = require("../utils/emailService");
router.post("/test-email", protect, adminOrDoctorOnly, async (req, res) => {
  const { recipientEmail, email_user, email_pass } = req.body;
  if (!recipientEmail) {
    return res.status(400).json({ message: "Vui lòng cung cấp địa chỉ email nhận test." });
  }

  try {
    await sendTestEmail(recipientEmail, { user: email_user, pass: email_pass });
    return res.json({ message: "Gửi email thử nghiệm thành công! Hãy kiểm tra hòm thư của bạn." });
  } catch (error) {
    return res.status(500).json({ 
      message: "Lỗi kết nối SMTP gửi mail thất bại.", 
      error: error.message 
    });
  }
});

module.exports = router;
