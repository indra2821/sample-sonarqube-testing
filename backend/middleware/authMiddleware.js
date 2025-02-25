const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  //console.log("Cookies received:", req.cookies); 

  // Update this line to match the cookie name in GenerateAndSetTokens.js
  const token = req.cookies?.AccessToken; // Changed from accessToken to AccessToken

  if (!token) {
    return res.status(401).json({ message: "Unauthorized - No token" });
  }

  try {
    // Make sure to use the same secret as in GenerateAndSetTokens.js
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Changed from ACCESS_TOKEN_SECRET to JWT_SECRET
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
