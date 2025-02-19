const mongoose = require("mongoose");

const ProgressSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true,
  },
  progress: { type: Number, default: 0 }, // Progress in percentage (0-100)
  completion_date: { type: Date },
});

module.exports = mongoose.model("Progress", ProgressSchema);
