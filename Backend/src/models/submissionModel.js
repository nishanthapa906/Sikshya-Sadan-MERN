import mongoose from 'mongoose';

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Assignment',
            required: [true, 'Assignment is required']
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Student is required']
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required']
        },
        submissionText: {
            type: String,
            default: ''
        },
        submissionFile: {
            filename: String,
            url: String,
            uploadedAt: Date
        },
        submittedAt: {
            type: Date,
            default: Date.now
        },
        isLate: {
            type: Boolean,
            default: false
        },
        grade: {
            type: Number,
            min: 0,
            max: 100,
            default: null
        },
        feedback: {
            type: String,
            default: ''
        },
        gradedAt: Date,
        gradedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            enum: ['submitted', 'graded', 'pending'],
            default: 'pending'
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        }
    },
    { timestamps: true }
);

// Index for faster queries
submissionSchema.index({ assignment: 1, student: 1 });
submissionSchema.index({ course: 1, student: 1 });

const Submission = mongoose.model('Submission', submissionSchema);
export default Submission;
