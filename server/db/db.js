import mongoose from "mongoose";

const connectToDatabase = async () => {
  const MONGO_URI = process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/sms";
  try {
    console.log("Connecting to MongoDB...", MONGO_URI.startsWith("mongodb://127.0.0.1") ? "(local)" : "(remote)");
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connected successfully!");
  } catch (err) {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  }
};

export default connectToDatabase;
