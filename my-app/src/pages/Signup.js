import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const handleSendOTP = async () => {
    if (!email) return toast.error("Enter email first");
    try {
     await axios.post("http://localhost:5000/api/auth/signup/request-otp", { email });

      setShowOtpInput(true);
      toast.success("OTP sent to email");
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };
  

  const handleVerifyAndSignup = async () => {
  if (password !== confirmPassword) {
    return toast.error("Passwords do not match");
  }

  try {
    const res = await axios.post("http://localhost:5000/api/auth/signup/verify", {
      email,
      otp,
      password,
    });

    // ✅ CHECK IF token is received (not `res.data.success`)
    if (res.data.token) {
      toast.success("Signup successful!");
      window.location.href = "/login";
    } else {
      toast.error("Invalid OTP");
    }
  } catch (err) {
    console.error(err);
    toast.error("OTP verification failed");
  }
};


  return (
    <div className="container">
      <h2>Signup</h2>
      <input
        type="email"
        placeholder="Enter Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Enter Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br /><br />

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
      /><br /><br />

      {!showOtpInput ? (
        <button onClick={handleSendOTP}>Send OTP</button>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          /><br /><br />
          <button onClick={handleVerifyAndSignup}>Verify & Signup</button>
        </>
      )}
    </div>
  );
}

export default Signup;
