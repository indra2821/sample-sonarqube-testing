const Enrollment = require("../models/Enrollment.js");

// Create Course (Instructor Only)
const Content = require("../models/Content.js"); // Import Content model
const User = require("../models/userModel.js"); // Import User model
const Course = require("../models/Course.js"); // Import Course model

const createCourse = async (req, res) => {
  try {
    const { name, instructor, instructor_email, content_Arr } = req.body;

    if (!name || !instructor || !instructor_email || !content_Arr) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find instructor by name
    const instructorData = await User.findOne({
      name: instructor,
      role: "Instructor",
    });

    if (!instructorData) {
      return res.status(404).json({ message: "Instructor not found" });
    }

    // Create the course first without content_Arr (we will update it later)
    const newCourse = new Course({
      name,
      instructor: instructorData._id,
      instructor_email,
      content_Arr: [], // Empty for now
    });

    await newCourse.save();

    // Save content items and get their ObjectIds
    const contentIds = await Promise.all(
      content_Arr.map(async (content) => {
        const newContent = new Content({
          title: content.title,
          description: content.description,
          duration: content.duration,
          url: content.url || "https://example.com/default-url", // Ensure URL exists
          course_id: newCourse._id, // Now course_id is set properly
          uploaded_by: instructorData._id,
        });

        const savedContent = await newContent.save();
        return savedContent._id;
      })
    );

    // Update the course with content ObjectIds
    newCourse.content_Arr = contentIds;
    await newCourse.save();

    res
      .status(201)
      .json({ message: "Course created successfully", course: newCourse });
  } catch (error) {
    console.error("Error creating course:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

// Get All Courses
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find().populate("instructor", "name email");
    res.status(200).json(courses);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get Course by ID
const getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate(
      "instructor",
      "name email"
    );
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    res.status(200).json(course);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Course (Instructor Only)
const updateCourse = async (req, res) => {
  try {
    const { name, description, content_Arr } = req.body;
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You Can Only Update Your Own Courses" });
    }

    course.name = name || course.name;
    course.description = description || course.description;
    course.content_Arr = content_Arr || course.content_Arr;

    await course.save();
    res.status(200).json({ message: "Course Updated Successfully", course });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Course (Instructor Only)
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You Can Only Delete Your Own Courses" });
    }

    await course.deleteOne();
    res.status(200).json({ message: "Course Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Enroll in Course
const enrollInCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    // Prevent duplicate enrollment
    const existingEnrollment = await Enrollment.findOne({
      user: req.user._id,
      course: courseId,
    });
    if (existingEnrollment)
      return res
        .status(400)
        .json({ message: "Already Enrolled in this Course" });

    const enrollment = new Enrollment({ user: req.user._id, course: courseId });
    await enrollment.save();

    res.status(201).json({ message: "Enrolled Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Access Course Content (Only Enrolled Students)
const getCourseContent = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
    const userId = req.user._id;

    const isEnrolled = await Enrollment.findOne({ user: userId, course: id });
    if (!isEnrolled) {
      return res.status(403).json({ message: "Enroll in the course first!" });
    }

    const course = await Course.findById(id).populate("content_Arr");
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    res.status(200).json(course.content_Arr);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = {
  createCourse,
  getCourses,
  getCourseById,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  getCourseContent,
};
