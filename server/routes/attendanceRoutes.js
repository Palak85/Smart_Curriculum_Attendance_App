import express from "express";
import Attendance from "../models/attendance.js";

const router = express.Router();

router.post("/save", async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records) {
      return res.json({ success: false, message: "Missing fields" });
    }

    await Attendance.create({ date, records });

    res.json({ success: true, message: "Attendance saved" });
  } catch (error) {
    console.log("ATTENDANCE SAVE ERROR:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;

