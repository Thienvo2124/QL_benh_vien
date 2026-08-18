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

module.exports = router;
