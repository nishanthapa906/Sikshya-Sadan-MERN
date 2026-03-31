import mongoose from 'mongoose';
const enrollmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    }, 

    course:{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true, 

    }, 

    enrollmentDate: {
        type: Date, 
        default: Date.now
    },
    paymentStatus:{
        type: String, 
        enum: ['pending' , 'completed', 'installment', 'failed'],
        default: 'pending'

    },
    paymentMethod:{
        type: String, 
        enum: ['esewa', 'khalti', 'stripe', 'paypal', 'cash']
    },
    totalAmount:{
        type: Number, 
        required: true
    }, 
    paidAmount:{
        type: Number, 
        default: 0
    },

    remainingAmount:{
        type:Number, 
        default: 0
    },

    installments: [{
        amount: Number, 
        dueDate: Date, 
        paidDate: Date, 
        status: {
            type: String, 
            enum: ['pending', 'paid', 'overdue'],
            default: 'pending'
        },
        transactionId: String
    }],
    transactionId: {
        type: String
    },
    invoiceNumber: {
        type: String,
        unique: true
    },
    progress: {
        type: Number,
        default: 0
    },
    attendance: [{
        date: Date,
        status: {
            type: String,
            enum: ['present', 'absent', 'late'],
            default: 'present'
        }
    }],
    completedLessons: [{
        type: String
    }],
    certificateIssued: {
        type: Boolean,
        default: false
    },
    certificateId: {
        type: String
    },
    certificateIssuedDate: {
        type: Date
    },
    certificateUrl: {
        type: String
    },
    completionDate: {
        type: Date
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'dropped', 'suspended'],
        default: 'active'
    }
});

const Enrollment = mongoose.model('Enrollement', enrollmentSchema);
export default Enrollment;