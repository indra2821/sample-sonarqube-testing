const express = require("express");
const router = express.Router();
const {
  updateContentProgress,
  updateQuizProgress,
  getProgressByCourse,
  getAllProgress,
  getInstructorProgressStats,
} = require("../controllers/progressController");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

// Student-only routes (require authentication)
router.put("/content/:contentId", authenticateUser, updateContentProgress);

router.put("/quiz/:quizId", authenticateUser, updateQuizProgress);

router.get("/course/:courseId", authenticateUser, getProgressByCourse);

router.get("/all", authenticateUser, getAllProgress);

// Instructor-only routes
router.get(
  "/stats",
  authenticateUser,
  authorizeRole("Instructor"),
  getInstructorProgressStats
);

module.exports = router;
