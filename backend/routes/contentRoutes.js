const express = require("express");
const { uploadSingle } = require("../middleware/uploadMiddleware");
const { authenticateUser } = require("../middleware/authMiddleware");
const { uploadContent } = require("../controllers/contentController");

const router = express.Router();

// Upload Content Route
router.post("/upload", authenticateUser, uploadSingle, uploadContent);

module.exports = router;
