require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Patient = require("./src/models/Patient");
const Appointment = require("./src/models/Appointment");
const Medicine = require("./src/models/Medicine");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ql_benhvien";

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Patient.deleteMany({});
    await Appointment.deleteMany({});
    await Medicine.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("123456", salt);

    // 1. Create Users (1 admin, 2 doctors, 1 nurse, 5 patients)
    console.log("Seeding users...");
    const usersData = [
      { email: "admin@gmail.com", password: hashedPassword, fullName: "Adminstrator", role: "admin" },
      { email: "doctor1@gmail.com", password: hashedPassword, fullName: "BS. Nguyễn Văn A", role: "doctor" },
      { email: "doctor2@gmail.com", password: hashedPassword, fullName: "BS. Trần Thị B", role: "doctor" },
      { email: "nurse1@gmail.com", password: hashedPassword, fullName: "YT. Lê Thị C", role: "nurse" },
      { email: "patient1@gmail.com", password: hashedPassword, fullName: "Bệnh nhân 1", role: "patient" },
      { email: "patient2@gmail.com", password: hashedPassword, fullName: "Bệnh nhân 2", role: "patient" },
      { email: "patient3@gmail.com", password: hashedPassword, fullName: "Bệnh nhân 3", role: "patient" },
      { email: "patient4@gmail.com", password: hashedPassword, fullName: "Bệnh nhân 4", role: "patient" },
      { email: "patient5@gmail.com", password: hashedPassword, fullName: "Bệnh nhân 5", role: "patient" }
    ];
    await User.insertMany(usersData);

    // 2. Create Patient Profiles
    console.log("Seeding patient profiles...");
    const patientsData = [
      { name: "Bệnh nhân 1", age: 30, gender: "Male", contactNumber: "0901234567" },
      { name: "Bệnh nhân 2", age: 25, gender: "Female", contactNumber: "0901234568" },
      { name: "Bệnh nhân 3", age: 40, gender: "Male", contactNumber: "0901234569" },
      { name: "Bệnh nhân 4", age: 50, gender: "Female", contactNumber: "0901234560" },
      { name: "Bệnh nhân 5", age: 60, gender: "Male", contactNumber: "0901234561" }
    ];
    await Patient.insertMany(patientsData);

    // 3. Create Appointments (10 appointments)
    console.log("Seeding appointments...");
    const appointmentsData = [];
    for (let i = 1; i <= 10; i++) {
      const date = new Date();
      date.setDate(date.getDate() + (i % 3)); // Some in future
      appointmentsData.push({
        name: `Bệnh nhân ${Math.ceil(i/2)}`,
        phone: `090123456${Math.ceil(i/2)}`,
        gender: i % 2 === 0 ? "Nam" : "Nữ",
        dept: i % 2 === 0 ? "Tim mạch" : "Nội tổng quát",
        doctor: i % 2 === 0 ? "BS. Nguyễn Văn A" : "BS. Trần Thị B",
        date: date,
        time: "08:00",
        reason: `Khám định kỳ lần ${i}`,
        appointmentCode: `APT-${1000 + i}`,
        status: i <= 3 ? "completed" : i <= 6 ? "approved" : "pending"
      });
    }
    await Appointment.insertMany(appointmentsData);

    // 4. Create Medicines (10 medicines)
    console.log("Seeding medicines...");
    const futureDate = new Date();
    futureDate.setFullYear(futureDate.getFullYear() + 2); // 2 years from now

    const medicinesData = [
      { name: "Paracetamol 500mg", category: "Thuốc giảm đau, hạ sốt", price: 25000, quantity: 200, unit: "Hộp 10 vỉ x 10 viên", usage: "Uống 1-2 viên/lần khi sốt trên 38.5 độ C hoặc đau nhức.", expiryDate: futureDate },
      { name: "Amoxicillin 500mg", category: "Thuốc kháng sinh", price: 45000, quantity: 150, unit: "Hộp 10 vỉ x 10 viên", usage: "Uống theo đơn bác sĩ. Trị nhiễm khuẩn đường hô hấp.", expiryDate: futureDate },
      { name: "Omeprazole 20mg", category: "Thuốc tiêu hóa", price: 35000, quantity: 120, unit: "Hộp 3 vỉ x 10 viên", usage: "Uống 1 viên trước ăn sáng 30 phút. Trị viêm loét dạ dày.", expiryDate: futureDate },
      { name: "Cetirizine 10mg", category: "Thuốc chống dị ứng", price: 15000, quantity: 100, unit: "Hộp 10 vỉ x 10 viên", usage: "Uống 1 viên vào buổi tối trước khi đi ngủ.", expiryDate: futureDate },
      { name: "Loratadine 10mg", category: "Thuốc chống dị ứng", price: 18000, quantity: 80, unit: "Hộp 10 vỉ x 10 viên", usage: "Uống 1 viên/ngày. Trị viêm mũi dị ứng, mề đay.", expiryDate: futureDate },
      { name: "Amlodipine 5mg", category: "Thuốc tim mạch, huyết áp", price: 30000, quantity: 90, unit: "Hộp 3 vỉ x 10 viên", usage: "Uống 1 viên vào buổi sáng. Kiểm soát huyết áp cao.", expiryDate: futureDate },
      { name: "Losartan 50mg", category: "Thuốc tim mạch, huyết áp", price: 50000, quantity: 10, unit: "Hộp 3 vỉ x 10 viên", usage: "Uống 1 viên/ngày theo chỉ định bác sĩ.", expiryDate: futureDate },
      { name: "Vitamin C 500mg", category: "Vitamin và Khoáng chất", price: 20000, quantity: 300, unit: "Lọ 100 viên nén", usage: "Uống 1-2 viên/ngày sau ăn. Bổ sung đề kháng.", expiryDate: futureDate },
      { name: "Nước muối sinh lý 0.9%", category: "Thuốc sát khuẩn", price: 5000, quantity: 500, unit: "Chai 500ml", usage: "Súc miệng, rửa mắt, rửa vết thương ngoài da.", expiryDate: futureDate },
      { name: "Berberin 100mg", category: "Thuốc tiêu hóa", price: 12000, quantity: 12, unit: "Lọ 100 viên bao đường", usage: "Uống 2-4 viên/lần x 2 lần/ngày. Trị nhiễm trùng đường ruột.", expiryDate: futureDate },
    ];
    await Medicine.insertMany(medicinesData);

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
