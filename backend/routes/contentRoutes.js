const express = require("express");
const {
  uploadSingle,
  handleUploadError,
} = require("../middleware/uploadMiddleware");
const {
  authenticateUser,
  authorizeRole,
} = require("../middleware/authMiddleware");
const {
  verifyCourseOwnership,
} = require("../middleware/courseOwnershipMiddleware");
const {
  uploadContent,
  getCourseContent,
  deleteContent,
  updateContent,
} = require("../controllers/contentController");

const router = express.Router();

// Middleware to restrict to instructors
const isInstructor = authorizeRole("Instructor");

// Upload content route (Instructor only + course ownership check)
router.post(
  "/upload",
  authenticateUser,
  isInstructor,
  uploadSingle, 
  handleUploadError, 
  verifyCourseOwnership, 
  uploadContent 
);

// Get all content for a course (any authenticated user can view)
router.get("/course/:course_id", authenticateUser, getCourseContent);

// Delete content (Instructor only + must be course creator)
router.delete(
  "/:content_id",
  authenticateUser,
  isInstructor,
  async (req, res, next) => {
    try {
      // Get the content to find its associated course
      const Content = require("../models/Content");
      const content = await Content.findById(req.params.content_id);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Set course_id in request parameters for the ownership middleware
      req.body.course_id = content.course_id;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  verifyCourseOwnership,
  deleteContent
);

// Update content route
router.put(
  "/:content_id",
  authenticateUser,
  isInstructor,
  async (req, res, next) => {
    try {
      // Get the content to find its associated course
      const Content = require("../models/Content");
      const content = await Content.findById(req.params.content_id);

      if (!content) {
        return res.status(404).json({ message: "Content not found" });
      }

      // Set course_id in request parameters for the ownership middleware
      req.body.course_id = content.course_id;
      next();
    } catch (error) {
      return res.status(500).json({ message: "Server error" });
    }
  },
  uploadSingle,
  handleUploadError,
  verifyCourseOwnership,
  updateContent
);

module.exports = router;
