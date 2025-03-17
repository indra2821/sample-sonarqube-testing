import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import loginSvg from "../assets/login.svg";
import edulogo from "../assets/edulogo.svg";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5000/api/auth/login/send-otp",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

     
      sessionStorage.setItem("email", email);
      navigate("/verify-otp", { state: { isLogin: true } });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen">
      
      <div className="relative w-full md:w-1/2 bg-blue-800 hidden md:block">
        <img
          src={loginSvg}
          alt="Login"
          className="w-full h-full object-cover object-center"
        />
      </div>

      
      <div className="w-full md:w-1/2 bg-theme p-6 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="mb-4 flex items-center justify-center">
            <img src={edulogo} alt="Logo" className="h-8 mr-2" />
            <h2 className="text-xl font-bold text-theme-primary">EduMosaic</h2>
          </div>

          <h2 className="text-xl font-bold text-theme-primary mb-1 text-center">
            Sign In
          </h2>
          <p className="text-theme-secondary text-sm mb-4 text-center">
            Provide your email to receive OTP.
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-theme-secondary mb-1"
              >
                E-mail Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-theme w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 px-4 rounded-md transition-colors text-white font-medium text-sm"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="flex justify-center items-center mt-2 text-sm space-x-1">
              <span className="text-theme-secondary">Not a member?</span>
              <Link to="/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
