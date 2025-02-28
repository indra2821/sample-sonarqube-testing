const mongoose = require("mongoose");

// Define question schema
const QuestionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    required: true,
  },
  correct_answers: {
    type: [String],
    required: true,
  },
});

// Define attempt schema
const AttemptSchema = new mongoose.Schema({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  received_marks: {
    type: Number,
    default: 0,
  },
  answers: [
    {
      question_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
      },
      selected: [String],
    },
  ],
  attempted_at: {
    type: Date,
    default: Date.now,
  },
});

// Main quiz schema
const QuizSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    course_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    questions: [QuestionSchema],
    total_marks: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number, // Duration in minutes
      default: null,
    },
    attempts: [AttemptSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Quiz || mongoose.model("Quiz", QuizSchema);
