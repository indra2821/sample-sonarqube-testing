const express = require("express");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const isInstructor = authorizeRole("Instructor");

const {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseContent,
  addBookmark,
  removeBookmark,
  getBookmarkedCourses,
} = require("../controllers/courseController");

const router = express.Router();

// Check for missing handlers
const requiredHandlers = [
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseContent,
  addBookmark,
  removeBookmark,
  getBookmarkedCourses,
];

if (requiredHandlers.some((handler) => typeof handler !== "function")) {
  throw new Error(
    "One or more course controller functions are missing or not exported correctly."
  );
}

// Public Routes
router.get("/", getCourses);
router.get("/bookmarked", authenticateUser, getBookmarkedCourses);
router.get("/:id", getCourseById);

// Instructor-Only Routes
router.post("/", authenticateUser, isInstructor, createCourse);
router.put("/:id", authenticateUser, isInstructor, updateCourse);
router.delete("/:id", authenticateUser, isInstructor, deleteCourse);

// Student-Only Routes
router.post("/:id/enroll", authenticateUser, enrollInCourse);
router.get("/:id/content", authenticateUser, getCourseContent);

// Bookmark Routes
router.post("/:id/bookmark", authenticateUser, addBookmark);
router.delete("/:id/bookmark", authenticateUser, removeBookmark);

module.exports = router;
