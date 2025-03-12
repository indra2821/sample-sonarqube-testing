import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: "What is  EduMosaic?",
      answer: " EduMosaic is a learning platform offering various courses.",
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
    <div className="p-6 text-center bg-[var(--bg-light)] dark:bg-[var(--bg-dark)] transition-all duration-300">
      <h2 className="text-4xl font-semibold mb-6 text-gray-900 dark:text-white">
        FAQs
      </h2>

      <div className="w-full max-w-3xl mx-auto space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="rounded-xl shadow-md bg-white dark:bg-gray-900 transition-all duration-300"
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
              <div className="p-4 text-lg text-gray-900 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-b-xl transition-all duration-300">
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
