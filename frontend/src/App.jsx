import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./Redux/store";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "./Redux/themeSlice";
import Navbar from "./Components/Navbar";
import Home from "./pages/Homepage";
import CoursesSection from "./Components/CoursesSection";
import LearningPage from "./Components/LearningStats";
import GetStarted from "./Components/GetStarted";

const About = () => (
  <h1 className="text-center mt-20 text-theme-primary">About Us</h1>
);
const Instructors = () => (
  <h1 className="text-center mt-20 text-theme-primary">Instructors</h1>
);
const Contact = () => (
  <h1 className="text-center mt-20 text-theme-primary">Contact Us</h1>
);
const Login = () => (
  <h1 className="text-center mt-20 text-theme-primary">Login Page</h1>
);
const Signup = () => (
  <h1 className="text-center mt-20 text-theme-primary">Sign Up Page</h1>
);
const Events = () => (
  <h1 className="text-center mt-20 text-theme-primary">Events</h1>
);

// Theme initialization component
const ThemeInitializer = ({ children }) => {
  const isDarkMode = useSelector(selectIsDarkMode);

  useEffect(() => {
    // Initialize theme on app load
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
                  <CoursesSection />
                  <LearningPage />
                  <GetStarted />
                </>
              }
            />
            <Route path="/aboutus" element={<About />} />
            <Route path="/courses" element={<CoursesSection />} />
            <Route path="/instructors" element={<Instructors />} />
            <Route path="/events" element={<Events />} />
            <Route path="/contactus" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
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
