import mongoose from "mongoose";
import { MONGODB_URI } from "../utils/constants.js";

const connectDb = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Database is Connected Successfully!");
  } catch (error) {
    console.log("Error while connecting database", error);
  }
};
export default connectDb;