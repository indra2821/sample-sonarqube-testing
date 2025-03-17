const express = require("express");
const router = express.Router();
const certificateController = require("../controllers/certificateController");
const { authenticateUser: protect } = require("../middleware/authMiddleware");

// console.log("certificateController:", certificateController);

router.post(
  "/generate/:courseId",
  protect,
  certificateController.generateCertificate
);

router.get("/:certificateId", protect, certificateController.getCertificate);

module.exports = router;
