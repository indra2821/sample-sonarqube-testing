const multer = require("multer");
const path = require("path");

// Define Storage for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files inside the 'uploads' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

// Allowed file types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "video/mp4",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error("Invalid file type. Allowed: JPEG, PNG, MP4, PDF, DOC, DOCX."),
      false
    );
  }
};

// Multer Configuration
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
});

module.exports = {
  uploadSingle: upload.single("file"), // Upload single file
  uploadMultiple: upload.array("files", 5), // Upload multiple files (max 5)
};
