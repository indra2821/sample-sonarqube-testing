import PropTypes from "prop-types";
import { FaClock } from "react-icons/fa";

const CourseHeader = ({
  course,
  isDarkMode,
  enrolled,
  enrolling,
  handleEnroll,
  activeContent,
}) => {
  return (
    <div
      className={`p-6 rounded-xl mb-8 shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">
            {course?.name}
          </h1>

          <div
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium">Instructor:</span>
              <span>{course?.instructor?.name || "Unknown Instructor"}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-medium">Contact:</span>
              <a
                href={`mailto:${course?.instructor_email}`}
                className={`hover:underline ${isDarkMode ? "text-blue-400" : "text-blue-600"}`}
              >
                {course?.instructor_email}
              </a>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-start md:items-end gap-4">
          {!enrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                isDarkMode
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              } ${enrolling ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {enrolling ? (
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Enrolling...
                </span>
              ) : (
                "Enroll in this Course"
              )}
            </button>
          )}

          {enrolled && (
            <div
              className={`px-3 py-1 rounded-lg text-sm font-medium ${
                isDarkMode
                  ? "bg-green-900 text-green-200"
                  : "bg-green-100 text-green-800"
              }`}
            >
              You are enrolled in this course
            </div>
          )}

          {activeContent?.duration > 0 && (
            <div
              className={`flex items-center gap-2 ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              <FaClock />
              <span>Total duration: {activeContent.duration} minutes</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

CourseHeader.propTypes = {
  course: PropTypes.shape({
    name: PropTypes.string,
    instructor: PropTypes.shape({
      name: PropTypes.string,
    }),
    instructor_email: PropTypes.string,
  }).isRequired,
  isDarkMode: PropTypes.bool.isRequired,
  enrolled: PropTypes.bool.isRequired,
  enrolling: PropTypes.bool.isRequired,
  handleEnroll: PropTypes.func.isRequired,
  activeContent: PropTypes.shape({
    duration: PropTypes.number,
  }),
};

export default CourseHeader;
