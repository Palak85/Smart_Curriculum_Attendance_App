
import mongoose from "mongoose";

const attendanceRecordSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
  name: { type: String, required: true },
  roll: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  status: { type: String, enum: ["Present", "Absent"], required: true }
}, { _id: false });

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  markedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false },
  records: [attendanceRecordSchema]
}, { versionKey: false, timestamps: true });

AttendanceSchema.index({ date: 1, class: 1, section: 1 }, { unique: true });

AttendanceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
  }
});

export default mongoose.model("Attendance", AttendanceSchema);
