import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

const AuthForm = ({ type }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("student");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      const endpoint =
        type === "signup" ? "/api/auth/signup" : "/api/auth/login/send-otp";
      const payload = type === "signup" ? { name, email, role } : { email };

      const { data } = await axios.post(endpoint, payload, {
        withCredentials: true,
      });
      alert(data.message);
      setStep(2);
    } catch (error) {
      alert(error.response?.data?.message || "Error sending OTP");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const endpoint =
        type === "signup"
          ? "/api/auth/verify-otp"
          : "/api/auth/login/verify-otp";
      const { data } = await axios.post(
        endpoint,
        { email, otp },
        { withCredentials: true }
      );
      alert(data.message);
      navigate("/dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    }
  };

  return (
    <div className="auth-form">
      {step === 1 ? (
        <>
          {type === "signup" && (
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {type === "signup" && (
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          )}
          <button onClick={handleSendOtp}>Send OTP</button>
        </>
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <button onClick={handleVerifyOtp}>Verify OTP</button>
        </>
      )}
    </div>
  );
};
AuthForm.propTypes = {
  type: PropTypes.oneOf(["signup", "login"]).isRequired,
};

export default AuthForm;
