const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendOTP = require("../utils/sendOTP");

// In-memory OTP storage
const otpStore = {};

// 🔹 Step 1: Request OTP for Signup
router.post("/signup/request-otp", async (req, res) => {
  const { email } = req.body;

  const existing = await User.findOne({ email });
  if (existing) return res.status(400).json({ error: "User already exists" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const sent = await sendOTP(email, otp);

  if (!sent) return res.status(500).json({ error: "Failed to send OTP" });

  otpStore[email] = otp; // store OTP temporarily
  console.log("Generated OTP:", otp); // 🐞 for testing only

  res.json({ message: "OTP sent to your email" });
});

// 🔹 Step 2: Verify OTP and Create Account
router.post("/signup/verify", async (req, res) => {
  const { email, password, otp } = req.body;

  const expectedOtp = otpStore[email];
  if (!expectedOtp || otp != expectedOtp)
{
    return res.status(400).json({ error: "Invalid or expired OTP" });
  }

  // OTP matched — create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ email, password: hashedPassword });
  await newUser.save();

  delete otpStore[email]; // clean up used OTP

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ success: true, token });

});

// 🔹 Login with password (optional: add OTP later)
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.status(404).json({ error: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.json({ token });
});

module.exports = router;
