import mongoose from "mongoose";

const enrollmentSchema = mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'paused'],
        default: 'active'
    },
    paymetStatus: {
        type: String,
        enum: ['pending', 'completed', 'installment', 'failed'],
        default: 'pending'
    },
    paymentAmount: {
        type: Number,
        required: true
    },
    progress: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    completedLessons: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lesson'
    }],
    enrolledAt: {
        type: Date,
        default: Date.now
    },
    completedAt: {
        type: Date
    }
});

const Enrollment = mongoose.model("Enrollment", enrollmentSchema);

export default Enrollment;
