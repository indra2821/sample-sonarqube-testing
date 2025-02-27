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
  // Track content progress individually
  content_progress: [
    {
      content_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Content",
        required: true,
      },
      viewed: { type: Boolean, default: false },
      percentage_completed: { type: Number, default: 0 }, // For videos/documents
      last_position: { type: Number, default: 0 }, // For videos (seconds)
      completed_date: { type: Date },
    },
  ],
  // Track quiz progress
  quiz_progress: [
    {
      quiz_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true,
      },
      attempted: { type: Boolean, default: false },
      score: { type: Number, default: 0 }, // Score as percentage
      completed_date: { type: Date },
    },
  ],
  // Overall progress metrics
  overall_progress: {
    content_weight: { type: Number, default: 70 }, // Default weight for content (70%)
    quiz_weight: { type: Number, default: 30 }, // Default weight for quizzes (30%)
    total_progress: { type: Number, default: 0 }, // Calculated total progress
    last_updated: { type: Date, default: Date.now },
  },
});

// Indexes for efficient querying
ProgressSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

module.exports = mongoose.model("Progress", ProgressSchema);
