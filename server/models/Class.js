import mongoose from "mongoose";

const classSchema = new mongoose.Schema({
  className: { type: String, required: true, unique: true },
  sections: { type: [String], default: [] },
});

export default mongoose.model("Class", classSchema);
