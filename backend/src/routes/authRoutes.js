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

router.post("/change-password", async (req, res) => {
  try {
    const { phone, oldPassword, newPassword } = req.body;

    if (!phone || !oldPassword || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại không đúng hoặc tài khoản không tồn tại." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      logActivity("Đổi mật khẩu thất bại (Sai mật khẩu cũ)", `Tài khoản: ${phone}`, req.ip || "127.0.0.1", "Thất bại");
      return res.status(400).json({ message: "Mật khẩu cũ không chính xác." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    logActivity("Đổi mật khẩu thành công", `Tài khoản: ${phone}`, req.ip || "127.0.0.1", "Thành công");

    res.json({ message: "Đổi mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.post("/reset-password", async (req, res) => {
  try {
    const { phone, verification, newPassword } = req.body;

    if (!phone || !newPassword) {
      return res.status(400).json({ message: "Vui lòng nhập số điện thoại và mật khẩu mới." });
    }

    const user = await User.findOne({ phone });
    if (!user) {
      return res.status(400).json({ message: "Số điện thoại không tồn tại trên hệ thống." });
    }

    // Check if the user has email or idCard set in DB
    const dbEmail = user.email ? user.email.trim().toLowerCase() : "";
    const dbIdCard = user.idCard ? user.idCard.trim() : "";

    if (dbEmail || dbIdCard) {
      if (!verification) {
        return res.status(400).json({ 
          message: "Tài khoản đã được liên kết thông tin bảo mật. Vui lòng nhập đúng Email hoặc CCCD để xác minh." 
        });
      }
      
      const inputVer = verification.trim().toLowerCase();
      const matchEmail = dbEmail && inputVer === dbEmail;
      const matchIdCard = dbIdCard && verification.trim() === dbIdCard;

      if (!matchEmail && !matchIdCard) {
        logActivity("Khôi phục mật khẩu thất bại (Xác minh không khớp)", `Tài khoản: ${phone}`, req.ip || "127.0.0.1", "Thất bại");
        return res.status(400).json({ message: "Thông tin xác minh (Email hoặc CCCD) không chính xác." });
      }
    }

    // Reset password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    await user.save();

    logActivity("Khôi phục mật khẩu thành công", `Tài khoản: ${phone}`, req.ip || "127.0.0.1", "Thành công");

    res.json({ message: "Đặt lại mật khẩu thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
