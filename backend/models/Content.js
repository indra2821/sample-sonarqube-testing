const mongoose = require("mongoose");

const ContentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true }, // URL of the content (video, article, etc.)
  description: { type: String },
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

module.exports = mongoose.model("Content", ContentSchema);
