// ✅ server.js (Final version with auth + transaction routes)
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes"); // ✅ NEW
const connectDB = require("./config/db");

dotenv.config(); // Load .env variables

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB
connectDB();

// ✅ Middleware
app.use(cors());
app.use(express.json());

// ✅ API Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes); // ✅ Add this line

// ✅ Health Check Route
app.get("/", (req, res) => {
  res.send("SmartFinance Backend is Running 🎯");
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
const otpRoutes = require("./routes/otpRoutes");
app.use("/api/otp", otpRoutes); // ✅
