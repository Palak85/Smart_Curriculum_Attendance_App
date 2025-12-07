
// server/userSeed.js
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "./models/User.js";
import connectToDatabase from "./db/db.js";

dotenv.config();

const createUsers = async () => {
  await connectToDatabase();

  try {
    // Create Admin User
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });
    if (!existingAdmin) {
      const hashedAdminPassword = await bcrypt.hash("admin", 10);
      const newAdmin = new User({
        name: "Admin",
        email: "admin@gmail.com",
        password: hashedAdminPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log("✅ Admin user created successfully!");
      console.log("   Email: admin@gmail.com");
      console.log("   Password: admin");
    } else {
      console.log("ℹ️  Admin user already exists!");
    }

    // Create Teacher User
    const existingTeacher = await User.findOne({ email: "teacher@gmail.com" });
    if (!existingTeacher) {
      const hashedTeacherPassword = await bcrypt.hash("teacher123", 10);
      const newTeacher = new User({
        name: "John Teacher",
        email: "teacher@gmail.com",
        password: hashedTeacherPassword,
        role: "teacher",
      });
      await newTeacher.save();
      console.log("✅ Teacher user created successfully!");
      console.log("   Email: teacher@gmail.com");
      console.log("   Password: teacher123");
    } else {
      console.log("ℹ️  Teacher user already exists!");
    }

    // Create Student User
    const existingStudent = await User.findOne({ email: "student@gmail.com" });
    if (!existingStudent) {
      const hashedStudentPassword = await bcrypt.hash("student123", 10);
      const newStudent = new User({
        name: "Alice Student",
        email: "student@gmail.com",
        password: hashedStudentPassword,
        role: "student",
      });
      await newStudent.save();
      console.log("✅ Student user created successfully!");
      console.log("   Email: student@gmail.com");
      console.log("   Password: student123");
    } else {
      console.log("ℹ️  Student user already exists!");
    }

    console.log("\n📋 Login Credentials Summary:");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("ADMIN:");
    console.log("   Email: admin@gmail.com");
    console.log("   Password: admin");
    console.log("\nTEACHER:");
    console.log("   Email: teacher@gmail.com");
    console.log("   Password: teacher");
    console.log("\nSTUDENT:");
    console.log("   Email: student@gmail.com");
    console.log("   Password: student123");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

    process.exit(0);
  } catch (err) {
    console.error("❌ Error creating users:", err);
    process.exit(1);
  }
};

createUsers();
