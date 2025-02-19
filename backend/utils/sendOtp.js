const OTP = require("../models/otpModel");
const User = require("../models/userModel");
const axios = require("axios");

const sendOtp = async (email, isSignup = false, providedName = null) => {
  try {
    const senderEmail = process.env.SENDER_EMAIL;
    const apiKey = process.env.BREVO_API_KEY;

    if (!senderEmail || !apiKey) {
      throw new Error("Missing Brevo API key or sender email.");
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Generated OTP for ${email}: ${otp}`);

    let username = "User"; // Default fallback name

    if (isSignup) {
      if (providedName && providedName.trim()) {
        username = providedName.trim(); // Use provided name from request body
        console.log(`Signup: Using provided name: ${username}`);
      } else {
        console.warn(`Signup: No name provided for ${email}, using fallback.`);
      }
    } else {
      // If it's a login request, fetch the user from the database
      const user = await User.findOne({ email }).lean();
      if (user && user.name) {
        username = user.name.trim();
        console.log(`Login: Retrieved name from DB: ${username}`);
      } else {
        console.warn(`Login: No user found for ${email}, using fallback.`);
      }
    }

    // Save OTP in the database (overwrite if exists)
    await OTP.findOneAndUpdate(
      { email },
      { email, otp, createdAt: new Date() },
      { upsert: true, new: true }
    );

    console.log(`Stored OTP for ${email}: ${otp}`);

    // Send email using Brevo API
    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: { email: senderEmail },
        to: [{ email }],
        subject: "Your OTP Code for EduMosaic",
        htmlContent: `
          <p>Hey <strong>${username}</strong>,</p>
          <p>Your OTP is: <strong>${otp}</strong></p>
          <p>Use this OTP for ${
            isSignup ? "signing up" : "logging in"
          } to your account.</p>
          <p>This OTP is valid for 5 minutes. Please do not share it with anyone.</p>
          <p>If you did not request this, please ignore this email.</p>
          <p>Thank you,<br>The EduMosaic Team</p>
        `,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "api-key": apiKey,
        },
      }
    );

    return { success: true };
  } catch (error) {
    console.error("Error sending OTP:", error.response?.data || error.message);
    return { success: false, error: error.response?.data || error.message };
  }
};

module.exports = sendOtp;
