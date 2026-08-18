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
      email_confirm_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
  <div style="text-align: center; border-bottom: 2px solid #004e92; padding-bottom: 15px; margin-bottom: 20px;">
    <h2 style="color: #004e92; margin: 0;">BỆNH VIỆN NHÂN DÂN</h2>
    <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Uy tín - Tận tâm - Sức khỏe của bạn là sứ mệnh của chúng tôi</p>
  </div>
  
  <div style="line-height: 1.6; color: #333;">
    <p>Xin chào <strong>{name}</strong>,</p>
    <p>Chúc mừng bạn đã đăng ký lịch khám bệnh trực tuyến thành công tại <strong>Bệnh viện Nhân Dân</strong>. Dưới đây là thông tin chi tiết về lịch khám của bạn:</p>
    
    <div style="background-color: #f0f7ff; border-left: 4px solid #004e92; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #555; width: 140px;"><strong>Mã lịch hẹn:</strong></td>
          <td style="padding: 5px 0; color: #004e92; font-size: 16px;"><strong>{appointmentCode}</strong></td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Chuyên khoa:</strong></td>
          <td style="padding: 5px 0;">{dept}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Bác sĩ khám:</strong></td>
          <td style="padding: 5px 0;">{doctor}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Ngày khám:</strong></td>
          <td style="padding: 5px 0; color: #d97706; font-weight: bold;">{date}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Khung giờ:</strong></td>
          <td style="padding: 5px 0; color: #1d4ed8; font-weight: bold;">{time}</td>
        </tr>
      </table>
    </div>
    
    <p style="margin-top: 20px;"><strong>⚠️ Lưu ý quan trọng:</strong></p>
    <ul style="padding-left: 20px; color: #555;">
      <li>Quý khách vui lòng đến trước giờ hẹn khám 15-30 phút để hoàn tất thủ tục tiếp nhận và đo sinh hiệu ban đầu.</li>
      <li>Khi đi mang theo Thẻ BHYT (nếu có) và CCCD để đối chiếu thông tin nhanh chóng.</li>
      <li>Nếu có bất kỳ thay đổi nào hoặc cần hủy lịch hẹn, vui lòng thực hiện trước 24 giờ trên hệ thống của chúng tôi hoặc liên hệ Hotline tổng đài hỗ trợ.</li>
    </ul>
  </div>
  
  <div style="margin-top: 30px; border-top: 1px solid #e0e0e0; padding-top: 15px; text-align: center; font-size: 12px; color: #888;">
    <p style="margin: 0;">Email này được gửi tự động từ hệ thống quản lý của Bệnh viện Nhân Dân.</p>
    <p style="margin: 5px 0 0 0;">Mọi thắc mắc vui lòng liên hệ Hotline: <strong>1900 2115</strong></p>
  </div>
</div>`,
      email_reminder_subject: "[Nhắc lịch khám] Lịch khám bệnh của bạn tại Bệnh viện Nhân Dân sắp diễn ra",
      email_reminder_content: `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ffccd5; border-radius: 12px; background-color: #fffafb;">
  <div style="text-align: center; border-bottom: 2px solid #e11d48; padding-bottom: 15px; margin-bottom: 20px;">
    <h2 style="color: #e11d48; margin: 0;">BỆNH VIỆN NHÂN DÂN</h2>
    <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Thông báo nhắc nhở lịch khám bệnh tự động</p>
  </div>
  
  <div style="line-height: 1.6; color: #333;">
    <p>Xin chào <strong>{name}</strong>,</p>
    <p>Bệnh viện Nhân Dân xin thông báo nhắc nhở: Lịch khám bệnh của bạn sẽ diễn ra sau khoảng <strong>{hours} giờ</strong> nữa. Vui lòng sắp xếp thời gian để tới khám đúng hẹn.</p>
    
    <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 5px 0; color: #555; width: 140px;"><strong>Mã lịch hẹn:</strong></td>
          <td style="padding: 5px 0; color: #e11d48; font-size: 16px;"><strong>{appointmentCode}</strong></td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Chuyên khoa:</strong></td>
          <td style="padding: 5px 0;">{dept}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Bác sĩ khám:</strong></td>
          <td style="padding: 5px 0;">{doctor}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Ngày khám:</strong></td>
          <td style="padding: 5px 0; color: #d97706; font-weight: bold;">{date}</td>
        </tr>
        <tr>
          <td style="padding: 5px 0; color: #555;"><strong>Khung giờ:</strong></td>
          <td style="padding: 5px 0; color: #1d4ed8; font-weight: bold;">{time}</td>
        </tr>
      </table>
    </div>
    
    <p>Cảm ơn quý khách đã tin tưởng dịch vụ chăm sóc sức khỏe của Bệnh viện Nhân Dân. Chúc quý khách nhiều sức khỏe!</p>
  </div>
  
  <div style="margin-top: 30px; border-top: 1px solid #ffccd5; padding-top: 15px; text-align: center; font-size: 12px; color: #888;">
    <p style="margin: 0;">Email này được gửi tự động từ hệ thống quản lý của Bệnh viện Nhân Dân.</p>
    <p style="margin: 5px 0 0 0;">Mọi thắc mắc vui lòng liên hệ Hotline: <strong>1900 2115</strong></p>
  </div>
</div>`
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
