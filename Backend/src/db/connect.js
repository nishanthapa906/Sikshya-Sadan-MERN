import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/constants.js";

const connectDb = async () => {
    if (mongoose.connection.readyState === 1) {
        return;
    }

    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables!");
        }

        if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
            console.warn("WARNING: You are trying to connect to a LOCAL database from Vercel. This will fail. Please update your environment variables in the Vercel Dashboard to use a cloud database (like MongoDB Atlas).");
        }

        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("Database is Connected Successfully!");
    } catch (error) {
        console.error("Database Connection Error:", error.message);
        throw error;
    }
};

export default connectDb;