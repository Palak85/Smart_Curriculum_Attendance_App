// import express from "express";
// import Attendance from "../models/attendance.js";
// import authMiddleware from "../middleware/authMiddleware.js";
// import StudentModel from "../models/Student.js";

// const router = express.Router();

// // Save or update attendance for a class/section on a date
// router.post("/mark", authMiddleware, async (req, res) => {
//   try {
//     const { date, class: className, section, records } = req.body;

//     if (!date || !className || !section || !Array.isArray(records) || records.length === 0) {
//       return res.status(400).json({ success: false, message: "Missing fields" });
//     }

//     // Upsert attendance for the given date/class/section
//     const attendance = await Attendance.findOneAndUpdate(
//       { date, class: className, section },
//       {
//         date,
//         class: className,
//         section,
//         markedBy: req.user?._id,
//         records: records.map(r => ({
//           studentId: r.studentId,
//           name: r.name,
//           roll: r.roll,
//           class: className,
//           section,
//           status: r.status
//         }))
//       },
//       { upsert: true, new: true, setDefaultsOnInsert: true }
//     );

//     return res.json({ success: true, attendance });
//   } catch (error) {
//     console.error("ATTENDANCE MARK ERROR:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });


// // Get attendance for a date/class/section
// router.get("/", authMiddleware, async (req, res) => {
//   try {
//     const { date, class: className, section } = req.query;
//     if (!date || !className || !section) {
//       return res.status(400).json({ success: false, message: "Missing query params" });
//     }

//     const attendance = await Attendance.findOne({ date, class: className, section });
//     return res.json({ success: true, attendance });
//   } catch (error) {
//     console.error("ATTENDANCE FETCH ERROR:", error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });



// export default router;
// routes/attendanceRoutes.js
import express from "express";
import Attendance from "../models/attendance.js";
import StudentModel from "../models/Student.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

console.log("attendanceRoutes.js loaded");

// POST /api/attendance/mark
// Body: { date, class, section, records: [{ studentId, name, roll, status }] }
// Requires auth (teacher/admin)
router.post("/mark", authMiddleware, async (req, res) => {
  try {
    const { date, class: className, section, records } = req.body;

    if (!date || !className || !section || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: "Missing required fields (date, class, section, records)" });
    }

    // Map records to shape expected by model
    const mappedRecords = records.map(r => ({
      studentId: r.studentId,
      name: r.name,
      roll: r.roll,
      class: className,
      section,
      status: r.status === "Present" ? "Present" : "Absent"
    }));

    const attendance = await Attendance.findOneAndUpdate(
      { date, class: className, section },
      {
        date,
        class: className,
        section,
        markedBy: req.user?._id,
        records: mappedRecords
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, attendance });
  } catch (error) {
    console.error("ATTENDANCE MARK ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error while marking attendance" });
  }
});

// GET /api/attendance
// Query params: ?date=YYYY-MM-DD&class=5-A&section=A
// Returns attendance doc for that date/class/section
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { date, class: className, section } = req.query;
    if (!date || !className || !section) {
      return res.status(400).json({ success: false, message: "Missing query params: date, class, section" });
    }

    const attendance = await Attendance.findOne({ date, class: className, section });
    if (!attendance) {
      return res.json({ success: true, attendance: null, message: "No attendance record found for given date/class/section" });
    }

    return res.json({ success: true, attendance });
  } catch (error) {
    console.error("ATTENDANCE FETCH ERROR:", error);
    return res.status(500).json({ success: false, message: "Server error while fetching attendance" });
  }
});

// GET /api/attendance/student
// If ?studentId= is provided (admin/teacher), returns that student's attendance.
// Otherwise infers student by logged-in user's email (student).
router.get("/student", authMiddleware, async (req, res) => {
  try {
    const requestedStudentId = req.query.studentId;

    let student;
    if (requestedStudentId) {
      student = await StudentModel.findById(requestedStudentId);
      if (!student) return res.status(404).json({ success: false, message: "Student not found" });
    } else {
      const email = req.user?.email;
      if (!email) return res.status(400).json({ success: false, message: "User email not found" });
      student = await StudentModel.findOne({ email });
      if (!student) return res.status(404).json({ success: false, message: "Student record not found for user" });
    }

    // Find attendance docs that include this student
    const attendances = await Attendance.find({ "records.studentId": student._id }).sort({ date: -1 });

    const rows = attendances.map(a => {
      const rec = a.records.find(r => String(r.studentId) === String(student._id));
      return {
        attendanceId: a._id,
        date: a.date,
        class: a.class,
        section: a.section,
        status: rec ? rec.status : "Absent",
        markedBy: a.markedBy,
        createdAt: a.createdAt,
        updatedAt: a.updatedAt
      };
    });

    return res.json({
      success: true,
      student: { _id: student._id, name: student.name, roll: student.roll, class: student.class, section: student.section },
      records: rows
    });
  } catch (err) {
    console.error("FETCH STUDENT ATTENDANCE ERROR:", err);
    return res.status(500).json({ success: false, message: "Server error while fetching student attendance" });
  }
});

export default router;
