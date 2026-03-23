import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    title:{
        type: String, 
        required: true, 
    }, 
    description:{
        type: String, 
        required: true,
    },

    category:{
        type:String, 
        required:true,
        enum: ['Programming', 'Web Development', 'Data Science', 'Graphic Design', 'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'Other']
    }, 
   skillLevel: {
    type: String, 
    required: true, 
    enum: ['Beginner', 'Intermediate', 'Advanced']
   },

   duration:{
    type: Number, 
    required: true, 

   }, 

   fee: {
    type: Number, 
    required: true,
   }, 

   installmentAvilable:{
    type: Boolean, 
    default: false, 
   },
    installmentPlans:[{
        numberOfInstallments : Number, 
        amoutperInstallment: Number
    }], 
    instructor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true, 
    }, 
    syllabus:[{
        week: Number, 
        topic: String, 
        description: String,
    }],

    prerequisites: [{
        type: String
    }],

    thumbail:{
        type: String, 
        default : 'defautl-course.jpg'
    }, 

    syallbusFile:{
        type:String
    },

    resources: [{
        title: String, 
        description: String, 
        type:{
            type: String, 
            enum:['video', 'document', 'link ']
        },
        url: String, 
        fileUrl: String, 
        fileSize: Number, 
        uplaodedAt:{
            type: Date, 
            default:  Date.now
        }
    }], 
     
    maxStudents:
    {
        type: Number, 
        default: 30
    }, 
    enrolledStudents: {
        type: Number, 
        default: 0 
    }, 
    rating: {
        type: Number, 
        default : 0 , 

    }, 

    reviews: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        rating: Number, 
        comment: String, 
        createdAt: {
            type: Date, 
            default: Date.now
        }

    }], 

    isActive:{
        type: Boolean, 
        default: true
    }, 

    startDate: {
        type: Date, 
        required: true, 
    }, 

    endDate: {
        type: Date 

    },
    createdAt: {
        type: Date, 
        default: Date.now

    }




});

const Course = mongoose.model('Course', courseSchema);
export default Course;