const Content = require("../models/Content");

const uploadContent = async (req, res) => {
  try {
    console.log("🔹 Request Body:", req.body);
    console.log("🔹 Uploaded File:", req.file);

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { title, description, course_id } = req.body;

    if (!title || !description || !course_id) {
      return res
        .status(400)
        .json({ message: "Title, Description, and Course ID are required" });
    }

    // Save file data in database
    const newContent = new Content({
      title,
      description,
      course_id,
      url: `/uploads/${req.file.filename}`, // File path
      uploaded_by: req.user._id, // Instructor who uploaded it
      created_at: new Date(),
    });

    await newContent.save();

    res
      .status(201)
      .json({ message: "File uploaded successfully", content: newContent });
  } catch (error) {
    console.error("Upload Error:", error);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

module.exports = { uploadContent };
