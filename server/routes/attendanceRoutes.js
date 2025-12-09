import express from "express";
import Attendance from "../models/attendance.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Save or update attendance for a class/section on a date
router.post("/mark", authMiddleware, async (req, res) => {
  try {
    const { date, class: className, section, records } = req.body;

    if (!date || !className || !section || !Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // Upsert attendance for the given date/class/section
    const attendance = await Attendance.findOneAndUpdate(
      { date, class: className, section },
      {
        date,
        class: className,
        section,
        markedBy: req.user?._id,
        records: records.map(r => ({
          studentId: r.studentId,
          name: r.name,
          roll: r.roll,
          class: className,
          section,
          status: r.status
        }))
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, attendance });
  } catch (error) {
    console.error("ATTENDANCE MARK ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get attendance for a date/class/section
router.get("/", authMiddleware, async (req, res) => {
  try {
    const { date, class: className, section } = req.query;
    if (!date || !className || !section) {
      return res.status(400).json({ success: false, message: "Missing query params" });
    }

    const attendance = await Attendance.findOne({ date, class: className, section });
    return res.json({ success: true, attendance });
  } catch (error) {
    console.error("ATTENDANCE FETCH ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

