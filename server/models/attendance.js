
import mongoose from "mongoose";

const AttendanceSchema = new mongoose.Schema({
  date: { type: String, required: true },
  records: [
    {
      studentId: { type: String, required: true },
      name: { type: String, required: true },
      status: { type: String, required: true }
    }
  ]
}, { versionKey: false });

AttendanceSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;   // rename _id to id
    delete ret._id;     // remove _id
  }
});

export default mongoose.model("Attendance", AttendanceSchema);
