import mongoose from 'mongoose';

const assignmentSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Assignment title is required'],
            trim: true,
            minlength: [3, 'Title must be at least 3 characters'],
            maxlength: [100, 'Title cannot exceed 100 characters']
        },
        description: {
            type: String,
            required: [true, 'Assignment description is required'],
            minlength: [10, 'Description must be at least 10 characters']
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
            required: [true, 'Course is required']
        },
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Instructor is required']
        },
        dueDate: {
            type: Date,
            required: [true, 'Due date is required'],
            validate: {
                validator: function(v) {
                    return v > new Date();
                },
                message: 'Due date must be in the future'
            }
        },
        maxMarks: {
            type: Number,
            required: [true, 'Maximum marks is required'],
            min: [1, 'Max marks must be at least 1'],
            max: [100, 'Max marks cannot exceed 100'],
            default: 100
        },
        instructions: {
            type: String,
            default: ''
        },
        attachments: [{
            filename: String,
            url: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }],
        totalSubmissions: {
            type: Number,
            default: 0
        },
        isActive: {
            type: Boolean,
            default: true
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
assignmentSchema.index({ course: 1, instructor: 1 });
assignmentSchema.index({ dueDate: 1 });

const Assignment = mongoose.model('Assignment', assignmentSchema);
export default Assignment;
