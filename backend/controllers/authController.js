const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const OTP = require("../models/otpModel");
const sendOtp = require("../utils/sendOtp");
const { GenerateAndSetTokens } = require("../utils/GenerateAndSetTokens");

const sendResponse = (res, status, message) =>
  res.status(status).json({ message });

exports.initiateSignup = async (req, res) => {
  try {
    const { name, email, role } = req.body;
    if (!name || !email || !role) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Send OTP for email verification
    const otpResponse = await sendOtp(email, true, name);

    // Store temporary user data
    req.app.locals.tempUser = { name, email, role };

    // Pass tempUser to sendOtp
    const response = await sendOtp(email, req.app.locals.tempUser);
    if (!response.success) {
      return res.status(500).json({ message: "OTP sending failed" });
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error in initiateSignup:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return sendResponse(res, 400, "Email and OTP are required");

    if (!(await OTP.findOne({ email, otp })))
      return sendResponse(res, 400, "Invalid or expired OTP");

    const tempUser = req.app.locals.tempUser;
    if (!tempUser || tempUser.email !== email)
      return sendResponse(res, 400, "Session expired. Restart signup");

    await new User({ ...tempUser, isVerified: true }).save();
    req.app.locals.tempUser = null;
    await OTP.deleteOne({ email });

    sendResponse(res, 201, "User registered successfully");
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

exports.initiateLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");

    if (!(await User.findOne({ email })))
      return sendResponse(res, 400, "User not found");

    if (!(await sendOtp(email)).success)
      return sendResponse(res, 500, "OTP sending failed");

    sendResponse(res, 200, "OTP sent successfully");
  } catch (error) {
    console.error("Error in initiateLogin:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return sendResponse(res, 400, "Email and OTP are required");

    if (!(await OTP.findOne({ email, otp })))
      return sendResponse(res, 400, "Invalid or expired OTP");

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 400, "User not found");

    const tokens = GenerateAndSetTokens(user._id, user.role, res);
    await OTP.deleteOne({ email });

    res.status(200).json({ tokens, role: user.role });
  } catch (error) {
    console.error("Error in verifyLoginOtp:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
