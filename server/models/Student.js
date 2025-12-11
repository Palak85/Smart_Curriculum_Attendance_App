import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roll: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  email: { type: String, unique: true, sparse: true },
});

export default mongoose.model("Student", studentSchema);

