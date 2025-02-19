const express = require("express");
const { authenticateUser } = require("../middleware/authMiddleware");
const { enrollInCourse } = require("../controllers/courseController");

const router = express.Router();

// Centralized check for undefined handlers
if (typeof enrollInCourse !== "function") {
  throw new Error(
    "enrollInCourse is not defined. Check courseController.js exports."
  );
}

// Route for course enrollment
router.post("/enroll", authenticateUser, enrollInCourse);

module.exports = router;
