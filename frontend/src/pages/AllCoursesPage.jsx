import { useState, useEffect } from "react";
import { FaArrowRightLong } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { selectIsDarkMode } from "../Redux/themeSlice";

const AllCoursesPage = () => {
  const isDarkMode = useSelector(selectIsDarkMode);
  const [currentPage, setCurrentPage] = useState(1);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const coursesPerPage = 6;

  // Fetch courses from backend
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/courses", {
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Check response content type
        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          const text = await response.text();
          throw new Error(`Invalid response: ${text.substring(0, 100)}`);
        }

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Pagination logic
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  if (loading) {
    return (
      <div
        className={`text-center py-12 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading courses...
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`text-center py-12 ${
          isDarkMode ? "text-red-400" : "text-red-600"
        }`}
      >
        <p className="mb-4">Error: {error}</p>
        <button
          onClick={() => window.location.reload()}
          className={`px-4 py-2 rounded-lg ${
            isDarkMode ? "bg-[#003566] text-white" : "bg-[#05668D] text-white"
          } hover:opacity-90 transition-opacity`}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen py-8 sm:py-12 transition-colors duration-300 ${
        isDarkMode ? "bg-[#000814] text-white" : "bg-[#f2e9e4] text-gray-900"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
            All Courses
          </h1>
          <p
            className={`text-base sm:text-lg ${
              isDarkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Explore our comprehensive curriculum
          </p>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          {currentCourses.map((course) => (
            <div
              key={course._id}
              className={`p-4 sm:p-6 rounded-xl shadow-lg transition-all duration-300 ${
                isDarkMode
                  ? "bg-[#001d3d] hover:bg-[#003566]"
                  : "bg-white hover:bg-[#f2e9e4]"
              }`}
            >
              <div className="flex flex-col h-full">
                <span
                  className={`text-sm font-semibold mb-2 ${
                    isDarkMode ? "text-[#83c5be]" : "text-[#05668D]"
                  }`}
                >
                  {/* {course.category || "General"} */}
                </span>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {course.name}
                </h3>
                <p
                  className={`text-sm sm:text-base mb-4 sm:mb-6 flex-grow ${
                    isDarkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Instructor: {course.instructor?.name || "Unknown Instructor"}
                </p>
                <Link
                  to={`/courses/${course._id}`}
                  className={`flex items-center gap-2 ${
                    isDarkMode
                      ? "text-white hover:text-gray-300"
                      : "text-gray-700 hover:text-gray-900"
                  }`}
                >
                  <span className="text-sm sm:text-base">View Course</span>
                  <FaArrowRightLong className="text-sm" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {courses.length > 0 && (
          <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                isDarkMode
                  ? "bg-[#001d3d] text-white disabled:opacity-50"
                  : "bg-gray-200 text-gray-700 disabled:opacity-50"
              }`}
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 sm:px-3 py-1 rounded-md text-sm sm:text-base ${
                  currentPage === i + 1
                    ? isDarkMode
                      ? "bg-[#003566] text-white"
                      : "bg-[#05668D] text-white"
                    : isDarkMode
                      ? "hover:bg-[#001d3d]"
                      : "hover:bg-gray-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base ${
                isDarkMode
                  ? "bg-[#001d3d] text-white disabled:opacity-50"
                  : "bg-gray-200 text-gray-700 disabled:opacity-50"
              }`}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllCoursesPage;
