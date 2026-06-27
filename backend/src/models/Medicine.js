const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vui lòng nhập tên thuốc"],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, "Vui lòng nhập nhóm thuốc"],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, "Vui lòng nhập giá bán"],
      min: [0, "Giá bán không thể nhỏ hơn 0"],
    },
    quantity: {
      type: Number,
      required: [true, "Vui lòng nhập số lượng tồn kho"],
      min: [0, "Số lượng không thể nhỏ hơn 0"],
      default: 0,
    },
    unit: {
      type: String,
      required: [true, "Vui lòng nhập đơn vị tính"],
      trim: true,
    },
    usage: {
      type: String,
      trim: true,
      default: "",
    },
    expiryDate: {
      type: Date,
      required: [true, "Vui lòng nhập ngày hết hạn"],
    },
  },
  { timestamps: true }
);

medicineSchema.index({ name: 1, category: 1 });

module.exports = mongoose.model("Medicine", medicineSchema);
