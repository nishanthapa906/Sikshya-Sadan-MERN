import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: { type: String, enum: ['Full-time', 'Part-time', 'Internship', 'Contract'], required: true },
    description: { type: String, required: true },
    requirements: [{ type: String }],
    salary: { type: String },
    applyLink: { type: String, required: true },
    deadline: { type: Date },
    isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Job = mongoose.model('Job', jobSchema);
export default Job;
