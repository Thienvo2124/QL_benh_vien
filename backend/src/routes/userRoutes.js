const express = require("express");
const User = require("../models/User");
const SystemLog = require("../models/SystemLog");
const { protect, adminOrDoctorOnly } = require("../middleware/authMiddleware");
const { logActivity } = require("../utils/logger");

const router = express.Router();

router.get("/logs", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const logs = await SystemLog.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server khi lấy nhật ký hoạt động", error: error.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

router.put("/:id/role", async (req, res) => {
  try {
    const { role, department } = req.body;
    
    // Validate role
    if (!["admin", "doctor", "nurse", "cashier", "patient"].includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const updateFields = { role };
    if (role === "doctor") {
      updateFields.department = department || "";
    } else {
      updateFields.department = ""; // Clear department for non-doctors
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    logActivity(`Cập nhật vai trò người dùng thành '${role}'`, `Tài khoản: ${updatedUser.fullName || updatedUser.phone}`, req.ip || "127.0.0.1", "Thành công");

    res.json({ message: "Cập nhật quyền thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// Cập nhật hồ sơ bệnh nhân
router.put("/:id/profile", async (req, res) => {
  try {
    const {
      fullName,
      birthDate,
      gender,
      bhytCode,
      idCard,
      guarantorName,
      guarantorPhone,
      guarantorIdCard,
      occupation,
      ethnicity,
      country,
      province,
      district,
      ward,
      address,
    } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        fullName,
        birthDate,
        gender,
        bhytCode,
        idCard,
        guarantorName,
        guarantorPhone,
        guarantorIdCard,
        occupation,
        ethnicity,
        country,
        province,
        district,
        ward,
        address,
      },
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    logActivity("Cập nhật thông tin chi tiết hồ sơ cá nhân", `Tài khoản: ${updatedUser.fullName || updatedUser.phone}`, req.ip || "127.0.0.1", "Thành công");

    res.json({ message: "Cập nhật hồ sơ thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PUT /api/users/:id (Admin cập nhật thông tin người dùng bất kỳ)
router.put("/:id", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      role,
      department,
      birthDate,
      gender,
      bhytCode,
      idCard,
      address
    } = req.body;

    if (phone) {
      const existingUser = await User.findOne({ phone, _id: { $ne: req.params.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Số điện thoại đã tồn tại ở tài khoản khác." });
      }
    }

    const updateData = {
      fullName,
      email,
      phone,
      role,
      department,
      birthDate,
      gender,
      bhytCode,
      idCard,
      address
    };

    // Loại bỏ các trường không truyền (undefined)
    Object.keys(updateData).forEach(key => updateData[key] === undefined && delete updateData[key]);

    // Nếu thay đổi quyền và không phải bác sĩ thì xóa chuyên khoa
    if (role && role !== "doctor") {
      updateData.department = "";
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!updatedUser) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    logActivity(`Cập nhật thông tin người dùng`, `Tài khoản: ${updatedUser.fullName || updatedUser.phone}`, req.ip || "127.0.0.1", "Thành công");

    res.json({ message: "Cập nhật người dùng thành công", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// DELETE /api/users/:id (Admin xóa người dùng)
router.delete("/:id", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    // Chặn tự xóa tài khoản của chính mình
    if (req.params.id === req.user.id.toString()) {
      return res.status(400).json({ message: "Bạn không thể tự xóa tài khoản quản trị của chính mình." });
    }

    const userToDelete = await User.findById(req.params.id);
    if (!userToDelete) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    await User.findByIdAndDelete(req.params.id);

    logActivity(`Xóa tài khoản người dùng`, `Tài khoản bị xóa: ${userToDelete.fullName || userToDelete.phone}`, req.ip || "127.0.0.1", "Thành công");

    res.json({ message: "Xóa tài khoản thành công." });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
