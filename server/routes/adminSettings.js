// routes/adminSettings.js
import express from "express";
import SchoolSettings from "../models/SchoolSettings.js";

const router = express.Router();


// GET /api/admin/settings/general
router.get(
  "/general",
  // auth, isAdmin,
  async (req, res) => {
    try {
      let settings = await SchoolSettings.findOne();

      // First time: default create
      if (!settings) {
        settings = await SchoolSettings.create({
          schoolName: "Smart School",
          academicYear: "2024-25",
          address: "",
          contactNumber: "",
          email: "",
        });
      }

      return res.json(settings);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to load settings" });
    }
  }
);

// PUT /api/admin/settings/general
router.put(
  "/general",
  // auth, isAdmin,
  async (req, res) => {
    try {
      const { schoolName, academicYear, address, contactNumber, email } =
        req.body;

      let settings = await SchoolSettings.findOne();
      if (!settings) {
        settings = new SchoolSettings();
      }

      if (schoolName !== undefined) settings.schoolName = schoolName;
      if (academicYear !== undefined) settings.academicYear = academicYear;
      if (address !== undefined) settings.address = address;
      if (contactNumber !== undefined) settings.contactNumber = contactNumber;
      if (email !== undefined) settings.email = email;

      await settings.save();

      return res.json({ message: "Settings updated", settings });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update settings" });
    }
  }
);

export default router;
