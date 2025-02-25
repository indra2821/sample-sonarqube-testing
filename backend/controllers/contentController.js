const Content = require("../models/Content");
const Course = require("../models/Course");
const path = require("path");

// Helper function to convert file path to URL
const pathToUrl = (filePath) => {
  // Convert something like "./uploads/courseId/filename.ext" to "/uploads/courseId/filename.ext"
  return "/" + filePath.replace(/^\.\//, "").replace(/\\/g, "/");
};

// Helper to create full URL
const createFullUrl = (req, relativePath) => {
  return `${req.protocol}://${req.get("host")}${relativePath}`;
};

// Determine file type if not already done by middleware
const determineFileType = (file) => {
  const mimeType = file.mimetype;
  if (mimeType.startsWith("video/")) return "video";
  if (mimeType.startsWith("image/")) return "image";
  if (
    mimeType.includes("pdf") ||
    mimeType.includes("word") ||
    mimeType.includes("text")
  )
    return "document";
  return "other";
};

// Upload content (Instructor only)
const uploadContent = async (req, res) => {
  try {
    // req.file contains the uploaded file data (from Multer)
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // Make sure these fields are present in your form data
    const { title, description, course_id } = req.body;

    if (!title || !description || !course_id) {
      return res.status(400).json({
        message: "Missing required fields (title, description, or course_id)",
      });
    }

    // Convert file path to browser-accessible URL
    const relativePath = pathToUrl(req.file.path);
    const fullUrl = createFullUrl(req, relativePath);

    // Create new content entry
    const content = new Content({
      title,
      description,
      url: relativePath, // Store relative URL
      full_url: fullUrl, // Store full URL in database
      course_id,
      uploaded_by: req.user._id, // From auth middleware
      file_type: req.fileType || determineFileType(req.file),
      duration: 0, // Set appropriate default or calculate for videos
    });

    const savedContent = await content.save();

    // Return the saved content
    res.status(201).json(savedContent);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: "Server error during upload" });
  }
};

// Get all content for a course
const getCourseContent = async (req, res) => {
  try {
    const { course_id } = req.params;

    const content = await Content.find({ course_id })
      .sort({ created_at: -1 })
      .populate("uploaded_by", "name email");

    // If any content items don't have full_url, generate them now
    const contentWithFullUrls = content.map((item) => {
      const itemObj = item.toObject();
      if (!itemObj.full_url) {
        itemObj.full_url = createFullUrl(req, itemObj.url);
      }
      return itemObj;
    });

    res.status(200).json(contentWithFullUrls);
  } catch (error) {
    console.error("Error fetching content:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Delete content (Instructor only)
const deleteContent = async (req, res) => {
  try {
    const { content_id } = req.params;

    const content = await Content.findById(content_id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Get the course
    const course = await Course.findById(content.course_id);

    // Check if logged-in user is the instructor of this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only delete content from your own courses",
      });
    }

    // Remove content from course's content array
    course.content_Arr = course.content_Arr.filter(
      (id) => id.toString() !== content_id
    );
    await course.save();

    // Delete the content
    await content.deleteOne();

    res.status(200).json({ message: "Content deleted successfully" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Update content (Instructor only)
const updateContent = async (req, res) => {
  try {
    const { content_id } = req.params;
    const { title, description, duration } = req.body;

    const content = await Content.findById(content_id);
    if (!content) {
      return res.status(404).json({ message: "Content not found" });
    }

    // Get the course
    const course = await Course.findById(content.course_id);

    // Check if logged-in user is the instructor of this course
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You can only update content from your own courses",
      });
    }

    // Update content fields
    if (title) content.title = title;
    if (description) content.description = description;
    if (duration) content.duration = duration;

    // Handle file update if provided
    if (req.file) {
      const relativePath = pathToUrl(req.file.path);
      content.url = relativePath;
      content.full_url = createFullUrl(req, relativePath);
      content.file_type = req.fileType || content.file_type;
    }

    await content.save();

    res.status(200).json({
      message: "Content updated successfully",
      content,
    });
  } catch (error) {
    console.error("Error updating content:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

module.exports = {
  uploadContent,
  getCourseContent,
  deleteContent,
  updateContent,
};
