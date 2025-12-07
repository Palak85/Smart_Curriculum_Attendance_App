// import User from './models/User.js'
// import bcrypt from 'bcrypt'
// import connectToDatabase from './db/db.js'

// const userRegister = async () =>{
//     connectToDatabase()
//     try{
//         const hashPassword = await bcrypt.hash("admin",10)
//         const newUser = new User({
//             name: "Admin",
//             email: "admin@gmail.com",
//             password: hashPassword,
//             role: "admin"
//         })
//         await newUser.save()
//     }
//     catch(error){
//         console.log(error)
//     }
// }

// userRegister();




// server/userSeed.js
import bcrypt from "bcrypt";
import User from "./models/User.js";
import connectToDatabase from "./db/db.js";

const createAdminUser = async () => {
  await connectToDatabase();

  try {
    const existingAdmin = await User.findOne({ email: "admin@gmail.com" });

    if (existingAdmin) {
      console.log("Admin user already exists!");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin", 10);

    const newAdmin = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
    });

    await newAdmin.save();
    console.log("Admin user created successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Error creating admin user:", err);
    process.exit(1);
  }
};

createAdminUser();
