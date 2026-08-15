const mongoose = require("mongoose");

const SystemLogSchema = new mongoose.Schema({
  action: { type: String, required: true },
  user: { type: String, required: true }, // e.g. "Nguyễn Văn A (0901234567)" or "Hệ thống tự động"
  ip: { type: String, default: "127.0.0.1" },
  status: { type: String, default: "Thành công" },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("SystemLog", SystemLogSchema);
