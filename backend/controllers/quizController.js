const Quiz = require("../models/Quiz");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment.js");

// Create Quiz (Instructor Only)
const createQuiz = async (req, res) => {
  try {
    const { title, description, course_id, questions, total_marks, duration } =
      req.body;

    const course = await Course.findById(course_id);
    if (!course) return res.status(404).json({ message: "Course Not Found" });

    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to create quiz for this course" });
    }

    const quiz = new Quiz({
      title,
      description,
      course_id,
      questions,
      total_marks,
      duration: duration || null, //  Timer
    });

    await quiz.save();
    res.status(201).json({ message: "Quiz Created Successfully", quiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Get All Quizzes for a Course
const getQuizzes = async (req, res) => {
  try {
    const { course_id } = req.params;
    const quizzes = await Quiz.find({ course_id });

    res.status(200).json(quizzes);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Update Quiz (Instructor Only)
const updateQuiz = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) return res.status(404).json({ message: "Quiz Not Found" });

    const course = await Course.findById(quiz.course_id);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to edit this quiz" });
    }

    const updatedQuiz = await Quiz.findByIdAndUpdate(quiz_id, req.body, {
      new: true,
    });

    res.status(200).json({ message: "Quiz Updated Successfully", updatedQuiz });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

// Delete Quiz (Instructor Only)
const deleteQuiz = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) return res.status(404).json({ message: "Quiz Not Found" });

    const course = await Course.findById(quiz.course_id);
    if (course.instructor.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorized to delete this quiz" });
    }

    await quiz.deleteOne();
    res.status(200).json({ message: "Quiz Deleted Successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

const attemptQuiz = async (req, res) => {
  try {
    const { quiz_id } = req.params;
    const { answers } = req.body; // Answers provided by the student

    // Get logged-in student ID
    const student_id = req.user._id;

    // Find the quiz
    const quiz = await Quiz.findById(quiz_id);
    if (!quiz) return res.status(404).json({ message: "Quiz Not Found" });

    // Check if the student is enrolled in the course where the quiz belongs
    const isEnrolled = await Enrollment.findOne({
      user_id: student_id,
      course_id: quiz.course_id,
    });

    if (!isEnrolled) {
      return res
        .status(403)
        .json({ message: "You are not enrolled in this course!" });
    }

    // Debugging: Print questions
    console.log("\n🚀 Quiz Questions:", quiz.questions);

    // Calculate received marks
    let received_marks = 0;

    quiz.questions.forEach((q) => {
      // Find the student answer for this question
      const studentAnswer = answers.find(
        (ans) => ans.question_id.toString() === q._id.toString()
      );

      console.log("\n--- Checking Answer ---");
      console.log("Question ID:", q._id);
      console.log("Question:", q.question);
      console.log("Correct Answers:", q.correct_answers);
      console.log(
        "Student Answer Received:",
        studentAnswer?.selected || "No Answer"
      );

      if (studentAnswer) {
        const isCorrect =
          studentAnswer.selected.sort().join(",") ===
          q.correct_answers.sort().join(",");

        if (isCorrect) {
          received_marks += quiz.total_marks / quiz.questions.length;
        }
      }
    });

    // Store the quiz attempt in the database
    quiz.attempts.push({
      student_id: student_id,
      received_marks: received_marks,
      answers: answers, // Save student's answers
      attempted_at: new Date(),
    });

    await quiz.save(); //  Save updated quiz with attempt details

    res.status(200).json({
      message: "Quiz Attempted Successfully",
      received_marks: received_marks,
    });
  } catch (error) {
    console.error("Error attempting quiz:", error);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};


module.exports = {
  createQuiz,
  getQuizzes,
  updateQuiz,
  deleteQuiz,
  attemptQuiz,
};
