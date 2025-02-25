const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    default: 0,
  },
  url: {
    type: String,
    required: true,
  },
  full_url: {
    type: String,
    required: true,
  },
  course_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  uploaded_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  file_type: {
    type: String,
    enum: ["video", "document", "image", "other"],
    default: "other",
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Content", ContentSchema);
