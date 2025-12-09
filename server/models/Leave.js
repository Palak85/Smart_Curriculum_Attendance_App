import mongoose from "mongoose";

const leaveSchema = new mongoose.Schema({
  teacherName: { type: String, required: true },
  teacherId: { type: String, required: true },

  fromDate: { type: String, required: true },
  toDate: { type: String, required: true },

  reason: { type: String, required: true },

  status: { type: String, default: "Pending" }   // Pending | Approved | Rejected
}, 
{ timestamps: true }
);

export default mongoose.model("Leave", leaveSchema);
