// userModel.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ["Student", "Instructor"], required: true },
  // Add bookmarked_courses field as an array of course references
  bookmarked_courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
    },
  ],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
