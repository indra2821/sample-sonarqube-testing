import jwt from "jsonwebtoken";

export const GenerateAndSetTokens = (_id, role, res) => {
  const AccessToken = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });

  const RefreshToken = jwt.sign({ _id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });

  // Convert expiry days to milliseconds and create Date objects
  const accessTokenExpiry = new Date(
    Date.now() +
      parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000
  );

  const refreshTokenExpiry = new Date(
    Date.now() +
      parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    path: "/",
  };

  // Set cookies with proper expiry dates
  res
    .cookie("AccessToken", AccessToken, {
      ...cookieOptions,
      expires: accessTokenExpiry,
      maxAge:
        parseInt(process.env.ACCESS_TOKEN_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
    })
    .cookie("RefreshToken", RefreshToken, {
      ...cookieOptions,
      expires: refreshTokenExpiry,
      maxAge:
        parseInt(process.env.REFRESH_TOKEN_COOKIE_EXPIRY) * 24 * 60 * 60 * 1000,
    });

  return { AccessToken, RefreshToken };
};
