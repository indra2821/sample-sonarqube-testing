import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import signupSvg from "../assets/signup.png";
import edulogo from "../assets/edulogo.svg";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student"); // Default role
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !email) {
      setError("All fields are required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

 
      sessionStorage.setItem("email", email);
      navigate("/verify-otp", { state: { isSignup: true } });
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
          src={signupSvg}
          alt="Signup"
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
            Sign Up
          </h2>
          <p className="text-theme-secondary text-sm mb-4 text-center">
            Create an account and get started!
          </p>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded mb-4 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-theme-secondary mb-1"
              >
                Full Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input-theme w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required
              />
            </div>

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

            <div>
              <label
                htmlFor="role"
                className="block text-sm font-medium text-theme-secondary mb-1"
              >
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="input-theme w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                required
              >
                <option value="Student">Student</option>
                <option value="Instructor">Instructor</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 px-4 rounded-md transition-colors text-white font-medium text-sm"
            >
              {loading ? "Sending OTP..." : "Sign Up"}
            </button>

            <div className="flex justify-center items-center mt-2 text-sm space-x-1">
              <span className="text-theme-secondary">
                Already have an account?
              </span>
              <Link to="/login" className="text-blue-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
