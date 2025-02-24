const mongoose = require("mongoose");

const quizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  questions: [
    {
      question_text: String,
      options: [String],
      correct_answers: [String],
    },
  ],
  total_marks: { type: Number, required: true },
  duration: Number, // Optional quiz duration in seconds
  attempts: [
    {
      student_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      received_marks: Number,
      attempted_at: { type: Date, default: Date.now },
    },
  ],
});

const Quiz = mongoose.model("Quiz", quizSchema);
module.exports = Quiz;
