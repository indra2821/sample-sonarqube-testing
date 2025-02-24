const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  console.log("Cookies received:", req.cookies); // Debugging: Check if cookies exist

  const token = req.cookies?.accessToken; // Correct way to read token from cookies

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Unauthorized - Invalid token" });
  }
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      return res.status(403).json({ message: "Forbidden - Access denied" });
    }
    next();
  };
};

module.exports = { authenticateUser, authorizeRole };
