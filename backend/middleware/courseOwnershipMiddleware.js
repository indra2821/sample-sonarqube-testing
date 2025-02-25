
const Course = require("../models/Course"); 

/**
 * Middleware to check if the authenticated user is the owner of the course
 * Used for content CRUD operations to ensure only the course creator can modify content
 */
const verifyCourseOwnership = async (req, res, next) => {
  try {
    // Get course ID from request parameters or body
    const courseId = req.params.course_id || req.body.course_id;

    console.log("Course ownership check - req.params:", req.params);
    console.log("Course ownership check - req.body:", req.body);
    console.log("Course ID extracted:", courseId);

    if (!courseId) {
      return res.status(400).json({
        message: "Course ID is required",
        params: req.params,
        body: req.body,
      });
    }

    // Find the course
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    console.log("Course found:", course._id);
    console.log("Authenticated user:", req.user._id);
    console.log("Course instructor:", course.instructor);

    // Check if the authenticated user is the course creator
    // Note: You may need to adjust the field name based on your schema
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message:
          "Access denied. Only the course creator can modify course content",
        courseInstructor: course.instructor,
        currentUser: req.user._id,
      });
    }

    // If user is the course owner, continue
    next();
  } catch (error) {
    console.error("Course ownership verification error:", error);
    res
      .status(500)
      .json({ message: "Server error during ownership verification" });
  }
};

module.exports = { verifyCourseOwnership };
