import { useState, useEffect } from "react";
import home1 from "../assets/home1.svg";
import { useNavigate } from "react-router-dom";

const Homepage = () => {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // Listen for changes in the theme
  useEffect(() => {
    const updateTheme = () => {
      setIsDarkMode(localStorage.getItem("theme") === "dark");
    };

    window.addEventListener("theme-change", updateTheme);
    return () => window.removeEventListener("theme-change", updateTheme);
  }, []);

  return (
    <div
      className={`w-full pt-20 ${isDarkMode ? "bg-[#000814] text-white" : "bg-[#f2e9e4] text-gray-900"}`}
    >
      

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        
          <div className="text-center lg:text-left order-2 lg:order-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              You bring the <span className="text-[#F77F00]">expertise</span>,
              <br />
              {"we'll make it unforgettable."}
            </h1>
            <p className="text-base sm:text-lg mb-8">
              Using highly personalized activities, videos, and animations, you
              can energize your students and help them achieve their learning
              goals as they progress through a journey.
            </p>

            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button
                onClick={() => navigate("/signup")}
                className="bg-[#F77F00] text-white font-medium py-3 px-6 rounded-4xl transition duration-300 flex items-center justify-center space-x-2 hover:bg-[#05668D]"
              >
                <span>Register</span>
                <span>→</span>
              </button>

              <button
                onClick={() => navigate("/login")}
                className="border border-[#F77F00] text-[#F77F00] font-medium py-3 px-6 rounded-4xl transition duration-300 flex items-center justify-center space-x-2 hover:bg-[#F77F00] hover:text-white"
              >
                <span>Login</span>
                <span>→</span>
              </button>
            </div>
          </div>

          
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <img
              src={home1}
              alt="Education illustration"
              className="w-full max-w-md lg:max-w-lg xl:max-w-xl object-contain"
            />
          </div>
        </div>
      </div>

      
      <div
        className={`w-full py-8 ${isDarkMode ? "bg-[#000814]" : "bg-[#f2e9e4]"}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 rounded-lg">
           
            <div className="space-y-2">
              <label className="block text-base sm:text-lg font-medium">
                Select Course
              </label>
              <select
                className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-[#f2e9e4] border-gray-300"} border`}
              >
                <option>Web Development</option>
                <option>Data Science</option>
                <option>UI/UX Design</option>
              </select>
            </div>

            
            <div className="space-y-2">
              <label className="block text-base sm:text-lg font-medium">
                Select Instructor
              </label>
              <select
                className={`w-full p-3 rounded-lg ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-[#f2e9e4] border-gray-300"} border`}
              >
                <option>John Doe</option>
                <option>Jane Smith</option>
                <option>Emily Davis</option>
              </select>
            </div>

            
            <div className="flex items-end">
              <button className="w-full bg-[#05668D] text-white font-medium py-3 px-6 rounded-lg transition duration-300 hover:bg-[#F77F00]">
                Search →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
