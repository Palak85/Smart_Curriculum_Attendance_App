// import mongoose from "mongoose";

// const connectToDatabase = async () => {
//     try{
//         await mongoose.connect(process.env.MONGODB_URL)
//     }
//     catch(error){
//         console.log(error)
//     }
// } 

// export default connectToDatabase




// server/db/db.js
// import mongoose from "mongoose";

// const MONGO_URI = "mongodb://127.0.0.1:27017/sms"; // Replace with your MongoDB URI

// const connectToDatabase = async () => {
//   try {
//     console.log("Connecting to MongoDB...");
//     await mongoose.connect(MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log("MongoDB connected successfully!");
//   } catch (err) {
//     console.error("MongoDB connection error:", err);
//     process.exit(1); // Stop script if connection fails
//   }
// };

// export default connectToDatabase;

// server/db/db.js
import mongoose from "mongoose";

const MONGO_URI = "mongodb://127.0.0.1:27017/sms"; // your DB

const connectToDatabase = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);  // ❗ NO OPTIONS HERE
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectToDatabase;
