import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleDarkMode } from "../Redux/themeSlice";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const darkMode = useSelector((state) => state.theme.darkMode);
  const dispatch = useDispatch();

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleToggleDarkMode = () => {
    dispatch(toggleDarkMode());
  };

  const faqs = [
    {
      question: "What is EduMosaic?",
      answer: "EduMosaic is a learning platform offering various courses.",
    },
    {
      question: "Who provides the courses?",
      answer: "Courses are provided by industry experts and professionals.",
    },
    {
      question: "How long does it take to get your certificate?",
      answer: "Certificates are provided immediately after completion.",
    },
  ];

  return (
    <div
      className={`p-6 text-center ${darkMode ? "bg-[var(--bg-dark)]" : "bg-[var(--bg-light)]"} transition-all duration-300`}
    >
      {/* Dark Mode Toggle Button */}
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

      <h2
        className={`text-4xl font-semibold mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}
      >
        FAQs
      </h2>
      <div className="w-full max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-md ${darkMode ? "bg-gray-900" : "bg-white"} transition-all duration-300`}
          >
            <button
              className="w-full flex justify-between items-center bg-[var(--primary)] text-white text-lg font-semibold p-4 rounded-xl hover:bg-[var(--primary-hover)] transition-all duration-300"
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
              <FaChevronDown
                className={`transition-transform duration-300 text-xl ${
                  openIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            {openIndex === index && (
              <div
                className={`p-4 text-lg ${darkMode ? "text-gray-200 bg-gray-800" : "text-gray-900 bg-gray-100"} rounded-b-xl transition-all duration-300`}
              >
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="mt-6 px-8 py-3 text-lg font-bold text-white bg-[var(--primary-hover)] rounded-xl hover:bg-[var(--primary)] transition-all duration-300">
        See all FAQs
      </button>
    </div>
  );
};

export default FAQ;