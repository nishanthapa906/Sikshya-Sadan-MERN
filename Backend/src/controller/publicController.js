import Job from '../models/jobModel.js';
import Testimonial from '../models/testimonialModel.js';

export const getSettings = async (req, res) => {
    try {
        // Fallback public settings until DB-backed settings is introduced.
        const settings = {
            address: 'Mid-Baneshwor, Kathmandu, Nepal',
            phone: '+977-1-4400000',
            email: 'hello@sikshyasadan.com'
        };

        res.status(200).json({
            status: 200,
            success: true,
            data: { settings }
        });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const getJobs = async (req, res) => {
    try {
        const { type } = req.query;
        const query = { isActive: true };
        if (type) query.type = type;

        const jobs = await Job.find(query).sort({ createdAt: -1 });
        const types = await Job.distinct('type', { isActive: true });
        res.status(200).json({ status: 200, success: true, data: { jobs, types } });
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
        const job = await Job.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after', runValidators: true });
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

export const getTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find({ isActive: true }).sort({ createdAt: -1 });
        res.status(200).json({ status: 200, success: true, data: testimonials });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const createTestimonial = async (req, res) => {
    try {
        const payload = {
            ...req.body,
            rating: Number(req.body.rating || 5),
            isActive: req.body.isActive === 'false' ? false : true
        };
        if (req.file?.filename) payload.avatar = req.file.filename;
        const testimonial = await Testimonial.create(payload);
        res.status(201).json({ status: 201, success: true, data: testimonial });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const updateTestimonial = async (req, res) => {
    try {
        const updates = {
            ...req.body,
            rating: req.body.rating !== undefined ? Number(req.body.rating) : undefined,
            isActive: req.body.isActive !== undefined ? (req.body.isActive === true || req.body.isActive === 'true') : undefined
        };
        if (req.file?.filename) updates.avatar = req.file.filename;
        Object.keys(updates).forEach((k) => updates[k] === undefined && delete updates[k]);

        const testimonial = await Testimonial.findByIdAndUpdate(
            req.params.id,
            updates,
            { returnDocument: 'after', runValidators: true }
        );
        if (!testimonial) return res.status(404).json({ status: 404, success: false, message: 'Testimonial not found' });
        res.status(200).json({ status: 200, success: true, data: testimonial });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const deleteTestimonial = async (req, res) => {
    try {
        const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
        if (!testimonial) return res.status(404).json({ status: 404, success: false, message: 'Testimonial not found' });
        res.status(200).json({ status: 200, success: true, message: 'Testimonial deleted' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
