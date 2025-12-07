// import express from "express";
// import Class from "../models/Class.js";

// const router = express.Router();

// // GET all classes
// router.get("/", async (req, res) => {
//   try {
//     const classes = await Class.find({});
//     res.json({ classes });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ADD a new class
// router.post("/add", async (req, res) => {
//   const { className } = req.body;
//   if (!className) return res.status(400).json({ error: "Class name required" });

//   try {
//     const newClass = new Class({ className, sections: [] });
//     await newClass.save();
//     res.json({ message: "Class added", newClass });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ADD section to a class
// router.post("/:id/section", async (req, res) => {
//   const { id } = req.params;
//   const { section } = req.body;

//   if (!section) return res.status(400).json({ error: "Section name required" });

//   try {
//     const cls = await Class.findById(id);
//     if (!cls) return res.status(404).json({ error: "Class not found" });

//     cls.sections.push(section);
//     await cls.save();
//     res.json({ message: "Section added", cls });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // DELETE a section
// router.delete("/:id/section/:sectionName", async (req, res) => {
//   const { id, sectionName } = req.params;

//   try {
//     const cls = await Class.findById(id);
//     if (!cls) return res.status(404).json({ error: "Class not found" });

//     cls.sections = cls.sections.filter(s => s !== sectionName);
//     await cls.save();
//     res.json({ message: "Section deleted", cls });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // DELETE a class
// router.delete("/:id", async (req, res) => {
//   const { id } = req.params;

//   try {
//     await Class.findByIdAndDelete(id);
//     res.json({ message: "Class deleted" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// export default router;

import express from "express";
import ClassModel from "../models/Class.js";

const router = express.Router();


// Get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await ClassModel.find({});
    res.json({ classes });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add new class
router.post("/add", async (req, res) => {
  try {
    const { className } = req.body;
    const existing = await ClassModel.findOne({ className });
    if (existing) return res.status(400).json({ message: "Class already exists" });

    const newClass = new ClassModel({ className, sections: [] });
    await newClass.save();
    res.json({ message: "Class added", class: newClass });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add section to class
router.post("/:id/section", async (req, res) => {
  try {
    const { section } = req.body;
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    if (cls.sections.includes(section))
      return res.status(400).json({ message: "Section already exists" });

    cls.sections.push(section);
    await cls.save();
    res.json({ message: "Section added", class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete section
router.delete("/:id/section/:section", async (req, res) => {
  try {
    const cls = await ClassModel.findById(req.params.id);
    if (!cls) return res.status(404).json({ message: "Class not found" });

    cls.sections = cls.sections.filter((s) => s !== req.params.section);
    await cls.save();
    res.json({ message: "Section deleted", class: cls });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete class
router.delete("/:id", async (req, res) => {
  try {
    await ClassModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Class deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
