import Attendance from "../models/attendance.js";

export const saveAttendance = async (req, res) => {
  try {
    const { date, records } = req.body;

    if (!date || !records) {
      return res.json({ success: false, message: "Missing fields" });
    }

    // If attendance for this date exists → overwrite
    let existing = await Attendance.findOne({ date });

    if (existing) {
      existing.records = records;
      await existing.save();
      return res.json({ success: true, message: "Attendance updated" });
    }

    // Create new record
    await Attendance.create({ date, records });

    res.json({ success: true, message: "Attendance saved successfully!" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Server error" });
  }
};
