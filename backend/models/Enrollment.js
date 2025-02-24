const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  student_name: {
    type: String,
    required: true,
  },
  student_email: {
    type: String,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolled_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
