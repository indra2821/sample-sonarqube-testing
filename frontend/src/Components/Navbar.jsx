import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import edulogo from "../assets/edulogo.svg"; // Import logo

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/aboutus" },
    { name: "Courses", path: "/courses" },
    { name: "Instructors", path: "/instructors" },
    { name: "Events", path: "/events" },
    { name: "Contact Us", path: "/contactus" },
  ];

  return (
    <nav className="bg-white shadow-md w-full fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-10">
        <div className="flex justify-between h-16 items-center">
          {/* Logo & Brand */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={edulogo} alt="Educo Logo" className="h-10 w-auto mr-2" />
            <span className="text-2xl font-bold text-gray-900">EduMosaic</span>
          </div>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden lg:flex space-x-6 items-center">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`text-gray-600 hover:text-blue-500 transition duration-300 pb-2 ${
                  location.pathname === item.path
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          {/* Right Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <button
              onClick={() => navigate("/login")}
              className={`text-gray-600 hover:text-blue-500 transition duration-300 ${
                location.pathname === "/login"
                  ? "border-b-2 border-blue-500"
                  : ""
              }`}
            >
              Login
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 focus:outline-none"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md absolute w-full">
          <div className="flex flex-col space-y-4 py-4 px-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`text-gray-600 hover:text-blue-500 transition duration-300 ${
                  location.pathname === item.path
                    ? "border-b-2 border-blue-500"
                    : ""
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className={`text-gray-600 hover:text-blue-500 transition duration-300 ${
                location.pathname === "/login"
                  ? "border-b-2 border-blue-500"
                  : ""
              }`}
            >
              Login
            </button>
            <button
              onClick={() => {
                navigate("/signup");
                setIsOpen(false);
              }}
              className="bg-blue-500 text-white px-5 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Sign Up
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
