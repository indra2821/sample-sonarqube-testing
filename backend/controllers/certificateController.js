const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Progress = require("../models/Progress");
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/userModel");
const SibApiV3Sdk = require("sib-api-v3-sdk");

// Certificate model
const Certificate = require("../models/Certificate");

// Generate certificate
exports.generateCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user._id;

    // Check if user is enrolled in the course
    const enrollment = await Enrollment.findOne({
      user_id: userId,
      course_id: courseId,
    });

    if (!enrollment) {
      return res.status(403).json({
        message:
          "You must be enrolled in this course to generate a certificate",
      });
    }

    // Check if user has completed the course (100% progress)
    const progress = await Progress.findOne({
      user_id: userId,
      course_id: courseId,
    });

    if (!progress || progress.overall_progress.total_progress < 100) {
      return res.status(403).json({
        message:
          "You must complete 100% of the course to receive a certificate",
        currentProgress: progress
          ? progress.overall_progress.total_progress
          : 0,
      });
    }

    // Get course and user details
    const course = await Course.findById(courseId).populate(
      "instructor",
      "name"
    );

    const user = await User.findById(userId);

    if (!course || !user) {
      return res.status(404).json({
        message: "Course or user information not found",
      });
    }

    // Generate unique filename
    const fileName = `certificate-${courseId}-${userId}-${Date.now()}.pdf`;
    const dirPath = path.join(__dirname, "../uploads/certificates");
    const filePath = path.join(dirPath, fileName);

    // Create directory if it doesn't exist
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }

    // Check if certificate already exists
    let certificate = await Certificate.findOne({
      user_id: userId,
      course_id: courseId,
    });

    const completionDate = new Date();
    const certificateUrl = `/uploads/certificates/${fileName}`;

    // Create PDF document
    await createCertificatePDF(
      filePath,
      user.name,
      course.name,
      course.instructor.name,
      new Date(completionDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    );

    if (!certificate) {
      // Create certificate entry in database with URL already set
      certificate = new Certificate({
        user_id: userId,
        course_id: courseId,
        student_name: user.name,
        course_name: course.name,
        instructor_name: course.instructor.name,
        completion_date: completionDate,
        certificate_url: certificateUrl,
      });
    } else {
      // Update existing certificate
      certificate.certificate_url = certificateUrl;
      certificate.completion_date = completionDate;
    }

    await certificate.save();

    // Send email with certificate
    if (user.email) {
      try {
        await sendCertificateEmail(
          user.email,
          user.name,
          course.name,
          `${req.protocol}://${req.get("host")}${certificateUrl}`
        );
      } catch (emailError) {
        console.error("Error sending certificate email:", emailError);
        // Continue even if email fails
      }
    }

    res.status(200).json({
      message: "Certificate generated successfully",
      certificate: {
        ...certificate.toObject(),
        certificate_url: `${req.protocol}://${req.get(
          "host"
        )}${certificateUrl}`,
      },
    });
  } catch (error) {
    console.error("Error generating certificate:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Get certificate
exports.getCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const userId = req.user._id;

    const certificate = await Certificate.findById(certificateId)
      .populate("course_id", "name")
      .populate("user_id", "name email");

    // Check if certificate exists and belongs to the user
    if (
      !certificate ||
      certificate.user_id._id.toString() !== userId.toString()
    ) {
      return res.status(404).json({
        message: "Certificate not found or unauthorized",
      });
    }

    res.status(200).json({
      certificate: {
        ...certificate.toObject(),
        certificate_url: `${req.protocol}://${req.get("host")}${
          certificate.certificate_url
        }`,
      },
    });
  } catch (error) {
    console.error("Error retrieving certificate:", error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// Create PDF certificate using PDFKit
const createCertificatePDF = async (
  filePath,
  studentName,
  courseName,
  instructorName,
  completionDate
) => {
  return new Promise((resolve, reject) => {
    // Create a document
    const doc = new PDFDocument({
      layout: "landscape",
      size: "A4",
      margin: 0,
    });

    // Pipe its output to the file
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // Certificate styling
    const width = doc.page.width;
    const height = doc.page.height;

    // Add border with gold color
    doc
      .rect(20, 20, width - 40, height - 40)
      .lineWidth(3)
      .strokeColor("#D4AF37");

    // Add inner border
    doc.rect(30, 30, width - 60, height - 60).stroke();

    // Add certificate background color
    doc
      .rect(30, 30, width - 60, height - 60)
      .fillOpacity(0.2)
      .fill("#F5F5F5");

    // Reset fill opacity
    doc.fillOpacity(1);

    // Add certificate header
    doc
      .fontSize(30)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text("Certificate of Completion", 0, 90, { align: "center" });

    // Add certificate content
    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#555555")
      .text("This is to certify that", 0, 150, { align: "center" });

    // Add student name
    doc
      .fontSize(24)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text(studentName, 0, 180, { align: "center" });

    // Add more content
    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#555555")
      .text("has successfully completed the course", 0, 220, {
        align: "center",
      });

    // Add course name
    doc
      .fontSize(22)
      .font("Helvetica-BoldOblique")
      .fillColor("#333333")
      .text(courseName, 0, 250, { align: "center" });

    // Add completion date
    doc
      .fontSize(14)
      .font("Helvetica")
      .fillColor("#555555")
      .text(`Completed on: ${completionDate}`, 0, 300, { align: "center" });

    // Add instructor name
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .fillColor("#333333")
      .text(`Instructor: ${instructorName}`, 0, 350, { align: "center" });

    // Add signature line
    doc
      .moveTo(width / 2 - 100, 380)
      .lineTo(width / 2 + 100, 380)
      .stroke();

    // Finalize PDF file
    doc.end();

    stream.on("finish", () => {
      resolve(filePath);
    });

    stream.on("error", (err) => {
      reject(err);
    });
  });
};

// Send certificate via email using Brevo API
const sendCertificateEmail = async (
  studentEmail,
  studentName,
  courseName,
  certificateUrl
) => {
  try {
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications["api-key"];
    apiKey.apiKey = process.env.BREVO_API_KEY;

    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sender = {
      email: process.env.SENDER_EMAIL,
      name: "EduMosaic E-Learning Platform",
    };

    const receivers = [
      {
        email: studentEmail,
        name: studentName,
      },
    ];

    const emailContent = {
      sender,
      to: receivers,
      subject: `Congratulations! You've Completed ${courseName}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #4a4a4a;">Congratulations, ${studentName}!</h2>
          <p>You have successfully completed the course <strong>${courseName}</strong>.</p>
          <p>We are pleased to award you with this certificate of completion.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${certificateUrl}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">View Your Certificate</a>
          </div>
          <p>You can download your certificate from the link above or access it anytime from your course dashboard.</p>
          <p>We hope you enjoyed the learning experience and gained valuable knowledge!</p>
          <p>Best regards,<br/>The E-Learning Team</p>
        </div>
      `,
    };

    await apiInstance.sendTransacEmail(emailContent);
    console.log("Certificate email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending certificate email:", error);
    throw error;
  }
};
