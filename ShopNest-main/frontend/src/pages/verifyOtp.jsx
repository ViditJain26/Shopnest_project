import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../styles/auth.css";

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Account verified successfully!");
        if (login) login(data);
        navigate("/");
      } else {
        alert(data.message || "OTP verification failed");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong during verification.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleVerify} className="auth-form">
        <h2>Verify OTP</h2>
        <p style={{ color: "#aaa", marginBottom: "1rem", fontSize: "0.9rem" }}>
          Enter the 6-digit verification code sent to your email.
        </p>

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Enter 6-Digit OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          required
        />

        <button type="submit" className="btn">
          Verify Account
        </button>
      </form>
    </div>
  );
};

export default VerifyOtp;
