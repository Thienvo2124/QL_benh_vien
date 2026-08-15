const SystemLog = require("../models/SystemLog");

const logActivity = async (action, user = "Hệ thống tự động", ip = "127.0.0.1", status = "Thành công") => {
  try {
    await SystemLog.create({ action, user, ip, status });
  } catch (err) {
    console.error("Lỗi khi ghi log hoạt động:", err);
  }
};

module.exports = { logActivity };
