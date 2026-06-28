require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/User");

const MONGO_URI = process.env.MONGO_URI;

const listUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB Atlas");
    const users = await User.find({}, { email: 1, role: 1, fullName: 1 });
    console.log("DANH SÁCH TÀI KHOẢN TRONG DATABASE ATLAS HIỆN TẠI:");
    console.log(users);
    process.exit(0);
  } catch (error) {
    console.error("Lỗi:", error);
    process.exit(1);
  }
};

listUsers();
