import mongoose from "mongoose";

const assignmentSchema = mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    totalMarks: {
        type: Number,
        default: 100
    },
    submission: [{
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        fileUrl: String,
        marks: Number,
        feedback: String,
        isSubmitted: {
            type: Boolean,
            default: false
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Instructor who created the assignment
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

export default Assignment;
