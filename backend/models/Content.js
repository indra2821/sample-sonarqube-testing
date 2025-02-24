const mongoose = require("mongoose");

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String, required: true },
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
  created_at: { type: Date, default: Date.now },
});

const Content = mongoose.model("Content", contentSchema);
module.exports = Content;
