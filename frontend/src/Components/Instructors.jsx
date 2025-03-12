import gamerImg from "../assets/gamer.png";
import manImg from "../assets/man.png";
import womanImg from "../assets/woman.png";
import man1Img from "../assets/man1.png";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa";

const Instructors = () => {
  const instructors = [
    {
      name: "Theresa Webb",
      role: "Application Support Analyst Lead",
      description:
        "Former co-founder of Opendoor. Early staff at Spotify and Clearbit.",
      image: gamerImg,
      twitter: "https://twitter.com/theresawebb",
      linkedin: "https://linkedin.com/in/theresawebb",
    },
    {
      name: "Courtney Henry",
      role: "Director, Undergraduate Analytics and Planning",
      description: "Lead engineering teams at Figma, Pitch, and Protocol Labs.",
      image: manImg,
      twitter: "https://twitter.com/courtneyhenry",
      linkedin: "https://linkedin.com/in/courtneyhenry",
    },
    {
      name: "Albert Flores",
      role: "Career Educator",
      description: "Former PM for Linear, Lambda School, and On Deck.",
      image: womanImg,
      twitter: "https://twitter.com/albertflores",
      linkedin: "https://linkedin.com/in/albertflores",
    },
    {
      name: "Marvin McKinney",
      role: "Co-op & Internships Program & Operations Manager",
      description: "Former frontend dev for Linear, Coinbase, and Postscript.",
      image: man1Img,
      twitter: "https://twitter.com/marvinmckinney",
      linkedin: "https://linkedin.com/in/marvinmckinney",
    },
  ];

  return (
    <div className="container mx-auto text-center py-12">
      <h2 className="text-3xl font-bold text-black">Meet the Heroes</h2>
      <p className="text-gray-500 mt-2 max-w-2xl mx-auto">
        On Weekend UX, instructors from all over the world instruct millions of
        students. We offer the knowledge and abilities.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {instructors.map((instructor, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center"
          >
            <img
              src={instructor.image}
              alt={instructor.name}
              className="w-24 h-24 rounded-full mb-4"
            />
            <h3 className="text-lg font-semibold text-black">
              {instructor.name}
            </h3>
            <p className="text-sm text-theme-primary font-medium mt-1">
              {instructor.role}
            </p>
            <p className="text-gray-500 text-sm mt-2 text-center">
              {instructor.description}
            </p>
            <div className="flex space-x-4 mt-3">
              <a
                href={instructor.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-500 text-xl"
              >
                <FaXTwitter />
              </a>
              <a
                href={instructor.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-blue-700 text-xl"
              >
                <FaLinkedin />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Instructors;
