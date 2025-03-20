import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";
import L from "leaflet";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../Redux/themeSlice";
import { FaYoutube, FaInstagram, FaTwitter } from "react-icons/fa";

const ContactUs = () => {
  const position = [23.052168005286873, 72.54698522516676];
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

 
  useEffect(() => {
    
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    });
  }, []);

  
  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[var(--bg-primary)] transition-colors duration-300">
      <div className="bg-[var(--bg-secondary)] p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row border border-[var(--border-color)] transition-colors duration-300">
        {/* Dark Mode Toggle */}
        <button
          onClick={handleToggleDarkMode}
          className="absolute top-4 right-4 p-2 rounded-full bg-[var(--bg-secondary)]"
        >
          {darkMode ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-yellow-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>

        {/* Left Section - Form */}
        <div className="md:w-1/2 pr-0 md:pr-8">
          <h2 className="text-3xl font-bold text-[var(--primary)] mb-4">
            CONTACT US
          </h2>
          <p className="mb-6 text-[var(--text-primary)] text-lg">
            Leave us a message
          </p>

          <form className="space-y-6">
            <div>
              <label className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                Name
              </label>
              <input
                type="text"
                placeholder="First Name Last Name"
                className="w-full px-4 py-3 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--placeholder)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--placeholder)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-300"
              />
            </div>

            <div>
              <label className="block text-[var(--text-primary)] text-sm font-medium mb-2">
                Your Message
              </label>
              <textarea
                placeholder="Your Message"
                className="w-full px-4 py-3 bg-[var(--input-bg)] border-[var(--border-color)] text-[var(--text-primary)] placeholder-[var(--placeholder)] border rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--primary)] transition-colors duration-300 h-40"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--text-light-primary)] py-3 rounded-lg font-semibold transition-colors duration-300"
            >
              Send
            </button>
          </form>
        </div>

        {/* Right Section - Contact Info */}
        <div className="md:w-1/2 mt-8 md:mt-0 md:pl-8 md:border-l md:border-[var(--border-color)]">
          <h3 className="text-2xl font-semibold text-[var(--primary)] mb-6">
            eQuest Solutions
          </h3>
          <p className="text-[var(--text-primary)] mb-4 text-sm">
            1305-1312 SKD Surya Icon 132 Feet Ring Road, AEC Cross Rd, opp.
            Torrent Power, Naranpura, Ahmedabad, Gujarat 380013
          </p>
          <p className="text-[var(--text-primary)] mb-4 text-sm">
            +91 07940059475
          </p>
          <p className="text-[var(--text-primary)] mb-6 text-sm">
            <a
              href="https://equestsolutions.net/"
              className="hover:text-[var(--primary)] transition-colors duration-300"
            >
              https://equestsolutions.net/
            </a>
          </p>

          {/* Social Media Icons */}
          <div className="flex space-x-6 mb-8">
            <a
              href="#"
              className="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300"
            >
              <FaYoutube className="text-2xl" />
            </a>
            <a
              href="#"
              className="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="#"
              className="text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors duration-300"
            >
              <FaTwitter className="text-2xl" />
            </a>
          </div>

          {/* Leaflet Map */}
          <div className="w-full h-60 rounded-lg overflow-hidden border border-[var(--border-color)] transition-colors duration-300">
            <MapContainer
              center={position}
              zoom={15}
              className="w-full h-full z-10"
              attributionControl={false}
              style={{
                filter: darkMode
                  ? "invert(100%) hue-rotate(180deg) brightness(95%) contrast(90%)"
                  : "none",
              }}
            >
              <TileLayer
                url={
                  darkMode
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
              />
              <Marker position={position}>
                <Popup className="bg-[var(--popup-bg)] text-[var(--text-primary)]">
                  eQuest Solutions, SKD Surya Icon 132 Feet Ring Road, AEC Cross
                  Rd, opp. Torrent Power, Naranpura, Ahmedabad, Gujarat 380013.
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
