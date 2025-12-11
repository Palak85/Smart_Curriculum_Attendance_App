import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema(
  {
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },
    studentName: { type: String, required: true },
    roll: { type: String, required: true },
    class: { type: String, required: true },
    section: { type: String, required: true },
    subject: { type: String, required: true },
    assessment: { type: String, required: true }, // e.g., Midterm, Unit Test
    score: { type: Number, required: true },
    total: { type: Number, required: true },
    grade: { type: String, required: true },
    remarks: { type: String },
    date: { type: String, required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    teacherName: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("Grade", gradeSchema);

