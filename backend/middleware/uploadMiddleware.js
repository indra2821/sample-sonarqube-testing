const multer = require("multer");
const path = require("path");
const fs = require("fs");
const express = require("express");

// Ensure uploads directory exists
const uploadDir = "./uploads/";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Define Storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Create course-specific folders
    const courseDir = path.join(uploadDir, req.body.course_id || "general");
    if (!fs.existsSync(courseDir)) {
      fs.mkdirSync(courseDir, { recursive: true });
    }
    cb(null, courseDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueFilename = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueFilename);
  },
});

// Determine file type for categorization
const determineFileType = (file) => {
  const mimeType = file.mimetype;
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("text")
  )
    return "document";
  return "other";
};

// File filter function
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "video/mp4",
    "video/webm",
    "video/ogg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation", // PPTX
    "text/plain",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    // Attach file type to request for later use
    req.fileType = determineFileType(file);
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed: JPEG, PNG, GIF, MP4, WEBM, OGG, PDF, DOC, DOCX, PPT, PPTX, TXT"
      ),
      false
    );
  }
};

// Multer Configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max file size
});

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res
        .status(413)
        .json({ message: "File too large. Maximum size is 100MB." });
    }
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  } else if (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

// File serving functionality
const configureFileServing = (app) => {
  // Serve files from the uploads directory
  app.use("/uploads", express.static(path.resolve(uploadDir)));

  // Enhanced upload handler for single file that returns a browser-accessible URL
  const enhancedUploadSingle = (fieldName = "file") => {
    return (req, res, next) => {
      upload.single(fieldName)(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }

        if (req.file) {
          // Add a URL that can be opened in browser
          const relativePath = path.relative(uploadDir, req.file.path);
          req.file.url = `/uploads/${relativePath.replace(/\\/g, "/")}`;
        }

        next();
      });
    };
  };

  // Enhanced upload handler for multiple files that returns browser-accessible URLs
  const enhancedUploadMultiple = (fieldName = "files", maxCount = 5) => {
    return (req, res, next) => {
      upload.array(fieldName, maxCount)(req, res, (err) => {
        if (err) {
          return handleUploadError(err, req, res, next);
        }

        if (req.files && req.files.length > 0) {
          // Add URLs that can be opened in browser
          req.files.forEach((file) => {
            const relativePath = path.relative(uploadDir, file.path);
            file.url = `/uploads/${relativePath.replace(/\\/g, "/")}`;
          });
        }

        next();
      });
    };
  };

  return {
    enhancedUploadSingle,
    enhancedUploadMultiple,
  };
};

module.exports = {
  uploadSingle: upload.single("file"),
  uploadMultiple: upload.array("files", 5),
  handleUploadError,
  configureFileServing,
};
