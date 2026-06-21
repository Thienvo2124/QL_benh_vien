require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./src/models/User");
const Patient = require("./src/models/Patient");
const Appointment = require("./src/models/Appointment");

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
    // TODO: Clear MedicalRecord and Medicine when models are ready

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

    // 4. TODO: Seed Medical Records and Medicines
    console.log("Note: MedicalRecord and Medicine seeding skipped (Models not yet implemented by Backend team).");

    console.log("Data seeded successfully!");
    process.exit();
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  }
};

seedData();
