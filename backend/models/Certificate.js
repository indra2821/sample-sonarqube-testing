const mongoose = require("mongoose");

const CertificateSchema = new mongoose.Schema(
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
    student_name: {
      type: String,
      required: true,
    },
    course_name: {
      type: String,
      required: true,
    },
    instructor_name: {
      type: String,
      required: true,
    },
    completion_date: {
      type: Date,
      default: Date.now,
    },
    certificate_url: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

// Create a compound index to ensure one certificate per user per course
CertificateSchema.index({ user_id: 1, course_id: 1 }, { unique: true });

module.exports = mongoose.model("Certificate", CertificateSchema);
