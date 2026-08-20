require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Routes

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const patientRoutes = require("./routes/patientRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const userRoutes = require("./routes/userRoutes");
const medicineRoutes = require("./routes/medicineRoutes");
const settingRoutes = require("./routes/settingRoutes");
const newsRoutes = require("./routes/newsRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const sepayRoutes = require("./routes/sepayRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// Serve uploaded images as static files
const path = require("path");
app.use("/uploads", require("express").static(path.join(__dirname, "../public/uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medicines", medicineRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/webhooks", sepayRoutes);

// Socket.io Setup for real-time notifications/chat
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/ql_benhvien";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Basic Route
app.get("/", (req, res) => {
  res.send("Hospital Management System API is running");
});

// Setup background reminder email scanner job
const Appointment = require("./models/Appointment");
const SystemSetting = require("./models/SystemSetting");
const { sendAppointmentReminder } = require("./utils/emailService");

const getAppointmentStartDateTime = (app) => {
  if (!app.date || !app.time) return null;
  const d = new Date(app.date);
  const year = d.getFullYear();
  const month = d.getMonth();
  const date = d.getDate();
  
  // Parse time (either "HH:MM" or similar)
  const timeStr = app.time.trim();
  const timeMatch = timeStr.match(/^(\d{1,2}):(\d{2})/);
  if (!timeMatch) return null;
  
  const hours = parseInt(timeMatch[1], 10);
  const minutes = parseInt(timeMatch[2], 10);
  
  return new Date(year, month, date, hours, minutes);
};

const runReminderJob = async () => {
  try {
    const setting = await SystemSetting.findOne({ key: "reminder_hours" });
    const hours = setting ? Number(setting.value) : 3;

    if (hours <= 0) return; // 0 means reminders disabled

    // Fetch approved appointments that haven't received reminder
    const appointments = await Appointment.find({
      status: "approved",
      reminderSent: { $ne: true },
      email: { $exists: true, $ne: "" }
    });

    const now = new Date();

    for (const app of appointments) {
      const startTime = getAppointmentStartDateTime(app);
      if (!startTime) continue;

      const diffMs = startTime - now;
      const diffHours = diffMs / (1000 * 60 * 60);

      // If scheduled start time is within the lead time window
      if (diffHours > 0 && diffHours <= hours) {
        const success = await sendAppointmentReminder(app, hours);
        if (success) {
          app.reminderSent = true;
          await app.save();
        }
      }
    }
  } catch (error) {
    console.error("[ReminderJob] Lỗi quét và gửi email nhắc lịch:", error);
  }
};

// Run background job immediately and then every 1 minute
setTimeout(() => {
  runReminderJob();
  setInterval(runReminderJob, 60000);
}, 5000);
