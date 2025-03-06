const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");

// Ensure directories exist
const createDirectories = () => {
  const certificateDir = path.join(__dirname, "../uploads/certificates");

  if (!fs.existsSync(certificateDir)) {
    fs.mkdirSync(certificateDir, { recursive: true });
  }
};

// Create directories on server start
createDirectories();

// Storage configuration for certificates
const certificateStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    const certificateDir = path.join(__dirname, "../uploads/certificates");
    cb(null, certificateDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with timestamp
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, "cert-" + uniqueSuffix + path.extname(file.originalname));
  },
});

// Multer upload instance for certificates
const uploadCertificate = multer({
  storage: certificateStorage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Middleware to check if a user has completed a course
const verifyCourseCompletion = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if user is enrolled
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message: "You must be enrolled in this course to view its certificate",
      });
    }

    // Check if user has completed the course
    const progress = await Progress.findOne({
      user_id: userId,
      course_id: courseId,
    });

    if (!progress || progress.overall_progress.total_progress < 100) {
      return res.status(403).json({
        message:
          "You must complete 100% of the course to access the certificate",
        currentProgress: progress
          ? progress.overall_progress.total_progress
          : 0,
      });
    }

    next();
  } catch (error) {
    console.error("Error verifying course completion:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadCertificate,
  verifyCourseCompletion,
};
