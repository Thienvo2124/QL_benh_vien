const express = require("express");
const mongoose = require("mongoose");
const Appointment = require("../models/Appointment");
const { logActivity } = require("../utils/logger");

const router = express.Router();

const startOfDay = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

// POST /api/webhooks/sepay
// Nhận thông báo giao dịch chuyển khoản tự động từ SePay
router.post("/sepay", async (req, res) => {
  try {
    const { 
      content, 
      transactionContent, 
      transferAmount, 
      amountIn, 
      gateway, 
      referenceCode, 
      referenceNumber 
    } = req.body;

    const actualContent = content || transactionContent;
    const actualAmount = transferAmount || amountIn;
    const actualRef = referenceCode || referenceNumber;

    logActivity(
      `Nhận webhook SePay`,
      `Nội dung: ${actualContent} | Tiền: ${actualAmount}`,
      req.ip || "127.0.0.1",
      `Body: ${JSON.stringify(req.body)}`
    );

    console.log("=== SEPAY WEBHOOK RECEIVED ===");
    console.log("Nội dung CK:", actualContent);
    console.log("Số tiền:", actualAmount);
    console.log("Ngân hàng:", gateway);
    console.log("Mã tham chiếu:", actualRef);
    console.log("===============================");

    if (!actualContent) {
      return res.status(200).json({ status: "ignored", message: "Nội dung chuyển khoản trống" });
    }

    const contentUpper = actualContent.toUpperCase();

    // 1. KIỂM TRA PHÍ KHÁM LÂM SÀNG BAN ĐẦU (Quét mã HSBN)
    // Ví dụ cú pháp: "TToan phi kham HSBN2082026-4" hoặc "HSBN2082026-4"
    const hsbnRegex = /HSBN\d+-\d+|HSBN\d+/;
    const hsbnMatch = contentUpper.match(hsbnRegex);

    if (hsbnMatch) {
      const appointmentCode = hsbnMatch[0];
      const appointment = await Appointment.findOne({ appointmentCode, isDeleted: { $ne: true } });

      if (appointment) {
        if (appointment.paymentStatus === "paid") {
          return res.status(200).json({ status: "success", message: "Giao dịch đã được thanh toán từ trước." });
        }

        // Tính số thứ tự khám (STT) trong ngày
        const dateStart = startOfDay(appointment.date);
        const dateEnd = new Date(dateStart);
        dateEnd.setDate(dateEnd.getDate() + 1);

        const count = await Appointment.countDocuments({
          date: { $gte: dateStart, $lt: dateEnd },
          paymentStatus: "paid",
        });

        appointment.paymentStatus = "paid";
        appointment.paymentMethod = "Chuyển khoản";
        appointment.queueNumber = count + 1;
        appointment.status = "approved"; // Phê duyệt lịch khám

        await appointment.save();

        logActivity(
          `Thu phí khám ban đầu TỰ ĐỘNG (SePay) (Mã: ${appointment.appointmentCode}, STT: ${appointment.queueNumber})`,
          `Hệ thống SePay (${gateway})`,
          "127.0.0.1",
          "Thành công"
        );

        return res.status(200).json({
          status: "success",
          message: `Thanh toán phí khám thành công cho bệnh nhân ${appointment.name}`,
          appointment
        });
      }
    }

    // 2. KIỂM TRA TIỀN ĐƠN THUỐC (Quét ID đơn thuốc - 24 ký tự hex)
    // Ví dụ cú pháp: "TToan don thuoc 60d5f1..."
    const hexRegex = /[0-9A-F]{24}/;
    const hexMatch = contentUpper.match(hexRegex);

    if (hexMatch) {
      const appointmentId = hexMatch[0].toLowerCase();
      if (mongoose.Types.ObjectId.isValid(appointmentId)) {
        const appointment = await Appointment.findOne({ _id: appointmentId, isDeleted: { $ne: true } });

        if (appointment) {
          if (appointment.prescriptionStatus === "paid") {
            return res.status(200).json({ status: "success", message: "Đơn thuốc đã được thanh toán trước đó." });
          }

          appointment.prescriptionStatus = "paid";
          appointment.prescriptionPaymentMethod = "Chuyển khoản";
          await appointment.save();

          logActivity(
            `Thu tiền đơn thuốc TỰ ĐỘNG (SePay) (Mã HS: ${appointment.appointmentCode})`,
            `Hệ thống SePay (${gateway})`,
            "127.0.0.1",
            "Thành công"
          );

          return res.status(200).json({
            status: "success",
            message: `Thanh toán đơn thuốc thành công cho bệnh nhân ${appointment.name}`,
            appointment
          });
        }
      }
    }

    // Không tìm khớp cấu trúc giao dịch nào
    return res.status(200).json({
      status: "ignored",
      message: "Giao dịch không nằm trong danh sách đối soát tự động của bệnh viện"
    });
  } catch (error) {
    console.error("Lỗi SePay Webhook:", error);
    return res.status(500).json({ status: "error", message: "Lỗi máy chủ", error: error.message });
  }
});

module.exports = router;
