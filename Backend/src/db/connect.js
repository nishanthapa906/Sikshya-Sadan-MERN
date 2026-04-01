import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/constants.js";

let cachedConnection = null;

const connectDb = async () => {
    // If already connected, return
    if (mongoose.connection.readyState === 1) {
        return mongoose.connection;
    }

    // If connection is in progress, wait for it
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI is not defined in environment variables!");
        }

        // Mask URI for logging
        const maskedUri = MONGODB_URI.substring(0, 20) + "..." + MONGODB_URI.substring(MONGODB_URI.length - 10);
        console.log(`Connecting to database... (URI: ${maskedUri})`);

        cachedConnection = mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of 30
        });

        await cachedConnection;
        console.log("Database is Connected Successfully!");
        return mongoose.connection;
    } catch (error) {
        cachedConnection = null;
        console.error("Error while connecting database:", error.message);
        throw error; // Rethrow so the middleware can handle it
    }
};

export default connectDb;