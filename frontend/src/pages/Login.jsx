import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

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

      
      const text = await response.text();
      const data = text ? JSON.parse(text) : {}; 

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
    navigate("/otp-verification", { state: { isLogin: true } });
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
     
      <div className="hidden md:block md:w-1/2 bg-blue-700">
        <div className="flex items-center justify-center h-full p-8 relative">
          <div className="absolute top-12 left-12">
            <span className="inline-flex items-center px-3 py-1 bg-white text-primary font-medium text-sm rounded-full">
              <span className="mr-1">⏱️</span>
              Learning at your own pace.
            </span>
          </div>
          <div className="w-full max-w-md">
            <img
              src="/api/placeholder/400/400"
              alt="Student learning"
              className="w-full object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>

      <div className="w-full md:w-1/2 bg-theme p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="mb-4 flex justify-center">
              <img
                src="/api/placeholder/48/48"
                alt="Kracademy Logo"
                className="h-12 w-auto"
              />
            </div>
            <h2 className="text-2xl font-bold text-theme-primary mb-1">
              Sign In
            </h2>
            <p className="text-theme-secondary text-sm">
              Enter your email to receive an OTP for secure login.
            </p>
          </div>

        
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          
          <form onSubmit={handleSubmit} className="space-y-6">
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
                className="input-theme w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2 px-4 rounded-md transition-colors text-white font-medium"
            >
              {loading ? "Sending OTP..." : "Login with OTP"}
            </button>
          </form>

         
          <div className="mt-6 text-center">
            <p className="text-sm text-theme-secondary">
              Not a member?{" "}
              <Link to="/signup" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
