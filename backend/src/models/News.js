const mongoose = require("mongoose");

const newsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    imageUrl: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Thong bao", "Suc khoe", "Hoat dong", "Tuyen dung", "Khac"],
      default: "Thong bao",
    },
    author: {
      type: String,
      default: "Ban Quan tri",
      trim: true,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    isVisible: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("News", newsSchema);
