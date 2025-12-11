import express from "express";
import Grade from "../models/Grade.js";
import Student from "../models/Student.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Teacher: create grade
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { studentId, subject, assessment, score, total, grade, remarks, date } = req.body;

    if (!studentId || !subject || !assessment || !score || !total || !grade || !date) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    const newGrade = await Grade.create({
      studentId,
      studentName: student.name,
      roll: student.roll,
      class: student.class,
      section: student.section,
      subject,
      assessment,
      score,
      total,
      grade,
      remarks,
      date,
      teacherId: req.user._id,
      teacherName: req.user.name || "Teacher",
    });

    return res.json({ success: true, grade: newGrade });
  } catch (err) {
    console.error("Create grade error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Teacher: list grades (optional filters)
router.get("/teacher", authMiddleware, async (req, res) => {
  try {
    const { class: className, section, studentId } = req.query;
    const query = {};
    if (className) query.class = className;
    if (section) query.section = section;
    if (studentId) query.studentId = studentId;

    const grades = await Grade.find(query).sort({ createdAt: -1 });
    return res.json({ success: true, grades });
  } catch (err) {
    console.error("Fetch teacher grades error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// Student: get own grades
router.get("/student", authMiddleware, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "User email missing" });
    }
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }

    const grades = await Grade.find({ studentId: student._id }).sort({ date: -1, createdAt: -1 });
    return res.json({ success: true, grades });
  } catch (err) {
    console.error("Fetch student grades error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

