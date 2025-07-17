import { useState } from "react";
import { loginUser } from "../services/api";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login({ setUserEmail }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);

  const navigate = useNavigate();

  const handleSendOTP = async () => {
    if (!email) return toast.error("Enter email first");
    try {
      await axios.post("http://localhost:5000/api/otp/send", { email });
      setShowOtpInput(true);
      toast.success("OTP sent to email");
    } catch (err) {
      toast.error("Failed to send OTP");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify", {
        email,
        otp,
      });

      if (res.data.success) {
        const loginRes = await loginUser({ email, password });
        localStorage.setItem("token", loginRes.data.token);
        setUserEmail(email);
        toast.success("Login successful!");
        navigate("/");
      } else {
        toast.error("Invalid OTP");
      }
    } catch (err) {
      toast.error("Login failed or OTP incorrect");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br /><br />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        {!showOtpInput ? (
          <button type="button" onClick={handleSendOTP}>
            Send OTP
          </button>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            /><br /><br />
            <button type="submit">Login</button>
          </>
        )}
      </form>
    </div>
  );
}

export default Login;
