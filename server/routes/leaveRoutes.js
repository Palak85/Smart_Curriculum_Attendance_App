// import express from "express";
// import Leave from "../models/Leave.js";

// const router = express.Router();

// // Apply leave (Teacher)
// router.post("/apply", async (req, res) => {
//   try {
//     const { teacherName, teacherId, fromDate, toDate, reason } = req.body;
//     if (!teacherName || !teacherId || !fromDate || !toDate || !reason) {
//       return res.status(400).json({ success: false, message: "All fields are required" });
//     }

//     const leave = new Leave({ teacherName, teacherId, fromDate, toDate, reason });
//     await leave.save();

//     res.status(201).json({ success: true, message: "Leave applied successfully", leave });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Get leaves of a specific teacher
// router.get("/my-leaves/:teacherId", async (req, res) => {
//   try {
//     const { teacherId } = req.params;
//     const leaves = await Leave.find({ teacherId }).sort({ createdAt: -1 });
//     res.json({ success: true, leaves });
//   } catch (error) {
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Get all leaves (Admin)
// router.get("/all", async (req, res) => {
//   try {
//     const leaves = await Leave.find().sort({ createdAt: -1 }); // latest first
//     res.json({ success: true, leaves });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// // Update leave status (Admin)
// router.patch("/update/:leaveId", async (req, res) => {
//   try {
//     const { leaveId } = req.params;
//     const { status } = req.body;

//     if (!["Approved", "Rejected"].includes(status)) {
//       return res.status(400).json({ success: false, message: "Invalid status" });
//     }

//     const leave = await Leave.findByIdAndUpdate(leaveId, { status }, { new: true });
//     if (!leave) return res.status(404).json({ success: false, message: "Leave not found" });

//     res.json({ success: true, message: `Leave ${status} successfully`, leave });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: "Server error" });
//   }
// });

// export default router;





import express from "express";
import Leave from "../models/Leave.js";

const router = express.Router();

// Apply leave (Teacher)
router.post("/apply", async (req, res) => {
  try {
    const { teacherName, teacherId, fromDate, toDate, reason } = req.body;

    if (!teacherName || !teacherId || !fromDate || !toDate || !reason) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const leave = new Leave({ teacherName, teacherId, fromDate, toDate, reason });
    await leave.save();

    res.status(201).json({ success: true, message: "Leave applied successfully", leave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get leaves of a specific teacher
router.get("/my-leaves/:teacherId", async (req, res) => {
  try {
    const { teacherId } = req.params;
    const leaves = await Leave.find({ teacherId }).sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Get all leaves (Admin)
router.get("/all", async (req, res) => {
  try {
    const leaves = await Leave.find().sort({ createdAt: -1 });

    res.json({ success: true, leaves });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update leave status (Admin)
router.patch("/update/:leaveId", async (req, res) => {
  try {
    const { leaveId } = req.params;
    let { status } = req.body;

    // Normalize status to Approved / Rejected
    status = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status" });
    }

    const updatedLeave = await Leave.findByIdAndUpdate(
      leaveId,
      { status },
      { new: true }
    );

    if (!updatedLeave)
      return res.status(404).json({ success: false, message: "Leave not found" });

    res.json({ success: true, message: `Leave ${status}`, leave: updatedLeave });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
