import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/constants.js";

const connectDb = async () => {
    try {
        if (mongoose.connection.readyState >= 1) return;
        console.log("Connecting to MongoDB...");
        await mongoose.connect(MONGODB_URI);
        console.log("DB Connected");
    } catch (err) {
        console.error("DB Error:", err.message);
    }
};

export default connectDb;