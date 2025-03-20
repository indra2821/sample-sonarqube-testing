import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useSelector } from "react-redux"; 
import store from "./Redux/store";
import { useEffect } from "react"; 
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
import LearningStats from "./Components/LearningStats";
import AllCoursesPage from "./pages/AllCoursesPage";

const ThemeHandler = ({ children }) => {
  const isDarkMode = useSelector(selectIsDarkMode); 

  useEffect(() => {
    
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return children;
};

function AppContent() {
  return (
    <Router>
      <ThemeHandler>
        <div className="min-h-screen">
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
            <Route path="/aboutus" element={<LearningStats />} />
            <Route path="/courses" element={<AllCoursesPage />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route
              path="/events"
              element={<h1 className="text-center mt-20">Events</h1>}
            />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard role="student" />} />
            <Route path="/verify-otp" element={<OtpVerification />} />
          </Routes>
        </div>
      </ThemeHandler>
    </Router>
  );
}

function App() {
  return (
    <Provider store={store}>
      {" "}
      
      <AppContent />
    </Provider>
  );
}

export default App;
