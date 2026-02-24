import mongoose from "mongoose";

const connectDb = async () =>{
    try {
        await mongoose.connect("mongodb://localhost:27017/SIKSHYA_SADAN_DB");
         console.log("Database is connected successfully");
    } catch(error) {

             console.log("Error while connect the database", error);
    }
    
};

export default connectDb;