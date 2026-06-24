const express = require("express");
const mongoose = require("mongoose");
const Medicine = require("../models/Medicine");
const { adminOrDoctorOnly, protect } = require("../middleware/authMiddleware");

const router = express.Router();

// GET /api/medicines - Lấy danh sách thuốc (Hỗ trợ lọc/tìm kiếm)
router.get("/", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const { search, category } = req.query;
    const filter = {};

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (category && category !== "Tất cả") {
      filter.category = category;
    }

    const medicines = await Medicine.find(filter).sort({ name: 1 }).select("-__v");
    return res.json(medicines);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// POST /api/medicines - Thêm thuốc mới
router.post("/", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    const { name, category, price, quantity, unit, usage, expiryDate } = req.body;

    if (!name || !category || price === undefined || quantity === undefined || !unit || !expiryDate) {
      return res.status(400).json({ message: "Vui lòng điền đầy đủ thông tin thuốc." });
    }

    const existingMedicine = await Medicine.exists({ name: name.trim() });
    if (existingMedicine) {
      return res.status(409).json({ message: "Thuốc này đã tồn tại trong hệ thống." });
    }

    const medicine = await Medicine.create({
      name: name.trim(),
      category: category.trim(),
      price: Number(price),
      quantity: Number(quantity),
      unit: unit.trim(),
      usage: usage ? usage.trim() : "",
      expiryDate: new Date(expiryDate),
    });

    return res.status(201).json({ message: "Thêm thuốc mới thành công.", medicine });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ.", error: error.message });
    }
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// PUT /api/medicines/:id - Cập nhật thông tin thuốc
router.put("/:id", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ." });
    }

    const { name, category, price, quantity, unit, usage, expiryDate } = req.body;

    const updatedData = {
      name: name?.trim(),
      category: category?.trim(),
      price: price !== undefined ? Number(price) : undefined,
      quantity: quantity !== undefined ? Number(quantity) : undefined,
      unit: unit?.trim(),
      usage: usage?.trim(),
      expiryDate: expiryDate ? new Date(expiryDate) : undefined,
    };

    const medicine = await Medicine.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
      runValidators: true,
    }).select("-__v");

    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc." });
    }

    return res.json({ message: "Cập nhật thông tin thuốc thành công.", medicine });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ message: "Dữ liệu không hợp lệ.", error: error.message });
    }
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

// DELETE /api/medicines/:id - Xóa thuốc
router.delete("/:id", protect, adminOrDoctorOnly, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "ID thuốc không hợp lệ." });
    }

    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ message: "Không tìm thấy thuốc." });
    }

    return res.json({ message: "Xóa thuốc thành công." });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
});

module.exports = router;
