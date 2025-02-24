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
];

if (requiredHandlers.some((handler) => typeof handler !== "function")) {
  throw new Error(
    "One or more course controller functions are missing or not exported correctly."
  );
}

// Public Routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Instructor-Only Routes
router.post("/", authenticateUser, isInstructor, createCourse);
router.put("/:id", authenticateUser, isInstructor, updateCourse);
router.delete("/:id", authenticateUser, isInstructor, deleteCourse);

// Student-Only Routes
router.post("/:id/enroll", authenticateUser, enrollInCourse);
router.get("/:id/content", authenticateUser, getCourseContent);

module.exports = router;
