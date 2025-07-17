const nodemailer = require("nodemailer");
require("dotenv").config();

const sendOTP = async (to, otp) => {
  try {
    console.log("📤 Sending OTP to:", to);  // 👈 NEW
    console.log("📧 Using EMAIL_USER:", process.env.EMAIL_USER);  // 👈 NEW

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"SmartFinance" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Your SmartFinance OTP Code",
      html: `<p>Your OTP code is: <strong>${otp}</strong></p>`,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully:", result.response);  // 👈 NEW
    return true;
  } catch (error) {
    console.error("❌ Failed to send OTP:", error);  // 👈 Shows real reason
    return false;
  }
};

module.exports = sendOTP;
