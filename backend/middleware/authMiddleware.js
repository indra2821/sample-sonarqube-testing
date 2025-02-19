const jwt = require("jsonwebtoken");
const Enrollment = require("../models/Enrollment");

exports.authenticateUser = (req, res, next) => {
  const token =
    req.cookies?.AccessToken || req.headers.authorization?.split(" ")[1];

  // console.log("Token: ", token);
  // console.log("req.cookies: ", req.cookies);

  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

exports.isInstructor = (req, res, next) => {
  if (!req.user || req.user.role !== "Instructor") {
    return res
      .status(403)
      .json({ message: "Access denied. Instructors only." });
  }
  next();
};

exports.isEnrolled = async (req, res, next) => {
  try {
    const courseId = req.params.id;
    const isEnrolled = await Enrollment.findOne({
      user_id: req.user._id,
      course_id: courseId,
    });

    if (!isEnrolled) {
      return res.status(403).json({
        message: "You must enroll in this course to access the content.",
      });
    }

    next();
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
