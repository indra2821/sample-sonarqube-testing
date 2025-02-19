const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  instructor_email: { type: String, required: true },
  content_Arr: [{ type: mongoose.Schema.Types.ObjectId, ref: "Content" }],
});

module.exports = mongoose.model("Course", CourseSchema);
