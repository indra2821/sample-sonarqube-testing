const express = require("express");
const {
  authenticateUser,
  isInstructor,
} = require("../middleware/authMiddleware");
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

// Centralized check for undefined imports
const validateHandlers = { enrollInCourse };
for (const [key, value] of Object.entries(validateHandlers)) {
  if (typeof value !== "function") {
    throw new Error(
      `${key} is not defined. Check courseController.js exports.`
    );
  }
}

// Public Routes
router.get("/", getCourses);
router.get("/:id", getCourseById);

// Instructor-Only Routes
router.post("/", authenticateUser, isInstructor, createCourse);
router.put("/:id", authenticateUser, isInstructor, updateCourse);
router.delete("/:id", authenticateUser, isInstructor, deleteCourse);

// Student-Only Routes
router.post("/enroll", authenticateUser, enrollInCourse);
router.get("/:id/content", authenticateUser, getCourseContent);

module.exports = router;
