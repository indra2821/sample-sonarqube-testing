import { FaComments } from "react-icons/fa";
import edulogo from "../assets/edulogo.svg";
const Footer = () => {
  return (
    <footer className="bg-[var(--secondary)] text-[var(--text-light-primary)] py-12">
      <div className="container mx-auto px-6 lg:px-16 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <img src={edulogo} alt="EduMosaic Logo" className="h-8" />
            EduMosaic
          </h2>
          <p className="mt-3 text-[var(--text-light-primary)]">
            Faucibus quis fringilla scelerisque dui. Amet parturient dui
            venenatis amet sagittis viverra vel tincidunt.
          </p>
          <button className="mt-4 flex items-center gap-2 bg-[var(--primary-hover)] text-[var(--text-light-primary)] px-5 py-2 rounded-xl hover:bg-orange-600 transition-all duration-300">
            <FaComments />
            Start Live Chat
          </button>
        </div>

        {/* Middle Sections - Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Company</h3>
          <ul className="space-y-2 text-[var(--text-light-primary)]">
            <li>Home</li>
            <li>About Us</li>
            <li>Courses</li>
            <li>Instructors</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Resources</h3>
          <ul className="space-y-2 text-[var(--text-light-primary)]">
            <li>Community</li>
            <li>Video Guides</li>
            <li>Documentation</li>
            <li>Certification</li>
            <li>Scholarships</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-3">Help</h3>
          <ul className="space-y-2 text-[var(--text-light-primary)]">
            <li>Customer Support</li>
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-10 border-t border-gray-400 pt-4 text-center text-[var(--text-light-primary)]text-sm">
        <p>Copyright © 2025 EduMosaic</p>
        <p className="mt-1">Design By Aditya Jethwa</p>
      </div>
    </footer>
  );
};

export default Footer;
