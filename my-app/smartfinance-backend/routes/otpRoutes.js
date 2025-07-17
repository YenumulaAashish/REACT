const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const sendOTP = require("../utils/sendOTP");

// In-memory OTP store (temporary, for demo)
const otpStore = {};

// 🔹 Send OTP to email
router.post("/send", async (req, res) => {
  const { email } = req.body;

  // Check if user already exists
  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const success = await sendOTP(email, otp);

  if (!success) return res.status(500).json({ error: "Failed to send OTP" });

  otpStore[email] = otp;
  console.log(`✅ OTP for ${email} is ${otp}`); // For testing
  res.json({ message: "OTP sent to email" });
});

// 🔹 Verify OTP and create user
router.post("/verify", async (req, res) => {
  const { email, otp, password } = req.body;

  // Validate OTP
  if (otpStore[email] !== otp) {
    return res.status(400).json({ success: false, message: "Invalid OTP" });
  }

  try {
    // Create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    // Clean up OTP store
    delete otpStore[email];

    res.json({ success: true, message: "Signup successful!" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ success: false, message: "Server error during signup" });
  }
});

module.exports = router;
