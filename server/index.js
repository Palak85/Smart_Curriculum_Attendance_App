
import express from "express"
import cors from "cors"
import path from "path"
import { fileURLToPath } from "url"
import connectToDatabase from "./db/db.js"
import authRoutes from "./routes/auth.js"
import dotenv from "dotenv"
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classesRoute from "./routes/classes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import adminSettingsRoutes from "./routes/adminSettings.js";
import attendanceRoutes from "./routes/attendanceRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";
import gradeRoutes from "./routes/gradeRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()

const app = express()

// ✅ CORS FIX
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

connectToDatabase()

app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classesRoute);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/admin/settings", adminSettingsRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leaves", leaveRoutes);
app.use("/api/grades", gradeRoutes);


app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT)
})
