export const logoutUser = (req, res) => {
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
  };

  // Clear cookies on logout
  res.clearCookie("AccessToken", cookieOptions);
  res.clearCookie("RefreshToken", cookieOptions);

  console.log(" User logged out successfully");

  return res.status(200).json({ message: "Logged out successfully" });
};
