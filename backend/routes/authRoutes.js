// const express = require("express");
// const router = express.Router();
// const {
//   initiateSignup,
//   verifyOtp,
//   initiateLogin,
//   verifyLoginOtp,
// } = require("../controllers/authController"); //  Make sure this is the correct path
// const { logoutUser } = require("../routes/logout");

// // Routes for Signup
// router.post("/signup", initiateSignup);
// router.post("/verify-otp", verifyOtp);

// // Routes for Login
// router.post("/login/send-otp", initiateLogin);
// router.post("/login/verify-otp", verifyLoginOtp);

// //logout
// router.post("/logout", logoutUser);

// module.exports = router;

const express = require("express");
const router = express.Router();
const {
  initiateSignup,
  verifyOtp,
  initiateLogin,
  verifyLoginOtp,
} = require("../controllers/authController");
const { logoutUser } = require("./logout");
const { authenticateUser } = require("../middleware/authMiddleware");
const { checkAuthStatus } = require("../controllers/authController");
// Public Authentication Routes
router.post("/signup", initiateSignup);
router.post("/verify-otp", verifyOtp);
router.post("/login/send-otp", initiateLogin);
router.post("/login/verify-otp", verifyLoginOtp);
router.get("/check-auth", authenticateUser, checkAuthStatus);

// Protected Routes
router.post("/logout", authenticateUser, logoutUser);

// Error handling middleware specifically for auth routes
router.use((err, req, res, next) => {
  console.error("Auth route error:", err);
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      message: "Invalid or expired token",
      shouldLogout: true,
    });
  }
  res.status(500).json({ message: "Authentication service error" });
});

module.exports = router;
