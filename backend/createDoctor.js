require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ql_benhvien";

const createDoctor = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const email = "bacsi@gmail.com";
    const password = "123456";

    let user = await User.findOne({ email });
    if (user) {
      console.log(`Tài khoản ${email} đã tồn tại. Đang cập nhật lại mật khẩu thành 123456...`);
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      user.role = "doctor";
      user.fullName = "Bác sĩ Chuyên Khoa";
      await user.save();
      console.log("Đã cập nhật thành công tài khoản Bác sĩ!");
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      user = new User({
        email,
        password: hashedPassword,
        fullName: "Bác sĩ Chuyên Khoa",
        role: "doctor",
      });

      await user.save();
      console.log("Đã tạo thành công tài khoản Bác sĩ mới!");
    }

    console.log("\n--- THÔNG TIN TÀI KHOẢN BÁC SĨ ---");
    console.log("Email: bacsi@gmail.com");
    console.log("Mật khẩu: 123456");
    console.log("Quyền: doctor");
    console.log("----------------------------------\n");

    process.exit(0);
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
};

createDoctor();
