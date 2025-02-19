const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  questions: [
    {
      question: { type: String, required: true },
      options: [{ type: String, required: true }], 
      selected_answers: [{ type: String }], 
      correct_answers: [{ type: String, required: true }], 
    },
  ],
  total_marks: { type: Number, required: true },
  received_marks: { type: Number, default: 0 },
});

module.exports = mongoose.model("Quiz", QuizSchema);
