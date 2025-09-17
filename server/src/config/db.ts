import mongoose from 'mongoose';


const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDb Connection error:", error);
    process.exit(1); // stop the server if db fails
  }
};

export default connectDB;