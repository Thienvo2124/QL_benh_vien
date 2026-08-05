const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
      default: "Người dùng mới"
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
    },
    birthDate: { type: String, trim: true },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác", ""], default: "" },
    bhytCode: { type: String, trim: true },
    idCard: { type: String, trim: true },
    guarantorName: { type: String, trim: true },
    guarantorPhone: { type: String, trim: true },
    guarantorIdCard: { type: String, trim: true },
    occupation: { type: String, trim: true },
    ethnicity: { type: String, trim: true },
    country: { type: String, trim: true, default: "Việt Nam" },
    province: { type: String, trim: true },
    district: { type: String, trim: true },
    ward: { type: String, trim: true },
    address: { type: String, trim: true },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "doctor", "nurse", "patient"],
      default: "patient",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
