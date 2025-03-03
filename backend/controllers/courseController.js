const Enrollment = require("../models/Enrollment.js");
const Content = require("../models/Content.js");
const User = require("../models/userModel.js");
const Course = require("../models/Course.js");

// Create Course (Instructor Only)
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

    // Create the course first without content_Arr
    const newCourse = new Course({
      name,
      instructor: instructorData._id,
      instructor_email,
      content_Arr: [],
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
          course_id: newCourse._id, //
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

    // Delete all content associated with this course
    await Content.deleteMany({ course_id: course._id });

    // Delete the course
    await course.deleteOne();

    res
      .status(200)
      .json({ message: "Course and its contents deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

//enrollInCourse function
const enrollInCourse = async (req, res) => {
  try {
    const { id } = req.params; // Course ID from URL

    // Debug information
    console.log("Authentication info:", req.user);

    if (!req.user || !req.user._id) {
      return res
        .status(401)
        .json({ message: "User not authenticated properly" });
    }

    const userId = req.user._id;

    // Find the authenticated user by ID instead of email and role
    const student = await User.findById(userId);

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        userId: userId,
      });
    }

    console.log("Found student:", student.name, student.email, student.role);

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if student is already enrolled
    const existingEnrollment = await Enrollment.findOne({
      user_id: student._id,
      course_id: course._id,
    });

    if (existingEnrollment) {
      return res
        .status(400)
        .json({ message: "Already enrolled in this course" });
    }

    // Create new enrollment
    const newEnrollment = new Enrollment({
      user_id: student._id,
      student_name: student.name,
      student_email: student.email,
      course_id: course._id,
    });

    await newEnrollment.save();

    // Initialize progress tracking if the function exists
    try {
      const progressController = require("../controllers/progressController");
      if (typeof progressController.initializeProgress === "function") {
        await progressController.initializeProgress(student._id, course._id);
      }
    } catch (error) {
      console.warn("Progress initialization skipped:", error.message);
      // Continue with enrollment even if progress initialization fails
    }

    res.status(201).json({
      message: "Enrollment successful",
      enrollment: newEnrollment,
    });
  } catch (error) {
    console.error("Error enrolling student:", error);
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

    console.log(`Checking enrollment for User: ${userId}, Course: ${id}`);

    // Updated query to match Enrollment schema structure
    const isEnrolled = await Enrollment.findOne({
      user_id: userId, // Changed from user to user_id to match your schema
      course_id: id, // Changed from course to course_id to match your schema
    }).lean();

    if (!isEnrolled) {
      return res.status(403).json({ message: "Enroll in the course first!" });
    }

    const course = await Course.findById(id).populate("content_Arr").lean();
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    res.status(200).json(course.content_Arr);
  } catch (error) {
    console.error("Error in getCourseContent:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


// Add course to user's bookmarks
const addBookmark = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
    const userId = req.user._id;

    // Check if course exists
    const course = await Course.findById(id);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Find user and update bookmarks
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if already bookmarked
    if (user.bookmarked_courses.includes(id)) {
      return res.status(400).json({ message: "Course already bookmarked" });
    }

    // Add to bookmarks
    user.bookmarked_courses.push(id);
    await user.save();

    res.status(200).json({ 
      message: "Course added to bookmarks successfully",
      bookmarked_courses: user.bookmarked_courses
    });
  } catch (error) {
    console.error("Error adding bookmark:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Remove course from user's bookmarks
const removeBookmark = async (req, res) => {
  try {
    const { id } = req.params; // Course ID
    const userId = req.user._id;

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if course is bookmarked
    if (!user.bookmarked_courses.includes(id)) {
      return res.status(400).json({ message: "Course not in bookmarks" });
    }

    // Remove from bookmarks
    user.bookmarked_courses = user.bookmarked_courses.filter(
      courseId => courseId.toString() !== id
    );
    await user.save();

    res.status(200).json({ 
      message: "Course removed from bookmarks successfully",
      bookmarked_courses: user.bookmarked_courses
    });
  } catch (error) {
    console.error("Error removing bookmark:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

// Get all bookmarked courses for a user
const getBookmarkedCourses = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user and populate bookmarked courses
    const user = await User.findById(userId).populate({
      path: 'bookmarked_courses',
      populate: { path: 'instructor', select: 'name email' }
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.bookmarked_courses);
  } catch (error) {
    console.error("Error getting bookmarked courses:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
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
  addBookmark,
  removeBookmark,
  getBookmarkedCourses,
};
