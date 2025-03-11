import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import edulogo from "../assets/edulogo.svg";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  
  useEffect(() => {
    
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000814";
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f2e9e4";
      localStorage.setItem("theme", "light");
    }
    window.dispatchEvent(new Event("theme-change"));

    // Force a re-render after DOM changes
    const forceUpdate = setTimeout(() => {
      const navElement = document.querySelector("nav");
      if (navElement) {
        if (isDarkMode) {
          navElement.style.backgroundColor = "#000814";
          navElement.classList.add("dark-mode");
        } else {
          navElement.style.backgroundColor = "#f2e9e4";
          navElement.classList.remove("dark-mode");
        }
      }
    }, 10);

    return () => clearTimeout(forceUpdate);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/aboutus" },
    { name: "Courses", path: "/courses" },
    { name: "Instructors", path: "/instructors" },
    { name: "Contact Us", path: "/contactus" },
    { name: "Login", path: "/login" },
  ];

  
  const navBgColor = isDarkMode ? "#000814" : "#f2e9e4";
  const textColor = isDarkMode ? "text-blue-300" : "text-blue-500";

  return (
    <nav
      className="shadow-md w-full fixed top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: navBgColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/")}
            >
              <img
                src={edulogo}
                alt="EduMosaic Logo"
                className="h-8 w-auto mr-2 sm:h-10"
              />
              <span
                className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}
              >
                EduMosaic
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${textColor} hover:text-[#F77F00] transition duration-100 px-2 xl:px-3 py-2 text-sm xl:text-base ${
                  location.pathname === item.path ? "underline font-medium" : ""
                }`}
              >
                {item.name}
              </button>
            ))}

            <button
              onClick={() => navigate("/signup")}
              className="bg-[#05668D] text-white px-3 xl:px-5 py-2 rounded-4xl hover:bg-[#F77F00] transition duration-100 text-sm xl:text-base ml-1"
            >
              Sign Up
            </button>

            <div className="flex items-center ml-2 xl:ml-4">
              <label className="inline-flex items-center cursor-pointer">
                <span className={`mr-1 text-xs xl:text-sm ${textColor}`}>
                  Light
                </span>
                <div className="relative inline-block w-8 xl:w-10 align-middle select-none">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="desktop-toggle"
                    className="opacity-0 absolute h-0 w-0"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="bg-gray-300 block w-8 xl:w-10 h-4 xl:h-5 rounded-full"></div>
                  <div
                    className={`absolute block w-3 xl:w-4 h-3 xl:h-4 rounded-full bg-white top-0.5 left-0.5 transition-transform duration-300 ease-in-out ${
                      isDarkMode
                        ? "transform translate-x-4 xl:translate-x-5"
                        : ""
                    }`}
                  ></div>
                </div>
                <span className={`ml-1 text-xs xl:text-sm ${textColor}`}>
                  Dark
                </span>
              </label>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`${textColor} focus:outline-none text-xl`}
              aria-label="Toggle menu"
            >
              {isOpen ? "✖" : "☰"}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="lg:hidden shadow-md absolute w-full transition-colors duration-300 py-2"
          style={{ backgroundColor: navBgColor }}
        >
          <div className="flex flex-col space-y-3 px-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`${textColor} hover:text-[#F77F00] transition duration-300 text-left py-1 ${
                  location.pathname === item.path ? "underline font-medium" : ""
                }`}
              >
                {item.name}
              </button>
            ))}
            <button
              onClick={() => {
                navigate("/signup");
                setIsOpen(false);
              }}
              className="bg-[#05668D] text-white px-5 py-2 rounded-lg hover:bg-[#F77F00] transition duration-300 mt-2 text-left w-full sm:w-auto"
            >
              Sign Up
            </button>

            {/* Dark Mode Toggle for Mobile - Inside Menu */}
            <div
              className={`flex items-center justify-between py-2 border-t ${isDarkMode ? "border-gray-700" : "border-gray-200"} mt-2`}
            >
              <span className={textColor}>Appearance</span>
              <label className="inline-flex items-center cursor-pointer">
                <span className={`mr-2 text-sm ${textColor}`}>Light</span>
                <div className="relative inline-block w-10 align-middle select-none">
                  <input
                    type="checkbox"
                    name="toggle"
                    id="mobile-toggle"
                    className="opacity-0 absolute h-0 w-0"
                    checked={isDarkMode}
                    onChange={toggleDarkMode}
                  />
                  <div className="bg-gray-300 block w-10 h-5 rounded-full"></div>
                  <div
                    className={`absolute block w-4 h-4 rounded-full bg-white top-0.5 left-0.5 transition-transform duration-300 ease-in-out ${
                      isDarkMode ? "transform translate-x-5" : ""
                    }`}
                  ></div>
                </div>
                <span className={`ml-2 text-sm ${textColor}`}>Dark</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
