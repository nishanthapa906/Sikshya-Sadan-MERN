import mongoose from "mongoose";
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
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

    phone : {
        type: String, 
        required: true
    }, 

    role: {
        type: String, 
        enum: ['student', 'instructor', 'admin'], 
        default: 'student'
    },

    avatar:{
        type:String, 
        required: true
    }, 

    bio:{
       type:String,
       maxlength: [500, 'Bio cannot be more than 500 characters']
        
    },

    

    expertise:{
        type:String
    } ,

    isActive:{
        type:Boolean, 
        default:true
    }, 

    createdAt: {
        type: Date, 
        default: Date.now
    }
});

// hash pawword before saving 

userSchema.pre('save', async function (next){
    if (!this.isModified('password')){
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

}) ;


//compare password method 

userSchema.methods.comparePassword = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
};


//Generate JWT token 

userSchema.methods.generateToken = function () {
    return jwt.sign(
        {id: this._id, role:this.role},
        "jhgsvuwhefgrwouyfuiuyoihbiuwbhefowubevouybrvuybvowuebfye",
      {
        expiresIn: "5d",
      },
    );
    
    };


const User = mongoose.model("User", userSchema);

export default User;