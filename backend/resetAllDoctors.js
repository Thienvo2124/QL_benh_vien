require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const MONGO_URI = process.env.MONGO_URI;

const resetAllDoctors = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");

    const password = "123456";
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const emails = ["doctor1@gmail.com", "doctor2@gmail.com", "bacsi@gmail.com", "admin@gmail.com"];

    for (const email of emails) {
      await User.updateOne({ email }, { $set: { password: hashedPassword } });
      console.log(`Đã đặt lại mật khẩu cho ${email} thành: 123456`);
    }

    console.log("\n--- THÔNG TIN CÁC TÀI KHOẢN ĐÃ ĐƯỢC RESET VỀ 123456 ---");
    console.log("1. admin@gmail.com (Quyền: admin)");
    console.log("2. doctor1@gmail.com (Quyền: doctor)");
    console.log("3. doctor2@gmail.com (Quyền: doctor)");
    console.log("4. bacsi@gmail.com (Quyền: doctor)");
    console.log("Mật khẩu chung cho tất cả: 123456");
    console.log("-------------------------------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
};

resetAllDoctors();
