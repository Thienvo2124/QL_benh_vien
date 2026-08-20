const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    dob: {
      type: Date,
    },
    gender: {
      type: String,
      enum: ["Nam", "Nữ", "Khác", ""],
      default: "",
    },
    dept: {
      type: String,
      required: true,
      trim: true,
    },
    doctor: {
      type: String,
      trim: true,
      default: "",
    },
    date: {
      type: Date,
      required: true,
    },
    time: {
      type: String,
      required: true,
      trim: true,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    appointmentCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "completed"],
      default: "pending",
      index: true,
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "paid"],
      default: "unpaid",
      index: true,
    },
    queueNumber: {
      type: Number,
      default: 0,
    },
    initialFee: {
      type: Number,
      default: 150000,
    },
    paymentMethod: {
      type: String,
      enum: ["Tiền mặt", "Chuyển khoản", "Chưa thanh toán"],
      default: "Chưa thanh toán",
    },
    bhyt: {
      type: String,
      default: "",
    },
    cccd: {
      type: String,
      default: "",
      trim: true,
    },
    address: {
      type: String,
      default: "",
    },
    symptoms: {
      type: String,
      default: "",
    },
    diagnosis: {
      type: String,
      default: "",
    },
    treatment: {
      type: String,
      default: "",
    },
    advice: {
      type: String,
      default: "",
    },
    prescription: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Medicine",
        },
        name: String,
        qty: Number,
        unit: String,
        usage: String,
        price: Number,
      },
    ],
    prescriptionStatus: {
      type: String,
      enum: ["none", "unpaid", "paid", "dispensed"],
      default: "none",
    },
    prescriptionPaymentMethod: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: String,
      default: "",
    },
    updatedByRole: {
      type: String,
      default: "",
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

appointmentSchema.index({ date: 1, time: 1, dept: 1 });
appointmentSchema.index({ date: 1, time: 1, dept: 1, doctor: 1 });
appointmentSchema.index({ status: 1, date: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);
