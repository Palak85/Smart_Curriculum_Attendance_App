// import express from "express";
// import { addStudent, getStudents } from "../controllers/studentController.js";
// import { deleteStudent } from "../controllers/studentController.js";
// import { updateStudent } from "../controllers/studentController.js";

// const router = express.Router();

// router.post("/add", addStudent);
// router.get("/", getStudents);
// router.delete("/:id", deleteStudent);
// router.put("/:id", updateStudent);







import express from "express";
import bcrypt from "bcryptjs";
import StudentModel from "../models/Student.js";
import User from "../models/User.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all students
router.get("/", async (req, res) => {
  try {
    const students = await StudentModel.find({});
    res.json({ students });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get current logged-in student's record (by user email)
router.get("/me", authMiddleware, async (req, res) => {
  try {
    const email = req.user?.email;
    if (!email) {
      return res.status(400).json({ success: false, message: "User email not found" });
    }
    const student = await StudentModel.findOne({ email });
    if (!student) {
      return res.status(404).json({ success: false, message: "Student record not found" });
    }
    return res.json({ success: true, student });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// Add student + create login
router.post("/add", async (req, res) => {
  try {
    const { name, roll, class: cls, section, email, password } = req.body;

    if (!name || !roll || !cls || !section) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required to create login" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = new StudentModel({
      name,
      roll,
      class: cls,
      section,
      email,
    });
    await student.save();

    await User.create({
      name,
      email,
      password: hashedPassword,
      role: "student",
    });

    res.json({ message: "Student added and login created", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student + user login
router.put("/:id", async (req, res) => {
  try {
    const { name, roll, class: cls, section, email, password } = req.body;

    const student = await StudentModel.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // If email is changing, ensure uniqueness
    if (email && email !== student.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists" });
      }
    }

    const oldEmail = student.email;

    student.name = name || student.name;
    student.roll = roll || student.roll;
    student.class = cls || student.class;
    student.section = section || student.section;
    student.email = email || student.email;
    await student.save();

    // Sync User account
    let user = oldEmail ? await User.findOne({ email: oldEmail }) : null;
    if (!user && email) {
      user = await User.findOne({ email });
    }

    if (user) {
      user.name = student.name;
      if (email) user.email = email;
      if (password) {
        user.password = await bcrypt.hash(password, 10);
      }
      await user.save();
    } else if (email && password) {
      // Create user if none exists and credentials provided
      await User.create({
        name: student.name,
        email,
        password: await bcrypt.hash(password, 10),
        role: "student",
      });
    }

    res.json({ message: "Student updated", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete student (does not delete user to avoid accidental lockout)
router.delete("/:id", async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
