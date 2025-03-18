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

    
    req.app.locals.tempUser = { name, email, role };

   
    const response = await sendOtp(email, true, name);
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

    const otpRecord = await OTP.findOne({ email, otp });
    if (!otpRecord) return sendResponse(res, 400, "Invalid or expired OTP");

    const tempUser = req.app.locals.tempUser;
    if (!tempUser || tempUser.email !== email) {
      return sendResponse(res, 400, "Session expired. Restart signup");
    }

    const newUser = await new User({ ...tempUser, isVerified: true }).save();
    req.app.locals.tempUser = null;
    await OTP.deleteOne({ email });

   
    GenerateAndSetTokens(newUser._id, newUser.role, res);

    
    res.status(201).json({
      message: "User registered successfully",
      user: { name: newUser.name, role: newUser.role },
    });
  } catch (error) {
    console.error("Error in verifyOtp:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

exports.initiateLogin = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendResponse(res, 400, "Email is required");

    const user = await User.findOne({ email });
    if (!user) return sendResponse(res, 400, "User not found");

    const response = await sendOtp(email);
    if (!response.success) return sendResponse(res, 500, "OTP sending failed");

    sendResponse(res, 200, "OTP sent successfully");
  } catch (error) {
    console.error("Error in initiateLogin:", error);
    sendResponse(res, 500, "Internal server error");
  }
};

exports.verifyLoginOtp = async (req, res) => {
  try {
    let { email, otp } = req.body;
    if (!email || !otp) {
      return sendResponse(res, 400, "Email and OTP are required");
    }

    
    email = email.trim().toLowerCase();
    console.log(`Received normalized email: ${email}, OTP: ${otp}`);

    const otpRecord = await OTP.findOne({ email }).sort({ createdAt: -1 });
    console.log("Fetched OTP record:", otpRecord);

    if (!otpRecord) {
      return sendResponse(res, 400, "Invalid or expired OTP");
    }

    if (otpRecord.otp !== otp.toString()) {
      console.log(`Stored OTP: ${otpRecord.otp}, Provided OTP: ${otp}`);
      return sendResponse(res, 400, "Invalid OTP");
    }

    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, 400, "User not found");
    }

    res.clearCookie("AccessToken");
    res.clearCookie("RefreshToken");

    GenerateAndSetTokens(user._id, user.role, res);
    await OTP.deleteOne({ email });

   
    res.status(200).json({
      role: user.role,
      name: user.name,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error in verifyLoginOtp:", error);
    sendResponse(res, 500, "Internal server error");
  }
};
