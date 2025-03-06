const express = require("express");
const router = express.Router();
const {
  updateContentProgress,
  updateQuizProgress,
  getProgressByCourse,
  getAllProgress,
  getInstructorProgressStats,
  markContentComplete,
  updateVideoProgress,
} = require("../controllers/progressController");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

// Student-only routes (require authentication)
router.put("/content/:contentId", authenticateUser, updateContentProgress);
router.put(
  "/content/:contentId/complete",
  authenticateUser,
  markContentComplete
);
router.put("/video/:contentId", authenticateUser, updateVideoProgress);
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
