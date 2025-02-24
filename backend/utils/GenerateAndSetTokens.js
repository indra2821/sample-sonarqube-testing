import jwt from "jsonwebtoken";

export const GenerateAndSetTokens = (_id, role, res) => {
  const AccessToken = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const RefreshToken = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  const cookieOptions = {
    httpOnly: true, // Security: Prevents JS access
    secure: process.env.NODE_ENV === "production", // Secure only in production
    sameSite: "Strict",
  };

  // Clear previous cookies before setting new ones
  res.clearCookie("AccessToken", cookieOptions);
  res.clearCookie("RefreshToken", cookieOptions);

  res
    .cookie("AccessToken", AccessToken, cookieOptions)
    .cookie("RefreshToken", RefreshToken, cookieOptions);

  return { AccessToken, RefreshToken };
};
