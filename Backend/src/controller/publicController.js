import Job from '../models/jobModel.js';
import Testimonial from '../models/testimonialModel.js';

export const getSettings = async (req, res) => {
    res.json({ success: true, data: { settings: { address: 'Mid-Baneshwor, Kathmandu', phone: '+977-1-4400000', email: 'hello@sikshyasadan.com' } } });
};

export const getJobs = async (req, res) => {
    try {
        const query = { isActive: true };
        if (req.query.type) query.type = req.query.type;
        const jobs = await Job.find(query).sort({ createdAt: -1 });
        const types = await Job.distinct('type', { isActive: true });
        res.json({ success: true, data: { jobs, types } });
    } catch (err) {
        console.error("GET JOBS ERROR:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createJob = async (req, res) => {
    try {
        const job = await Job.create(req.body);
        res.status(201).json({ success: true, data: job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, data: job });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteJob = async (req, res) => {
    try {
        const job = await Job.findByIdAndDelete(req.params.id);
        if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
        res.json({ success: true, message: 'Job deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getTestimonials = async (req, res) => {
    try {
        const data = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
        res.json({ success: true, data });
    } catch (err) {
        console.error("GET TESTIMONIALS ERROR:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const payload = { ...req.body, rating: Number(req.body.rating || 5), isActive: req.body.isActive !== 'false' };
        if (req.file?.filename) payload.avatar = req.file.filename;
        const t = await Testimonial.create(payload);
        res.status(201).json({ success: true, data: t });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (req.body.rating !== undefined) updates.rating = Number(req.body.rating);
        if (req.body.isActive !== undefined) updates.isActive = req.body.isActive === true || req.body.isActive === 'true';
        if (req.file?.filename) updates.avatar = req.file.filename;
        const t = await Testimonial.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
        if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found' });
        res.json({ success: true, data: t });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const t = await Testimonial.findByIdAndDelete(req.params.id);
        if (!t) return res.status(404).json({ success: false, message: 'Testimonial not found' });
        res.json({ success: true, message: 'Deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const setupAdmin = async (req, res) => {
    try {
        const User = (await import('../models/userModel.js')).default;
        const bcrypt = (await import('bcryptjs')).default;
        
        // Already exists?
        const count = await User.countDocuments({ role: 'admin' });
        if (count > 0) return res.status(400).json({ success: false, message: 'Admin setup already complete' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('adminpassword123', salt);

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@sikshyasadan.com',
            password: hashedPassword,
            phone: '9800000000',
            role: 'admin',
            isActive: true
        });

        res.status(201).json({ success: true, message: 'Admin user created successfully', data: { email: admin.email, password: 'adminpassword123' } });
    } catch (err) {
        console.error("SETUP ERROR:", err.message);
        res.status(500).json({ success: false, message: err.message });
    }
};
