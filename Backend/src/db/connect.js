import mongoose from "mongoose";
const connectDb = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/SIKSHYA-sadan-db");
    console.log("Database is Connected Successfully!");
  } catch (error) {
    console.log("Error while connecting database", error);
  }
};
export default connectDb;