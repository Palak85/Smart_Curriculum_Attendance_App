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
import StudentModel from "../models/Student.js";

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

// Add student
router.post("/add", async (req, res) => {
  try {
    const { name, roll, class: cls, section } = req.body;

    const student = new StudentModel({
      name,
      roll,
      class: cls,
      section,
    });

    await student.save();
    res.json({ message: "Student added", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update student
router.put("/:id", async (req, res) => {
  try {
    const { name, roll, class: cls, section } = req.body;

    const student = await StudentModel.findByIdAndUpdate(
      req.params.id,
      { name, roll, class: cls, section },
      { new: true }
    );

    res.json({ message: "Student updated", student });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete student
router.delete("/:id", async (req, res) => {
  try {
    await StudentModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Student deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
