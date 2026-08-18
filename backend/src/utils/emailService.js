const nodemailer = require("nodemailer");
const SystemSetting = require("../models/SystemSetting");

const DEFAULT_CONFIRM_SUBJECT = "[Bệnh viện Nhân Dân] Xác nhận đăng ký lịch hẹn khám thành công - Mã: {appointmentCode}";
const DEFAULT_CONFIRM_CONTENT = `Xin chào {name},

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

Cảm ơn quý khách và chúc quý khách nhiều sức khỏe!`;

const DEFAULT_REMINDER_SUBJECT = "[Nhắc lịch khám] Lịch khám bệnh của bạn tại Bệnh viện Nhân Dân sắp diễn ra";
const DEFAULT_REMINDER_CONTENT = `Xin chào {name},

Bệnh viện Nhân Dân xin thông báo nhắc nhở: Lịch khám bệnh của bạn tại chuyên khoa {dept} sẽ diễn ra sau khoảng {hours} giờ nữa.

Thông tin chi tiết lịch hẹn:
- Mã lịch hẹn: {appointmentCode}
- Bác sĩ khám: {doctor}
- Ngày khám: {date}
- Khung giờ: {time}

Vui lòng sắp xếp thời gian để tới khám đúng hẹn.

Cảm ơn quý khách và chúc quý khách nhiều sức khỏe!`;

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
 * Wrap the plain text parsed email in a beautiful HTML layout
 */
const wrapInBeautifulLayout = (text, isReminder = false) => {
  const borderColor = isReminder ? "#ffccd5" : "#e0e0e0";
  const headerColor = isReminder ? "#e11d48" : "#004e92";
  const headerSubText = isReminder ? "Thông báo nhắc nhở lịch khám bệnh tự động" : "Uy tín - Tận tâm - Sức khỏe của bạn là sứ mệnh của chúng tôi";
  
  // Convert newlines to HTML breaks
  const formattedText = text.replace(/\n/g, "<br/>");
  
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid ${borderColor}; border-radius: 16px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0,0,0,0.02);">
      <div style="text-align: center; border-bottom: 2px solid ${headerColor}; padding-bottom: 15px; margin-bottom: 20px;">
        <h2 style="color: ${headerColor}; margin: 0; font-size: 22px; letter-spacing: 0.5px;">BỆNH VIỆN NHÂN DÂN</h2>
        <p style="color: #666; font-size: 13px; margin: 5px 0 0 0;">${headerSubText}</p>
      </div>
      
      <div style="line-height: 1.8; color: #333; font-size: 14px;">
        ${formattedText}
      </div>
      
      <div style="margin-top: 30px; border-top: 1px solid #eeeeee; padding-top: 15px; text-align: center; font-size: 12px; color: #888;">
        <p style="margin: 0;">Email này được gửi tự động từ hệ thống quản lý của Bệnh viện Nhân Dân.</p>
        <p style="margin: 5px 0 0 0;">Mọi thắc mắc vui lòng liên hệ Hotline: <strong>1900 2115</strong></p>
      </div>
    </div>
  `;
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
  const plainBody = parseTemplate(contentTemplate, app);
  const html = wrapInBeautifulLayout(plainBody, false);

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
  const plainBody = parseTemplate(contentTemplate, app, hours);
  const html = wrapInBeautifulLayout(plainBody, true);

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
