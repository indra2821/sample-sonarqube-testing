import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../Redux/userSlice";
import edulogo from "../assets/edulogo.svg";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  
  const { name, role, isAuthenticated } = useSelector((state) => state.user);
  const isLoggedIn = isAuthenticated;

  useEffect(() => {
    const updateTheme = () => {
      if (isDarkMode) {
        document.documentElement.classList.add("dark");
        document.body.style.backgroundColor = "#000814";
      } else {
        document.documentElement.classList.remove("dark");
        document.body.style.backgroundColor = "#f2e9e4";
      }
    };

    updateTheme();
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
    window.dispatchEvent(new Event("theme-change"));
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

 
  const getFirstLetter = () => name ? name.charAt(0).toUpperCase() : "U";
  const getAvatarColor = () => {
    const colors = [
      "bg-blue-500", "bg-green-500", "bg-purple-500", 
      "bg-yellow-500", "bg-pink-500", "bg-indigo-500",
      "bg-red-500", "bg-orange-500", "bg-teal-500"
    ];
    return colors[(getFirstLetter().charCodeAt(0) % colors.length)];
  };

  const handleLogout = () => {
    dispatch(clearUser());
    navigate("/");
  };

  
  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/aboutus" },
    { name: "Courses", path: "/courses" },
    { name: "Instructors", path: "/instructors" },
    { name: "Contact Us", path: "/contactus" },
    ...(!isLoggedIn ? [{ name: "Login", path: "/login" }] : [])
  ];

  const navStyles = {
    backgroundColor: isDarkMode ? "#000814" : "#f2e9e4",
    textColor: isDarkMode ? "text-blue-300" : "text-blue-500"
  };

  return (
    <nav className="shadow-md w-full fixed top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: navStyles.backgroundColor }}>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex items-center cursor-pointer" onClick={() => navigate("/")}>
            <img src={edulogo} alt="Logo" className="h-8 sm:h-10 mr-2" />
            <span className={`text-xl sm:text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-800"}`}>
              EduMosaic
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${navStyles.textColor} hover:text-[#F77F00] px-3 py-2 text-sm ${
                  location.pathname === item.path ? "underline font-medium" : ""
                }`}
              >
                {item.name}
              </button>
            ))}

            {/* User Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-3 ml-4">
                <div className="text-right">
                  <p className={`text-xs ${navStyles.textColor}`}>{role}</p>
                  <p className={`text-sm ${isDarkMode ? "text-white" : "text-gray-800"}`}>
                    {name}
                  </p>
                </div>
                <div className={`${getAvatarColor()} w-8 h-8 rounded-full flex items-center justify-center text-white`}>
                  {getFirstLetter()}
                </div>
                <button 
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#05668D] text-white px-5 py-2 rounded-full hover:bg-[#F77F00] ml-2"
              >
                Sign Up
              </button>
            )}

            {/* Dark Mode Toggle */}
            <label className="flex items-center space-x-2 ml-4">
              <span className={`text-sm ${navStyles.textColor}`}>Light</span>
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only"
                />
                <div className="w-10 h-5 bg-gray-300 rounded-full shadow-inner">
                  <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                    isDarkMode ? "translate-x-5" : ""
                  }`} />
                </div>
              </div>
              <span className={`text-sm ${navStyles.textColor}`}>Dark</span>
            </label>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden text-2xl"
            aria-label="Toggle menu"
          >
            {isOpen ? "✕" : "☰"}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden absolute w-full" style={{ backgroundColor: navStyles.backgroundColor }}>
          <div className="px-4 pt-2 pb-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left ${navStyles.textColor} hover:text-[#F77F00] p-2`}
              >
                {item.name}
              </button>
            ))}

            {isLoggedIn && (
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className={`${getAvatarColor()} w-8 h-8 rounded-full flex items-center justify-center text-white`}>
                    {getFirstLetter()}
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? "text-white" : "text-gray-800"}`}>{name}</p>
                    <p className={`text-xs ${navStyles.textColor}`}>{role}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="ml-auto text-red-500 hover:text-red-700 text-sm"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <label className="flex items-center justify-between">
                <span className={navStyles.textColor}>Dark Mode</span>
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="toggle-checkbox"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;