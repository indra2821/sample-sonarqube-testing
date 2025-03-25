const jwt = require("jsonwebtoken");
const { GenerateAndSetTokens } = require("../utils/GenerateAndSetTokens");

const handleTokenRefresh = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.RefreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "Session expired - Please login again",
        shouldLogout: true,
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    // Generate new tokens with proper cookie settings
    const { AccessToken } = await GenerateAndSetTokens(
      decoded._id,
      decoded.role,
      res
    );

    // Verify the new access token immediately
    const verified = jwt.verify(AccessToken, process.env.JWT_SECRET);
    req.user = verified;

    return next();
  } catch (error) {
    console.error("Token refresh error:", error.message);

    // Clear invalid cookies
    res.clearCookie("AccessToken");
    res.clearCookie("RefreshToken");

    const response = {
      message: "Session expired - Please login again",
      shouldLogout: true,
    };

    if (error.name === "TokenExpiredError") {
      response.message = "Your session has expired";
    } else if (error.name === "JsonWebTokenError") {
      response.message = "Invalid session detected";
    }

    return res.status(403).json(response);
  }
};

const authenticateUser = async (req, res, next) => {
  try {
    const accessToken = req.cookies?.AccessToken;

    if (accessToken) {
      try {
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        return next();
      } catch (error) {
        if (error.name === "TokenExpiredError") {
          return handleTokenRefresh(req, res, next);
        }
        throw error; // Will be caught by outer catch
      }
    }

    // No access token, try refresh token
    return handleTokenRefresh(req, res, next);
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res.status(403).json({
      message: "Authentication failed - Please login again",
      shouldLogout: true,
    });
  }
};

const authorizeRole = (roles) => {
  if (!Array.isArray(roles)) {
    roles = [roles]; // Convert single role to array
  }

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication required",
        shouldLogout: true,
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Forbidden - Requires ${roles.join(" or ")} role`,
      });
    }

    next();
  };
};

const softAuthenticate = (req, res, next) => {
  const accessToken = req.cookies?.AccessToken;

  if (accessToken) {
    try {
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      req.user = decoded;
    } catch (error) {
      // Silently fail for soft authentication
    }
  }

  next();
};

module.exports = {
  authenticateUser,
  authorizeRole,
  softAuthenticate,
  protect: authenticateUser, 
};
