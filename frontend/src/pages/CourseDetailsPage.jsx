import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaBookmark, FaRegBookmark, FaLock } from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../Redux/themeSlice";
import { selectUser } from "../Redux/userSlice";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectIsDarkMode);
  const user = useSelector(selectUser);

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [activeContent, setActiveContent] = useState(null);

  // Check if user is enrolled in this course
  const checkEnrollmentStatus = useCallback(async () => {
    if (!user.isAuthenticated) return;

    try {
      // Try to fetch course content - this will only succeed if enrolled
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}/content`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const contentData = await response.json();
        setContents(contentData);

        // Set the first content as active by default if available
        if (contentData.length > 0) {
          setActiveContent(contentData[0]);
        }

        setEnrolled(true);
      } else {
        setEnrolled(false);
      }
    } catch (err) {
      console.error("Enrollment check error:", err);
      setEnrolled(false);
    }
  }, [id, user.isAuthenticated]);

  // Check if course is bookmarked
  const checkBookmarkStatus = useCallback(async () => {
    if (!user.isAuthenticated) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/bookmarked`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const bookmarkedCourses = await response.json();
        setBookmarked(bookmarkedCourses.some((course) => course._id === id));
      }
    } catch (err) {
      console.error("Bookmark check error:", err);
    }
  }, [id, user.isAuthenticated]);

  // Fetch course details
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/api/courses/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.message || "Failed to fetch course details"
          );
        }

        const data = await response.json();
        setCourse(data);

        // Check if user is authenticated
        if (user.isAuthenticated) {
          checkEnrollmentStatus();
          checkBookmarkStatus();
        }
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
  }, [id, user.isAuthenticated, checkEnrollmentStatus, checkBookmarkStatus]);

  // Enroll in course
  const handleEnroll = async () => {
    if (!user.isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    setEnrolling(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}/enroll`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to enroll in course");
      }

      // Once enrolled, fetch course content
      await checkEnrollmentStatus();
    } catch (err) {
      setError(err.message);
      console.error("Enrollment error:", err);
    } finally {
      setEnrolling(false);
    }
  };

  // Toggle bookmark
  const toggleBookmark = async () => {
    if (!user.isAuthenticated) {
      navigate("/login", { state: { from: `/courses/${id}` } });
      return;
    }

    setBookmarking(true);
    try {
      const method = bookmarked ? "DELETE" : "POST";
      const response = await fetch(
        `http://localhost:5000/api/courses/${id}/bookmark`,
        {
          method,
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update bookmark");
      }

      setBookmarked(!bookmarked);
    } catch (err) {
      setError(err.message);
      console.error("Bookmark error:", err);
    } finally {
      setBookmarking(false);
    }
  };

  // Set active content to view
  const handleContentSelect = (content) => {
    setActiveContent(content);
    // Scroll to content viewer
    document
      .getElementById("content-viewer")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  // Render content based on file type
  const renderContentViewer = () => {
    if (!activeContent) return null;

    switch (activeContent.file_type) {
      case "video":
        return (
          <div className="aspect-video rounded overflow-hidden bg-black">
            <video
              src={activeContent.full_url}
              controls
              className="w-full h-full"
              autoPlay
            >
              Your browser does not support the video tag.
            </video>
          </div>
        );
      case "image":
        return (
          <div className="rounded overflow-hidden flex justify-center">
            <img
              src={activeContent.full_url}
              alt={activeContent.title}
              className="max-w-full max-h-96 object-contain"
            />
          </div>
        );
      case "document":
        // PDF Viewer
        if (activeContent.full_url.endsWith(".pdf")) {
          return (
            <div className="h-screen max-h-[70vh] rounded overflow-hidden">
              <iframe
                src={`${activeContent.full_url}#toolbar=0&navpanes=0`}
                title={activeContent.title}
                className="w-full h-full border-0"
              />
            </div>
          );
        }
        // For other documents, fallback to download
        return (
          <div className="text-center py-8">
            <p className="mb-4">
              This document cannot be previewed in the browser.
            </p>
            <a
              href={activeContent.full_url}
              download
              className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-[#003566] text-white hover:bg-[#00509d]"
                  : "bg-[#05668D] text-white hover:bg-[#024e6a]"
              }`}
            >
              Download Document
            </a>
          </div>
        );
      case "audio":
        return (
          <div className="rounded overflow-hidden p-4 flex justify-center">
            <audio
              src={activeContent.full_url}
              controls
              className="w-full max-w-xl"
              autoPlay
            >
              Your browser does not support the audio tag.
            </audio>
          </div>
        );
      default:
        // Try to determine file type from URL
        if (activeContent.full_url) {
          const extension = activeContent.full_url
            .split(".")
            .pop()
            .toLowerCase();

          // Handle HTML content
          if (extension === "html" || extension === "htm") {
            return (
              <div className="h-screen max-h-[70vh] rounded overflow-hidden">
                <iframe
                  src={activeContent.full_url}
                  title={activeContent.title}
                  className="w-full h-full border-0"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            );
          }

          // For plain text, code files, etc.
          if (
            ["txt", "json", "js", "css", "html", "xml", "md"].includes(
              extension
            )
          ) {
            return (
              <div className="text-center py-8">
                <p className="mb-4">Text file detected. Fetching content...</p>
                <a
                  href={activeContent.full_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                    isDarkMode
                      ? "bg-[#003566] text-white hover:bg-[#00509d]"
                      : "bg-[#05668D] text-white hover:bg-[#024e6a]"
                  }`}
                >
                  Open in New Tab
                </a>
              </div>
            );
          }
        }

        // Default fallback
        return (
          <div className="text-center py-8">
            <p className="mb-4">
              This file type cannot be previewed in the browser.
            </p>
            <a
              href={activeContent.full_url}
              download
              className={`inline-block px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-[#003566] text-white hover:bg-[#00509d]"
                  : "bg-[#05668D] text-white hover:bg-[#024e6a]"
              }`}
            >
              Download File
            </a>
          </div>
        );
    }
  };

  if (loading) {
    return (
      <div
        className={`text-center py-12 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Loading course details...
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

  if (!course) {
    return (
      <div
        className={`text-center py-12 ${
          isDarkMode ? "text-gray-300" : "text-gray-600"
        }`}
      >
        Course not found
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
        {/* Navigation and actions */}
        <div className="flex flex-wrap justify-between items-center mb-6 sm:mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 sm:mb-0 ${
              isDarkMode
                ? "text-gray-300 hover:text-white"
                : "text-gray-700 hover:text-gray-900"
            }`}
          >
            <FaArrowLeft />
            <span>Back to Courses</span>
          </button>

          {user && (
            <button
              onClick={toggleBookmark}
              disabled={bookmarking}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-[#001d3d] text-gray-300"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
            >
              {bookmarked ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark />
              )}
              <span>{bookmarked ? "Bookmarked" : "Bookmark"}</span>
            </button>
          )}
        </div>

        {/* Course header */}
        <div
          className={`p-6 rounded-xl mb-8 ${
            isDarkMode ? "bg-[#001d3d]" : "bg-white"
          }`}
        >
          <h1 className="text-2xl sm:text-3xl font-bold mb-4">{course.name}</h1>

          <div
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            <p>Instructor: {course.instructor?.name || "Unknown Instructor"}</p>
            <p>Contact: {course.instructor_email}</p>
          </div>

          {!enrolled && (
            <button
              onClick={handleEnroll}
              disabled={enrolling}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "bg-[#003566] text-white hover:bg-[#00509d]"
                  : "bg-[#05668D] text-white hover:bg-[#024e6a]"
              } ${enrolling ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {enrolling ? "Enrolling..." : "Enroll in this Course"}
            </button>
          )}

          {enrolled && (
            <div
              className={`inline-block px-3 py-1 rounded-lg text-sm ${
                isDarkMode
                  ? "bg-[#003566] text-white"
                  : "bg-green-100 text-green-800"
              }`}
            >
              You are enrolled in this course
            </div>
          )}
        </div>

        {/* Active content viewer */}
        {enrolled && activeContent && (
          <div
            id="content-viewer"
            className={`p-6 rounded-xl mb-8 ${
              isDarkMode ? "bg-[#001d3d]" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-bold mb-4">{activeContent.title}</h2>
            <p
              className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              {activeContent.description}
            </p>

            {renderContentViewer()}

            <div
              className={`mt-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {activeContent.duration > 0 && (
                <span className="mr-4">
                  Duration: {activeContent.duration} minutes
                </span>
              )}
              <span>
                Type:{" "}
                {activeContent.file_type
                  ? activeContent.file_type.charAt(0).toUpperCase() +
                    activeContent.file_type.slice(1)
                  : "Unknown"}
              </span>
            </div>
          </div>
        )}

        {/* Course content section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">Course Content</h2>

          {!enrolled && (
            <div
              className={`p-6 rounded-xl text-center ${
                isDarkMode ? "bg-[#001d3d]" : "bg-white"
              }`}
            >
              <FaLock className="mx-auto text-2xl mb-3" />
              <p className="mb-4">
                You need to enroll in this course to access the content
              </p>
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode
                    ? "bg-[#003566] text-white hover:bg-[#00509d]"
                    : "bg-[#05668D] text-white hover:bg-[#024e6a]"
                } ${enrolling ? "opacity-70 cursor-not-allowed" : ""}`}
              >
                {enrolling ? "Enrolling..." : "Enroll Now"}
              </button>
            </div>
          )}

          {enrolled && contents.length === 0 && (
            <div
              className={`p-6 rounded-xl text-center ${
                isDarkMode ? "bg-[#001d3d]" : "bg-white"
              }`}
            >
              <p>No content available for this course yet.</p>
            </div>
          )}

          {enrolled && contents.length > 0 && (
            <div className="grid gap-4 sm:gap-6">
              {contents.map((content) => (
                <div
                  key={content._id}
                  className={`p-4 sm:p-6 rounded-xl transition-colors cursor-pointer ${
                    activeContent?._id === content._id
                      ? isDarkMode
                        ? "bg-[#003566] border-l-4 border-blue-400"
                        : "bg-blue-50 border-l-4 border-blue-500"
                      : isDarkMode
                        ? "bg-[#001d3d] hover:bg-[#003566]"
                        : "bg-white hover:bg-[#f2e9e4]"
                  }`}
                  onClick={() => handleContentSelect(content)}
                >
                  <h3 className="text-lg font-bold mb-2">{content.title}</h3>
                  <p
                    className={`mb-2 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                  >
                    {content.description && content.description.length > 100
                      ? `${content.description.substring(0, 100)}...`
                      : content.description}
                  </p>

                  <div
                    className={`text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {content.duration > 0 && (
                      <span className="mr-4">
                        Duration: {content.duration} 
                      </span>
                    )}minutes
                    <span>
                      Type:{" "}
                      {content.file_type
                        ? content.file_type.charAt(0).toUpperCase() +
                          content.file_type.slice(1)
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
