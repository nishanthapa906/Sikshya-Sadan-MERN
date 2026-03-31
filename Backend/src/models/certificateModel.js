import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema(
    {
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
        certificateNumber: {
            type: String,
            unique: true,
            required: true
        },
        completionDate: {
            type: Date,
            required: [true, 'Completion date is required']
        },
        issuedDate: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['pending', 'issued', 'claimed', 'available'],
            default: 'pending'
        },
        claimStatus: {
            type: String,
            enum: ['not-claimed', 'pending-claim', 'claimed'],
            default: 'not-claimed'
        },
        claimDate: Date,
        finalGrade: {
            type: Number,
            min: 0,
            max: 100
        },
        totalScore: {
            type: Number,
            default: 0
        },
        submissionDetails: {
            totalAssignments: Number,
            completedAssignments: Number,
            assignmentScores: [Number]
        },
        courseDetails: {
            duration: String,
            instructor: String
        },
        remarks: {
            type: String,
            default: null
        },
        isPhysicalClaimed: {
            type: Boolean,
            default: false
        },
        physicalClaimDate: Date,
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

// Generate certificate number before saving
certificateSchema.pre('save', async function(next) {
    if (!this.certificateNumber) {
        const count = await mongoose.model('Certificate').countDocuments({});
        this.certificateNumber = `CERT-${new Date().getFullYear()}-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

// Index for faster queries
certificateSchema.index({ student: 1, course: 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ certificateNumber: 1 });

const Certificate = mongoose.model('Certificate', certificateSchema);
export default Certificate;
