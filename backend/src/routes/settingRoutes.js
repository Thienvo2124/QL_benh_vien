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
      email_confirm_subject: "[Bệnh viện Nhân Dân] Xác nhận đăng ký lịch hẹn khám thành công - Mã: {appointmentCode}",
      email_confirm_content: `Xin chào {name},

Chúc mừng bạn đã đăng ký lịch khám bệnh trực tuyến thành công tại Bệnh viện Nhân Dân.

Dưới đây là thông tin chi tiết về lịch khám của bạn:
- Mã lịch hẹn: {appointmentCode}
- Chuyên khoa: {dept}
- Bác sĩ khám: {doctor}
- Ngày khám: {date}
- Khung giờ: {time}

⚠️ Lưu ý quan trọng:
- Quý khách vui lòng đến trước giờ hẹn khám 15-30 phút để hoàn tất thủ tục tiếp nhận và đo sinh hiệu ban đầu.
- Khi đi mang theo Thẻ BHYT (nếu có) và CCCD để đối chiếu thông tin nhanh chóng.
- Nếu có bất kỳ thay đổi nào hoặc cần hủy lịch hẹn, vui lòng thực hiện trước 24 giờ trên hệ thống của chúng tôi hoặc liên hệ Hotline tổng đài hỗ trợ.

Cảm ơn quý khách và chúc quý khách nhiều sức khỏe!`,
      email_reminder_subject: "[Nhắc lịch khám] Lịch khám bệnh của bạn tại Bệnh viện Nhân Dân sắp diễn ra",
      email_reminder_content: `Xin chào {name},

Bệnh viện Nhân Dân xin thông báo nhắc nhở: Lịch khám bệnh của bạn tại chuyên khoa {dept} sẽ diễn ra sau khoảng {hours} giờ nữa.

Thông tin chi tiết lịch hẹn:
- Mã lịch hẹn: {appointmentCode}
- Bác sĩ khám: {doctor}
- Ngày khám: {date}
- Khung giờ: {time}

Vui lòng sắp xếp thời gian để tới khám đúng hẹn.

Cảm ơn quý khách và chúc quý khách nhiều sức khỏe!`
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
  const { 
    recipientEmail, 
    email_user, 
    email_pass, 
    templateType, 
    email_confirm_subject, 
    email_confirm_content,
    email_reminder_subject,
    email_reminder_content
  } = req.body;
  
  if (!recipientEmail) {
    return res.status(400).json({ message: "Vui lòng cung cấp địa chỉ email nhận test." });
  }

  try {
    const templateData = templateType ? {
      type: templateType,
      subject: templateType === "confirm" ? email_confirm_subject : email_reminder_subject,
      content: templateType === "confirm" ? email_confirm_content : email_reminder_content
    } : null;

    await sendTestEmail(
      recipientEmail, 
      { user: email_user, pass: email_pass },
      templateData
    );
    return res.json({ message: "Gửi email thử nghiệm thành công! Hãy kiểm tra hòm thư của bạn." });
  } catch (error) {
    return res.status(500).json({ 
      message: "Lỗi kết nối SMTP gửi mail thất bại.", 
      error: error.message 
    });
  }
});

module.exports = router;
