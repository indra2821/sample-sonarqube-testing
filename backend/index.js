require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser"); // Import cookie-parser
const connectDB = require("./config/db");

const app = express();

// Connect to MongoDB
connectDB().catch((error) => {
  console.error("Database connection failed:", error.message);
  process.exit(1); // Exit process if DB fails
});

// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser()); // Add cookie-parser middleware

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/enrollment", require("./routes/enrollmentRoutes"));

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start Server & Handle Port
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
