const nodemailer = require("nodemailer");

// Create transporter using SMTP Gmail settings from environment variables
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS || process.env.EMAIL_APP_PASS;

  if (!user || !pass) {
    console.warn("⚠️ EMAIL_USER hoặc EMAIL_PASS không được cấu hình trong môi trường. Việc gửi email sẽ bị bỏ qua.");
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
 * Gửi email xác nhận đặt lịch thành công
 * @param {Object} app Đối tượng lịch hẹn (Appointment)
 */
const sendBookingConfirmation = async (app) => {
  const transporter = createTransporter();
  if (!transporter) return;

  if (!app.email) {
    console.log(`[EmailService] Bỏ qua gửi email xác nhận vì lịch hẹn ${app.appointmentCode} không có email.`);
    return;
  }

  const dateStr = app.date ? new Date(app.date).toLocaleDateString("vi-VN") : "N/A";
  const doctorText = app.doctor ? `BS. ${app.doctor}` : "Bác sĩ trực chuyên khoa";

  const mailOptions = {
    from: `"Bệnh viện Nhân Dân" <${process.env.EMAIL_USER}>`,
    to: app.email,
    subject: `[Bệnh viện Nhân Dân] Xác nhận đăng ký lịch hẹn khám thành công - Mã: ${app.appointmentCode}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 12px; background-color: #fcfcfc;">
        <div style="text-align: center; border-bottom: 2px solid #004e92; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #004e92; margin: 0;">BỆNH VIỆN NHÂN DÂN</h2>
          <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Uy tín - Tận tâm - Sức khỏe của bạn là sứ mệnh của chúng tôi</p>
        </div>
        
        <div style="line-height: 1.6; color: #333;">
          <p>Xin chào <strong>${app.name}</strong>,</p>
          <p>Chúc mừng bạn đã đăng ký lịch khám bệnh trực tuyến thành công tại <strong>Bệnh viện Nhân Dân</strong>. Dưới đây là thông tin chi tiết về lịch khám của bạn:</p>
          
          <div style="background-color: #f0f7ff; border-left: 4px solid #004e92; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #555; width: 140px;"><strong>Mã lịch hẹn:</strong></td>
                <td style="padding: 5px 0; color: #004e92; font-size: 16px;"><strong>${app.appointmentCode}</strong></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Chuyên khoa:</strong></td>
                <td style="padding: 5px 0;">${app.dept}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Bác sĩ khám:</strong></td>
                <td style="padding: 5px 0;">${doctorText}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Ngày khám:</strong></td>
                <td style="padding: 5px 0; color: #d97706; font-weight: bold;">${dateStr}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Khung giờ:</strong></td>
                <td style="padding: 5px 0; color: #1d4ed8; font-weight: bold;">${app.time}</td>
              </tr>
              ${app.address ? `
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Địa chỉ của bạn:</strong></td>
                <td style="padding: 5px 0;">${app.address}</td>
              </tr>` : ""}
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
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Đã gửi email xác nhận thành công tới ${app.email} cho lịch hẹn ${app.appointmentCode}`);
  } catch (error) {
    console.error(`[EmailService] Lỗi khi gửi email xác nhận đặt lịch hẹn tới ${app.email}:`, error);
  }
};

/**
 * Gửi email nhắc lịch khám sát giờ
 * @param {Object} app Đối tượng lịch hẹn (Appointment)
 * @param {Number} hours Số giờ nhắc nhở trước khi khám
 */
const sendAppointmentReminder = async (app, hours) => {
  const transporter = createTransporter();
  if (!transporter) return;

  if (!app.email) return;

  const dateStr = app.date ? new Date(app.date).toLocaleDateString("vi-VN") : "N/A";
  const doctorText = app.doctor ? `BS. ${app.doctor}` : "Bác sĩ trực chuyên khoa";

  const mailOptions = {
    from: `"Bệnh viện Nhân Dân" <${process.env.EMAIL_USER}>`,
    to: app.email,
    subject: `[Nhắc lịch khám] Lịch khám bệnh của bạn tại Bệnh viện Nhân Dân sắp diễn ra`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ffccd5; border-radius: 12px; background-color: #fffafb;">
        <div style="text-align: center; border-bottom: 2px solid #e11d48; padding-bottom: 15px; margin-bottom: 20px;">
          <h2 style="color: #e11d48; margin: 0;">BỆNH VIỆN NHÂN DÂN</h2>
          <p style="color: #666; font-size: 14px; margin: 5px 0 0 0;">Thông báo nhắc nhở lịch khám bệnh tự động</p>
        </div>
        
        <div style="line-height: 1.6; color: #333;">
          <p>Xin chào <strong>${app.name}</strong>,</p>
          <p>Bệnh viện Nhân Dân xin thông báo nhắc nhở: Lịch khám bệnh của bạn sẽ diễn ra sau khoảng <strong>${hours} giờ</strong> nữa. Vui lòng sắp xếp thời gian để tới khám đúng hẹn.</p>
          
          <div style="background-color: #fff1f2; border-left: 4px solid #e11d48; padding: 15px; margin: 20px 0; border-radius: 0 8px 8px 0;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 5px 0; color: #555; width: 140px;"><strong>Mã lịch hẹn:</strong></td>
                <td style="padding: 5px 0; color: #e11d48; font-size: 16px;"><strong>${app.appointmentCode}</strong></td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Chuyên khoa:</strong></td>
                <td style="padding: 5px 0;">${app.dept}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Bác sĩ khám:</strong></td>
                <td style="padding: 5px 0;">${doctorText}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Ngày khám:</strong></td>
                <td style="padding: 5px 0; color: #d97706; font-weight: bold;">${dateStr}</td>
              </tr>
              <tr>
                <td style="padding: 5px 0; color: #555;"><strong>Khung giờ:</strong></td>
                <td style="padding: 5px 0; color: #1d4ed8; font-weight: bold;">${app.time}</td>
              </tr>
            </table>
          </div>
          
          <p>Cảm ơn quý khách đã tin tưởng dịch vụ chăm sóc sức khỏe của Bệnh viện Nhân Dân. Chúc quý khách nhiều sức khỏe!</p>
        </div>
        
        <div style="margin-top: 30px; border-top: 1px solid #ffccd5; padding-top: 15px; text-align: center; font-size: 12px; color: #888;">
          <p style="margin: 0;">Email này được gửi tự động từ hệ thống quản lý của Bệnh viện Nhân Dân.</p>
          <p style="margin: 5px 0 0 0;">Mọi thắc mắc vui lòng liên hệ Hotline: <strong>1900 2115</strong></p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[EmailService] Đã gửi email nhắc lịch khám thành công tới ${app.email} cho lịch ${app.appointmentCode}`);
    return true;
  } catch (error) {
    console.error(`[EmailService] Lỗi khi gửi email nhắc lịch khám tới ${app.email}:`, error);
    return false;
  }
};

module.exports = {
  sendBookingConfirmation,
  sendAppointmentReminder,
};
