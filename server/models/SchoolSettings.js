// models/SchoolSettings.js
import mongoose from "mongoose";

const schoolSettingsSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true },
    academicYear: { type: String, required: true },
    address: { type: String, default: "" },
    contactNumber: { type: String, default: "" },
    email: { type: String, default: "" },
  },
  { timestamps: true }
);

const SchoolSettings = mongoose.model("SchoolSettings", schoolSettingsSchema);

export default SchoolSettings;
