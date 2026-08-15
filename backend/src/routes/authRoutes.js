const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { logActivity } = require("../utils/logger");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "super_secret_key_123";

router.post("/register", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại và mật khẩu." });
    }

    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: "Số điện thoại đã được đăng ký." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      phone,
      password: hashedPassword,
      role: "patient", // Bảo mật tuyệt đối: Bắt buộc tài khoản đăng ký mới là bệnh nhân (patient), không cho phép tự động lên admin
    });

    await newUser.save();

    logActivity("Đăng ký tài khoản mới thành công", `Bệnh nhân (${phone})`, req.ip || "127.0.0.1", "Thành công");

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { phone, password } = req.body;

    if (!phone || !password) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại và mật khẩu." });
    }

    const user = await User.findOne({ phone });
    console.log("Login attempt:", phone, "Found:", !!user);
    if (!user) {
      logActivity("Đăng nhập thất bại (Không tìm thấy tài khoản)", `Số điện thoại: ${phone}`, req.ip || "127.0.0.1", "Thất bại");
      return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không đúng." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logActivity("Đăng nhập thất bại (Sai mật khẩu)", `Tài khoản: ${phone}`, req.ip || "127.0.0.1", "Thất bại");
      return res.status(400).json({ message: "Số điện thoại hoặc mật khẩu không đúng." });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1d",
    });

    const roleName = user.role === 'admin' ? 'Admin' : user.role === 'doctor' ? 'Bác sĩ' : user.role === 'nurse' ? 'Dược sĩ' : user.role === 'cashier' ? 'Thu ngân' : 'Bệnh nhân';
    logActivity("Đăng nhập vào hệ thống", `${roleName} (${user.fullName || user.phone})`, req.ip || "127.0.0.1", "Thành công");

    res.json({
      message: "Đăng nhập thành công!",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
