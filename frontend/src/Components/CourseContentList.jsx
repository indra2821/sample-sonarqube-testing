import ContentItem from "./ContentItem";
import { FaLock } from "react-icons/fa";
import PropTypes from "prop-types";

const CourseContentList = ({
  contents,
  enrolled,
  enrolling,
  handleEnroll,
  isDarkMode,
  activeContent,
  handleContentSelect,
}) => {
  if (!enrolled) {
    return (
      <div
        className={`p-6 rounded-xl text-center shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaLock className="text-xl text-gray-600 dark:text-gray-300" />
          </div>
          <h3
            className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Content Locked
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            You need to enroll in this course to access the content
          </p>
          <button
            onClick={handleEnroll}
            disabled={enrolling}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            } ${enrolling ? "opacity-70 cursor-not-allowed" : ""}`}
          >
            {enrolling ? "Enrolling..." : "Enroll Now"}
          </button>
        </div>
      </div>
    );
  }

  if (contents.length === 0) {
    return (
      <div
        className={`p-6 rounded-xl text-center shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3
            className={`text-lg font-bold mb-3 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            No Content Available
          </h3>
          <p className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>
            This course doesn&apos;t have any content yet. Please check back
            later.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {contents.map((content) => (
        <ContentItem
          key={content._id}
          content={content}
          isActive={activeContent?._id === content._id}
          isDarkMode={isDarkMode}
          handleContentSelect={handleContentSelect}
        />
      ))}
    </div>
  );
};

CourseContentList.propTypes = {
  contents: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      // Add other content properties here as needed
    })
  ).isRequired,
  enrolled: PropTypes.bool.isRequired,
  enrolling: PropTypes.bool.isRequired,
  handleEnroll: PropTypes.func.isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  activeContent: PropTypes.shape({
    _id: PropTypes.string,
    // Add other activeContent properties here as needed
  }),
  handleContentSelect: PropTypes.func.isRequired,
};

export default CourseContentList;
