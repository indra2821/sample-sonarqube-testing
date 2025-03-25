import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaBookmark,
  FaRegBookmark,
  FaClock,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { selectIsDarkMode } from "../Redux/themeSlice";
import { selectCurrentUser } from "../Redux/userSlice";

import CourseHeader from "../Components/CourseHeader";
import CourseContentList from "../Components/CourseContentList";
import VideoPlayer from "../Components/VideoPlayer";
import ImageViewer from "../Components/ImageViewer";
import DocumentViewer from "../Components/DocumentViewer";
import AudioPlayer from "../Components/AudioPlayer";
import DefaultViewer from "../Components/DefaultViewer";

const CourseDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector(selectIsDarkMode);
  const user = useSelector(selectCurrentUser);

  const [course, setCourse] = useState(null);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [bookmarking, setBookmarking] = useState(false);
  const [activeContent, setActiveContent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Format time in MM:SS format
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Video event handlers
  const handleVideoTimeUpdate = (e) => {
    setCurrentTime(e.target.currentTime);
  };

  const handleVideoLoadedMetadata = (e) => {
    setDuration(e.target.duration);
  };

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Check if user is enrolled in this course
  const checkEnrollmentStatus = useCallback(async () => {
    if (!user.isAuthenticated) return;

    try {
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
    setIsPlaying(false);
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
          <VideoPlayer
            src={activeContent.full_url}
            currentTime={currentTime}
            duration={duration}
            isPlaying={isPlaying}
            togglePlayPause={togglePlayPause}
            formatTime={formatTime}
            onTimeUpdate={handleVideoTimeUpdate}
            onLoadedMetadata={handleVideoLoadedMetadata}
          />
        );
      case "image":
        return (
          <ImageViewer
            src={activeContent.full_url}
            title={activeContent.title}
          />
        );
      case "document":
        return (
          <DocumentViewer
            src={activeContent.full_url}
            title={activeContent.title}
          />
        );
      case "audio":
        return <AudioPlayer src={activeContent.full_url} />;
      default:
        return <DefaultViewer src={activeContent.full_url} />;
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p
            className={`text-lg ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center p-6 max-w-md">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </div>
          <h3
            className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Error Loading Course
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${isDarkMode ? "bg-gray-900" : "bg-gray-50"}`}
      >
        <div className="text-center">
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
            className={`text-xl font-bold mb-2 ${isDarkMode ? "text-white" : "text-gray-800"}`}
          >
            Course Not Found
          </h3>
          <p
            className={`mb-6 ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
          >
            The course you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </p>
          <button
            onClick={() => navigate(-1)}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              isDarkMode
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation and actions */}
        <div className="flex flex-wrap justify-between items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 mb-4 sm:mb-0 px-4 py-2 rounded-lg transition-colors ${
              isDarkMode
                ? "hover:bg-gray-800 text-gray-300"
                : "hover:bg-gray-200 text-gray-700"
            }`}
          >
            <FaArrowLeft />
            <span className="font-medium">Back to Courses</span>
          </button>

          {user && (
            <button
              onClick={toggleBookmark}
              disabled={bookmarking}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isDarkMode
                  ? "hover:bg-gray-800 text-gray-300"
                  : "hover:bg-gray-200 text-gray-700"
              } ${bookmarking ? "opacity-70 cursor-not-allowed" : ""}`}
            >
              {bookmarked ? (
                <FaBookmark className="text-yellow-500" />
              ) : (
                <FaRegBookmark />
              )}
              <span className="font-medium">
                {bookmarked ? "Bookmarked" : "Bookmark"}
              </span>
            </button>
          )}
        </div>

        <CourseHeader
          course={course}
          isDarkMode={isDarkMode}
          enrolled={enrolled}
          enrolling={enrolling}
          handleEnroll={handleEnroll}
          activeContent={activeContent}
        />

        {/* Active content viewer */}
        {enrolled && activeContent && (
          <div
            id="content-viewer"
            className={`p-6 rounded-xl mb-8 shadow-lg ${isDarkMode ? "bg-gray-800" : "bg-white"}`}
          >
            <div className="mb-6">
              <h2 className="text-xl sm:text-2xl font-bold mb-2">
                {activeContent.title}
              </h2>
              {activeContent.description && (
                <p
                  className={`${isDarkMode ? "text-gray-300" : "text-gray-600"}`}
                >
                  {activeContent.description}
                </p>
              )}
            </div>

            {renderContentViewer()}

            <div
              className={`mt-4 flex flex-wrap items-center gap-4 text-sm ${isDarkMode ? "text-gray-400" : "text-gray-500"}`}
            >
              {activeContent.duration > 0 && (
                <span className="flex items-center gap-2">
                  <FaClock />
                  <span>Duration: {activeContent.duration} minutes</span>
                </span>
              )}
              <span className="flex items-center gap-2">
                <span>Type:</span>
                <span className="font-medium">
                  {activeContent.file_type
                    ? activeContent.file_type.charAt(0).toUpperCase() +
                      activeContent.file_type.slice(1)
                    : "Unknown"}
                </span>
              </span>
            </div>
          </div>
        )}

        {/* Course content section */}
        <div className="mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-6">Course Content</h2>
          <CourseContentList
            contents={contents}
            enrolled={enrolled}
            enrolling={enrolling}
            handleEnroll={handleEnroll}
            isDarkMode={isDarkMode}
            activeContent={activeContent}
            handleContentSelect={handleContentSelect}
          />
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
