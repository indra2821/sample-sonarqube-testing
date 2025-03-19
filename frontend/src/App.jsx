import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "./Redux/themeSlice";
import Navbar from "./Components/Navbar";
import Home from "./pages/Homepage";
import CoursesCarousel from "./Components/CoursesCarousel";
import LearningPage from "./Components/LearningStats";
import GetStarted from "./Components/GetStarted";
import Instructors from "./Components/Instructors";
import HowItWorks from "./Components/HowItWorks";
import Benefits from "./Components/Benefits";
import FAQ from "./Components/FAQ";
import Footer from "./Components/Footer";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import OtpVerification from "./pages/OtpVerification";
import ContactUs from "./Components/ContactUs";



const About = () => (
  <h1 className="text-center mt-20 text-theme-primary">About Us</h1>
);
const Contact = () => (
  <h1 className="text-center mt-20 text-theme-primary">Contact Us</h1>
);
const Events = () => (
  <h1 className="text-center mt-20 text-theme-primary">Events</h1>
);

const ThemeInitializer = ({ children }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      document.body.style.backgroundColor = "#000814";
    } else {
      document.documentElement.classList.remove("dark");
      document.body.style.backgroundColor = "#f2e9e4";
    }
  }, [isDarkMode]);

  return children;
};

function AppContent() {
  return (
    <Router>
      <ThemeInitializer>
        <div className="bg-theme min-h-screen">
          <Navbar />
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Home />
                  <CoursesCarousel />
                  <LearningPage />
                  <Instructors />
                  <GetStarted />
                  <HowItWorks />
                  <Benefits />
                  <FAQ />
                  <ContactUs />
                  <Footer />
                </>
              }
            />
            <Route path="/aboutus" element={<About />} />
            <Route path="/courses" element={<CoursesCarousel />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contactus" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard role="student" />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
          </Routes>
        </div>
      </ThemeInitializer>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
