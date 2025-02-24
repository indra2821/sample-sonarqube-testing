const express = require("express");
const {
  createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
} = require("../controllers/quizController");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Instructor Only Routes
router.post(
  "/create",
  authenticateUser,
  authorizeRole("Instructor"),
  createQuiz
);
router.get("/course/:course_id", authenticateUser, getQuizzes);
router.put(
  "/update/:quiz_id",
  authenticateUser,
  authorizeRole("Instructor"),
  updateQuiz
);
router.delete(
  "/delete/:quiz_id",
  authenticateUser,
  authorizeRole("Instructor"),
  deleteQuiz
);

// Student Route
router.post(
  "/attempt/:quiz_id",
  authenticateUser,
  authorizeRole("Student"),
  attemptQuiz
);

module.exports = router;
