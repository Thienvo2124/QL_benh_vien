const nodemailer = require("nodemailer");
const SystemSetting = require("../models/SystemSetting");

const DEFAULT_CONFIRM_SUBJECT = "[Bệnh viện Nhân Dân] Xác nhận đăng ký lịch hẹn khám thành công - Mã: {appointmentCode}";
const DEFAULT_CONFIRM_CONTENT = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
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
</div>`;

const DEFAULT_REMINDER_SUBJECT = "[Nhắc lịch khám] Lịch khám bệnh của bạn tại Bệnh viện Nhân Dân sắp diễn ra";
const DEFAULT_REMINDER_CONTENT = `<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ffccd5; border-radius: 12px; background-color: #fffafb;">
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
</div>`;

// Create transporter using SMTP Gmail settings dynamically from database or fallback to .env
const createTransporter = async () => {
  let user = process.env.EMAIL_USER;
  let pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASS;

  try {
    const userSetting = await SystemSetting.findOne({ key: "email_user" });
    const passSetting = await SystemSetting.findOne({ key: "email_pass" });
    if (userSetting && userSetting.value) user = userSetting.value;
    if (passSetting && passSetting.value) pass = passSetting.value;
  } catch (error) {
    console.error("[EmailService] Lỗi đọc cấu hình SMTP từ DB, dùng mặc định .env:", error);
  }

  if (!user || !pass) {
    console.warn("⚠️ EMAIL_USER hoặc EMAIL_PASS không được cấu hình. Việc gửi email sẽ bị bỏ qua.");
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });
};

/**
 * Replace placeholders inside raw template with appointment fields
 */
const parseTemplate = (template, app, hours = 3) => {
  if (!template) return "";
  const dateStr = app.date ? new Date(app.date).toLocaleDateString("vi-VN") : "N/A";
  const doctorText = app.doctor ? `BS. ${app.doctor}` : "Bác sĩ trực chuyên khoa";

  return template
    .replaceAll("{name}", app.name || "")
    .replaceAll("{appointmentCode}", app.appointmentCode || "")
    .replaceAll("{dept}", app.dept || "")
    .replaceAll("{doctor}", doctorText)
    .replaceAll("{date}", dateStr)
    .replaceAll("{time}", app.time || "")
    .replaceAll("{hours}", String(hours));
};

/**
 * Gửi email xác nhận đặt lịch thành công
 * @param {Object} app Đối tượng lịch hẹn (Appointment)
 */
const sendBookingConfirmation = async (app) => {
  const transporter = await createTransporter();
  if (!transporter) return;

  if (!app.email) {
    console.log(`[EmailService] Bỏ qua gửi email vì lịch hẹn ${app.appointmentCode} không có email.`);
    return;
  }

  // Read configs
  let fromUser = process.env.EMAIL_USER;
  let subjectTemplate = DEFAULT_CONFIRM_SUBJECT;
  let contentTemplate = DEFAULT_CONFIRM_CONTENT;

  try {
    const userSetting = await SystemSetting.findOne({ key: "email_user" });
    if (userSetting && userSetting.value) fromUser = userSetting.value;

    const subSetting = await SystemSetting.findOne({ key: "email_confirm_subject" });
    if (subSetting && subSetting.value) subjectTemplate = subSetting.value;

    const bodySetting = await SystemSetting.findOne({ key: "email_confirm_content" });
    if (bodySetting && bodySetting.value) contentTemplate = bodySetting.value;
  } catch (err) {
    console.error("[EmailService] Lỗi nạp cấu hình mẫu email xác nhận từ DB:", err);
  }

  const subject = parseTemplate(subjectTemplate, app);
  const html = parseTemplate(contentTemplate, app);

  const mailOptions = {
    from: `"Bệnh viện Nhân Dân" <${fromUser || "no-reply@gmail.com"}>`,
    to: app.email,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Đã gửi email xác nhận đặt lịch tới ${app.email} (Mã: ${app.appointmentCode})`);
  } catch (error) {
    console.error(`[EmailService] Lỗi khi gửi email xác nhận đặt lịch tới ${app.email}:`, error);
  }
};

/**
 * Gửi email nhắc lịch khám sát giờ
 * @param {Object} app Đối tượng lịch hẹn (Appointment)
 * @param {Number} hours Số giờ nhắc nhở trước khi khám
 */
const sendAppointmentReminder = async (app, hours) => {
  const transporter = await createTransporter();
  if (!transporter) return false;

  if (!app.email) return false;

  // Read configs
  let fromUser = process.env.EMAIL_USER;
  let subjectTemplate = DEFAULT_REMINDER_SUBJECT;
  let contentTemplate = DEFAULT_REMINDER_CONTENT;

  try {
    const userSetting = await SystemSetting.findOne({ key: "email_user" });
    if (userSetting && userSetting.value) fromUser = userSetting.value;

    const subSetting = await SystemSetting.findOne({ key: "email_reminder_subject" });
    if (subSetting && subSetting.value) subjectTemplate = subSetting.value;

    const bodySetting = await SystemSetting.findOne({ key: "email_reminder_content" });
    if (bodySetting && bodySetting.value) contentTemplate = bodySetting.value;
  } catch (err) {
    console.error("[EmailService] Lỗi nạp cấu hình mẫu email nhắc nhở từ DB:", err);
  }

  const subject = parseTemplate(subjectTemplate, app, hours);
  const html = parseTemplate(contentTemplate, app, hours);

  const mailOptions = {
    from: `"Bệnh viện Nhân Dân" <${fromUser || "no-reply@gmail.com"}>`,
    to: app.email,
    subject: subject,
    html: html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Đã gửi email nhắc lịch tới ${app.email} (Mã: ${app.appointmentCode})`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Lỗi khi gửi email nhắc lịch tới ${app.email}:`, error);
    return false;
  }
};

/**
 * Gửi email kiểm tra kết nối SMTP
 * @param {String} toEmail Địa chỉ người nhận
 * @param {Object} credentials Cấu hình SMTP tùy chọn { user, pass }
 */
const sendTestEmail = async (toEmail, credentials = {}) => {
  let user = credentials.user || process.env.EMAIL_USER;
  let pass = credentials.pass || process.env.EMAIL_PASS || process.env.EMAIL_APP_PASS;

  if (!credentials.user || !credentials.pass) {
    try {
      const userSetting = await SystemSetting.findOne({ key: "email_user" });
      const passSetting = await SystemSetting.findOne({ key: "email_pass" });
      if (userSetting && userSetting.value) user = userSetting.value;
      if (passSetting && passSetting.value) pass = passSetting.value;
    } catch (err) {}
  }

  if (!user || !pass) {
    throw new Error("Chưa cấu hình tài khoản Gmail gửi hoặc Mật khẩu ứng dụng.");
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  const mailOptions = {
    from: `"Bệnh viện Nhân Dân" <${user}>`,
    to: toEmail,
    subject: `[SMTP Test] Kiểm tra kết nối hòm thư tự động thành công`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 20px auto; padding: 20px; border: 1px solid #10b981; border-radius: 10px; background-color: #f0fdf4;">
        <h3 style="color: #10b981; margin-top: 0;">🎉 Kết nối SMTP thành công!</h3>
        <p>Hệ thống gửi thư tự động của <strong>Bệnh viện Nhân Dân</strong> đã kết nối thành công với tài khoản Gmail của bạn.</p>
        <p style="font-size: 13px; color: #555;">Thời gian kiểm tra: ${new Date().toLocaleString("vi-VN")}</p>
      </div>
    `,
  };

  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingConfirmation,
  sendAppointmentReminder,
  sendTestEmail,
};
