import Job from '../models/jobModel.js';

export const getJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ status: 200, success: true, data: jobs });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ status: 201, success: true, data: job });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ status: 404, success: false, message: 'Job not found' });
        res.status(200).json({ status: 200, success: true, data: job });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ status: 404, success: false, message: 'Job not found' });
        res.status(200).json({ status: 200, success: true, message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
