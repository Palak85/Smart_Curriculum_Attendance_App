// import express from 'express'
// import cors from 'cors'
// import authRouter from './routes/auth.js'
// import connectToDatabase from './db/db.js'


// connectToDatabase()

// const app = express()
// app.use(cors())
// app.use(express.json())
// app.use('/api/auth',authRouter)

// app.listen(process.env.PORT, ()=>{
//     console.log(`Server is Running on port ${process.env.PORT}`)
// })



// import express from "express";
// import connectToDatabase from "./db/db.js"
// import dotenv from "dotenv"
// import authRoutes from './routes/auth.js';


// dotenv.config();
// const app = express();
// app.use(express.json());

// connectToDatabase();   // ✅ THIS MUST COME BEFORE ROUTES

// // import userRoutes from "./routes/userRoutes.js";
// app.use("/api/users", authRoutes);

// app.listen(process.env.PORT, () => {
//     console.log("Server running on port", process.env.PORT);
// });




import express from "express"
import cors from "cors"
import connectToDatabase from "./db/db.js"
import authRoutes from "./routes/auth.js"
import dotenv from "dotenv"
import studentRoutes from "./routes/studentRoutes.js";
import teacherRoutes from "./routes/teacherRoutes.js";
import classesRoute from "./routes/classes.js";

dotenv.config()

const app = express()

// ✅ CORS FIX
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))

app.use(express.json())

connectToDatabase()

app.use("/api/auth", authRoutes)
app.use("/api/students", studentRoutes);
app.use("/api/teachers", teacherRoutes);
app.use("/api/classes", classesRoute);


app.listen(process.env.PORT, () => {
    console.log("Server running on port", process.env.PORT)
})
