import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  dueDate: { type: Date, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherName: { type: String, required: true },
  fileUrl: { type: String }, // Path to uploaded file
  fileName: { type: String }, // Original filename
  fileSize: { type: Number }, // File size in bytes
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Assignment", assignmentSchema);

