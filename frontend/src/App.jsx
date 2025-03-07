import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";

const Home = () => <h1 className="text-center mt-10">Home Page</h1>;
const About = () => <h1 className="text-center mt-10">About Us</h1>;
const Courses = () => <h1 className="text-center mt-10">Courses</h1>;
const Instructors = () => <h1 className="text-center mt-10">Instructors</h1>;
const Events = () => <h1 className="text-center mt-10">Events</h1>;
const Contact = () => <h1 className="text-center mt-10">Contact Us</h1>;
const Login = () => <h1 className="text-center mt-10">Login Page</h1>;
const Signup = () => <h1 className="text-center mt-10">Sign Up Page</h1>;

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/aboutus" element={<About />} />
        <Route path="/courses" element={<Courses />} />
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
