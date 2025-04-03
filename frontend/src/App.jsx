import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider, useSelector, useDispatch } from "react-redux";
import store from "./Redux/store";
import { useEffect } from "react";
import { selectIsDarkMode } from "./Redux/themeSlice";
import { checkAuthStatus, selectTokenChecked } from "./Redux/userSlice";
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
import CourseDetailsPage from "./pages/CourseDetailsPage";
import LoadingSpinner from "./Components/LoadingSpinner";
import ProtectedRoute from "./Components/ProtectedRoute";


const ThemeHandler = ( children }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.style.backgroundColor = isDarkMode ? "#000814" : "#f2e9e4";
  }, [isDarkMode]);

  return children;
};

function AppContent() {
  const dispatch = useDispatch();
  const tokenChecked = useSelector(selectTokenChecked);
  const isDarkMode = useSelector(selectIsDarkMode);

  // Check auth status when app loads
  useEffect(() => {
    dispatch(checkAuthStatus());
  }, [dispatch]);

  // Show loading spinner until we check auth status
  if (!tokenChecked) {
    return (
      <div
        className={`flex items-center justify-center h-screen ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <Router>
      <ThemeHandler>
        <div className="min-h-screen overflow-y-hidden">
          <Navbar />
          <div className="mt-10 min-h-screen overflow-y-hidden">
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
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="/verify-otp" element={<OtpVerification />} />
            <Route path="/courses/:id" element={<CourseDetailsPage />} />
          </Routes>
          </div>
        </div>
      </ThemeHandler>
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
