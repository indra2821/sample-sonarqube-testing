import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ContactUs = () => {
  const position = [23.052168005286873, 72.54698522516676];

  return (
    <div className="flex justify-center items-center min-h-screen bg-theme">
      <div className="bg-theme p-8 rounded-2xl shadow-lg w-full max-w-4xl flex flex-col md:flex-row border-theme">
        {/* Left Section - Form */}
        <div className="md:w-1/2 pr-8">
          <h2 className="text-2xl font-bold text-theme-primary mb-4">
            CONTACT US
          </h2>
          <p className="mb-6 text-theme-secondary">Leave us a message</p>

          <form className="space-y-4">
            <div>
              <label className="block text-theme-primary">Name</label>
              <input
                type="text"
                placeholder="First_Name Last_Name"
                className="w-full px-4 py-2 input-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-theme-primary">Email Address</label>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-2 input-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div>
              <label className="block text-theme-primary">Your Message</label>
              <textarea
                placeholder="Your Message"
                className="w-full px-4 py-2 input-theme rounded-lg focus:outline-none focus:ring-2 focus:ring-primary h-32"
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full btn-primary py-2 rounded-lg"
            >
              Send
            </button>
          </form>
        </div>

        {/* Right Section - Contact Info */}
        <div className="md:w-1/2 mt-8 md:mt-0">
          <h3 className="text-xl font-semibold text-theme-primary mb-4">
            eQuest Solutions
          </h3>
          <p className="text-theme-secondary mb-2">
            1305-1312 SKD Surya Icon 132 Feet Ring Road, AEC Cross Rd, opp.
            Torrent Power, Naranpura, Ahmedabad, Gujarat 380013
          </p>
          <p className="text-theme-secondary mb-2">+91 07940059475</p>
          <p className="text-theme-secondary mb-6">
            https://equestsolutions.net/
          </p>

          {/* Social Media Icons */}
          <div className="flex space-x-4 mb-6">
            <a href="#" className="text-theme-secondary hover:text-primary">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="#" className="text-theme-secondary hover:text-primary">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="#" className="text-theme-secondary hover:text-primary">
              <i className="fab fa-twitter"></i>
            </a>
          </div>

          {/* Leaflet Map */}
          <div className="w-full h-40 rounded-lg overflow-hidden border border-theme">
            <MapContainer
              center={position}
              zoom={15}
              className="w-full h-full"
              attributionControl={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={position}>
                <Popup>
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
