import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type :String, 
        trim:true, 
        required:true
    },

    email: {
        type: String, 
        trim:true, 
        unique:true, 
        lowercase:true, 
        required:true
    }, 

    password: {
        type:String, 
        trim:true, 
        required:true
    }, 

    image:{
        type:String, 
        required: true
    }, 

    
})


const User = mongoose.model("User", userSchema);

export default User;