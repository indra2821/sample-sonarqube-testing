import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "./Components/Navbar";
import Home from "./pages/homepage";
import CoursesSection from "./Components/CoursesSection";

const About = () => <h1 className="text-center mt-10">About Us</h1>;
const Instructors = () => <h1 className="text-center mt-10">Instructors</h1>;
const Contact = () => <h1 className="text-center mt-10">Contact Us</h1>;
const Login = () => <h1 className="text-center mt-10">Login Page</h1>;
const Signup = () => <h1 className="text-center mt-10">Sign Up Page</h1>;
const Events = () => <h1 className="text-center mt-10">Events</h1>;

function App() {
  // Dark mode state (persisting in localStorage)
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    localStorage.setItem("theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <Router>
      <Navbar isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Home />
              <CoursesSection isDarkMode={isDarkMode} />{" "}
             
            </>
          }
        />
        <Route path="/aboutus" element={<About />} />
        <Route
          path="/courses"
          element={<CoursesSection isDarkMode={isDarkMode} />}
        />{" "}
        {/* Courses page */}
        <Route path="/instructors" element={<Instructors />} />
        <Route path="/events" element={<Events />} />
        <Route path="/contactus" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
