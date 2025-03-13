import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLogin = location.state?.isLogin || false;

  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(300);

  useEffect(() => {
    const storedEmail = sessionStorage.getItem("email");
    if (!storedEmail) {
      navigate(isLogin ? "/login" : "/signup");
      return;
    }
    setEmail(storedEmail);

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate, isLogin]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!otp) {
      setError("Please enter the OTP");
      return;
    }

    try {
      setLoading(true);
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login/verify-otp"
        : "http://localhost:5000/api/auth/verify-otp";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      sessionStorage.removeItem("email");
      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    try {
      setLoading(true);
      const endpoint = isLogin
        ? "http://localhost:5000/api/auth/login/send-otp"
        : "http://localhost:5000/api/auth/signup";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      setCountdown(300);
      setError("");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-theme flex items-center justify-center p-4">
      <div className="bg-theme border border-theme rounded-lg shadow-lg max-w-md w-full p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-theme-primary mb-2">
            Verify Your Email
          </h2>
          <p className="text-theme-secondary">
            We have sent a 6-digit code to{" "}
            <span className="font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-theme-secondary mb-1"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="input-theme w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-center text-lg tracking-widest"
              maxLength="6"
              required
            />
          </div>

          <div className="text-center text-sm text-theme-secondary">
            <p>
              OTP expires in{" "}
              <span className="font-medium">{formatTime(countdown)}</span>
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-2 px-4 rounded-md transition-colors text-white font-medium"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-theme-secondary">
            Did not receive the code?{" "}
            {countdown === 0 ? (
              <button
                onClick={resendOtp}
                disabled={loading}
                className="text-primary hover:underline font-medium"
              >
                Resend OTP
              </button>
            ) : (
              <span className="text-gray-400">
                Resend OTP in {formatTime(countdown)}
              </span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
