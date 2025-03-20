import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../Redux/userSlice";
import { toggleDarkMode, selectIsDarkMode } from "../Redux/themeSlice";
import edulogo from "../assets/edulogo.svg";

const Navbar = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const { name, role, isAuthenticated } = useSelector((state) => state.user);
  const isLoggedIn = isAuthenticated;

  // Update theme when isDarkMode changes
  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.classList.toggle("dark", isDarkMode);
      document.body.style.backgroundColor = isDarkMode ? "#000814" : "#f2e9e4";
    };

    updateTheme();
  }, [isDarkMode]);

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const getFirstLetter = () => (name ? name.charAt(0).toUpperCase() : "U");

  const getAvatarColor = () => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-yellow-500",
      "bg-pink-500",
      "bg-indigo-500",
      "bg-red-500",
      "bg-orange-500",
      "bg-teal-500",
    ];
    return colors[getFirstLetter().charCodeAt(0) % colors.length];
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
    ...(!isLoggedIn ? [{ name: "Login", path: "/login" }] : []),
  ];

  const navStyles = {
    backgroundColor: isDarkMode ? "#000814" : "#f2e9e4",
    textColor: isDarkMode ? "text-gray-200" : "text-gray-700",
  };

  return (
    <nav
      className="shadow-md w-full fixed top-0 z-50 transition-colors duration-300"
      style={{ backgroundColor: navStyles.backgroundColor }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={edulogo} alt="Logo" className="h-8 sm:h-10 mr-2" />
            <span
              className={`text-xl sm:text-2xl font-bold ${
                isDarkMode ? "text-white" : "text-gray-800"
              }`}
            >
              EduMosaic
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${navStyles.textColor} hover:text-[#F77F00] px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  location.pathname === item.path ? "text-[#F77F00]" : ""
                }`}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.name}
              </button>
            ))}

            {/* User Section */}
            {isLoggedIn ? (
              <div className="flex items-center space-x-4 ml-4">
                <div className="text-right">
                  <p className={`text-xs ${navStyles.textColor} font-medium`}>
                    {role}
                  </p>
                  <p
                    className={`text-sm ${
                      isDarkMode ? "text-white" : "text-gray-800"
                    } font-semibold`}
                  >
                    {name}
                  </p>
                </div>
                <div
                  className={`${getAvatarColor()} w-9 h-9 rounded-full flex items-center justify-center text-white cursor-pointer hover:opacity-90 transition-opacity duration-200`}
                >
                  {getFirstLetter()}
                </div>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#05668D] text-white px-5 py-2 rounded-full hover:bg-[#F77F00] ml-2 transition-colors duration-200 font-medium"
              >
                Sign Up
              </button>
            )}

            {/* Dark Mode Toggle */}
            <label className="flex items-center space-x-2 ml-4">
              <div className="relative">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={handleToggleDarkMode}
                  className="sr-only"
                  aria-label="Toggle dark mode"
                />
                <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner transition-colors duration-300">
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                      isDarkMode ? "translate-x-6" : ""
                    }`}
                  />
                </div>
              </div>
              <span className={`text-sm ${navStyles.textColor}`}>
                {isDarkMode ? "Dark" : "Light"}
              </span>
            </label>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-gray-800 dark:text-gray-200"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="lg:hidden absolute w-full z-50 shadow-lg"
          style={{ backgroundColor: navStyles.backgroundColor }}
        >
          <div className="px-4 pt-2 pb-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setIsOpen(false);
                }}
                className={`block w-full text-left ${
                  navStyles.textColor
                } hover:text-[#F77F00] p-3 rounded-md transition-colors duration-200 ${
                  location.pathname === item.path
                    ? "bg-gray-100 dark:bg-gray-800 text-[#F77F00]"
                    : ""
                }`}
                aria-current={
                  location.pathname === item.path ? "page" : undefined
                }
              >
                {item.name}
              </button>
            ))}

            {!isLoggedIn && (
              <button
                onClick={() => {
                  navigate("/signup");
                  setIsOpen(false);
                }}
                className="w-full bg-[#05668D] text-white px-5 py-2.5 rounded-full hover:bg-[#F77F00] mt-2 text-sm font-medium transition-colors duration-200"
              >
                Sign Up
              </button>
            )}

            {isLoggedIn && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between w-full p-3 rounded-md bg-gray-100 dark:bg-gray-800">
                  <div className="flex items-center space-x-3">
                    <div
                      className={`${getAvatarColor()} w-9 h-9 rounded-full flex items-center justify-center text-white`}
                    >
                      {getFirstLetter()}
                    </div>
                    <div>
                      <p
                        className={`font-semibold ${
                          isDarkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {name}
                      </p>
                      <p className={`text-xs ${navStyles.textColor}`}>{role}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 rounded-md transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Dark Mode Toggle */}
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <label className="flex items-center justify-between p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200">
                <span className={`text-sm ${navStyles.textColor}`}>
                  {isDarkMode ? "Dark Mode" : "Light Mode"}
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={isDarkMode}
                    onChange={handleToggleDarkMode}
                    className="sr-only"
                    aria-label="Toggle dark mode"
                  />
                  <div className="w-12 h-6 bg-gray-300 dark:bg-gray-600 rounded-full shadow-inner transition-colors duration-300">
                    <div
                      className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-300 ${
                        isDarkMode ? "translate-x-6" : ""
                      }`}
                    />
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
