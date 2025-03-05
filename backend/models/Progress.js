const mongoose = require("mongoose");

// Define content progress schema
const ContentProgressSchema = new mongoose.Schema({
  content_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Content",
    required: true,
  },
  viewed: {
    type: Boolean,
    default: false,
  },
  percentage_completed: {
    type: Number,
    default: 0,
  },
  last_position: {
    type: Number,
    default: 0,
  },
  completed_date: {
    type: Date,
    default: null,
  },
});

// Define quiz progress schema
const QuizProgressSchema = new mongoose.Schema({
  quiz_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Quiz",
    required: true,
  },
  attempted: {
    type: Boolean,
    default: false,
  },
  score: {
    type: Number,
    default: 0,
  },
  completed_date: {
    type: Date,
    default: null,
  },
});

// Define overall progress schema
const OverallProgressSchema = new mongoose.Schema({
  content_weight: {
    type: Number,
    default: 60,
  },
  quiz_weight: {
    type: Number,
    default: 40,
  },
  total_progress: {
    type: Number,
    default: 0,
  },
  last_updated: {
    type: Date,
    default: Date.now,
  },
});

// Main progress schema
const ProgressSchema = new mongoose.Schema(
  {
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
    content_progress: [ContentProgressSchema],
    quiz_progress: [QuizProgressSchema],
    overall_progress: {
      type: OverallProgressSchema,
      default: () => ({}),
    },
  },
  { timestamps: true }
);

// Create a compound index for user and course
ProgressSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

// Check if model exists before creating it to avoid the OverwriteModelError
module.exports =
  mongoose.models.Progress || mongoose.model("Progress", ProgressSchema);
