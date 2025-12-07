// import express from "express";
// import Teacher from "../models/Teacher.js";

// const router = express.Router();

// // GET all teachers
// router.get("/", async (req, res) => {
//   try {
//     const teachers = await Teacher.find();
//     res.json({ teachers });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // ADD teacher
// router.post("/add", async (req, res) => {
//   try {
//     const { name, subject, class: className, section } = req.body;
//     const teacher = new Teacher({ name, subject, class: className, section });
//     await teacher.save();
//     res.json({ message: "Teacher added successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // UPDATE teacher
// router.put("/:id", async (req, res) => {
//   try {
//     const { name, subject, class: className, section } = req.body;
//     const teacher = await Teacher.findByIdAndUpdate(
//       req.params.id,
//       { name, subject, class: className, section },
//       { new: true }
//     );
//     res.json(teacher);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // DELETE teacher
// router.delete("/:id", async (req, res) => {
//   try {
//     await Teacher.findByIdAndDelete(req.params.id);
//     res.json({ message: "Teacher deleted" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// export default router;

import express from "express";
import TeacherModel from "../models/Teacher.js";

const router = express.Router();

// GET all teachers
router.get("/", async (req, res) => {
  try {
    const teachers = await TeacherModel.find({});
    res.json({ teachers });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD teacher
router.post("/add", async (req, res) => {
  try {
    const { name, subject, class: cls, section } = req.body;

    if (!name || !subject || !cls || !section) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newTeacher = new TeacherModel({
      name,
      subject,
      class: cls,
      section
    });

    await newTeacher.save();
    res.json({ message: "Teacher added", teacher: newTeacher });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE teacher
router.put("/:id", async (req, res) => {
  try {
    const { name, subject, class: cls, section } = req.body;

    const updated = await TeacherModel.findByIdAndUpdate(
      req.params.id,
      { name, subject, class: cls, section },
      { new: true }
    );

    res.json({ message: "Teacher updated", teacher: updated });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE teacher
router.delete("/:id", async (req, res) => {
  try {
    await TeacherModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Teacher deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
