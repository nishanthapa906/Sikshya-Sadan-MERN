import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';

export const getStats = async (req, res) => {
    try {
        const stats = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            totalInstructors: await User.countDocuments({ role: 'instructor' }),
            totalCourses: await Course.countDocuments(),
            totalEnrollments: await Enrollment.countDocuments(),
            totalRevenue: await Enrollment.aggregate([{ $group: { _id: null, total: { $sum: '$paidAmount' } } }]).then(r => r[0]?.total || 0)
        };
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, data: users });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateUserStatus = async (req, res) => {
    try {
        if (req.params.id === req.user.id)
            return res.status(403).json({ success: false, message: 'Cannot suspend own account' });
        await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive });
        res.json({ success: true, message: 'Status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getFinancialReports = async (req, res) => {
    try {
        const enrollments = await Enrollment.find().populate('student', 'name').populate('course', 'title');
        const totalRevenue = enrollments.reduce((acc, e) => acc + (e.paidAmount || 0), 0);
        res.json({ success: true, data: { enrollments, totalRevenue } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createUser = async (req, res) => {
    const { name, email, password, phone } = req.body;
    if (!name || !email || !password || !phone)
        return res.status(400).json({ success: false, message: 'All fields required' });
    try {
        if (await User.findOne({ email }))
            return res.status(400).json({ success: false, message: 'User already exists' });
        const user = await User.create({ ...req.body, password: await bcrypt.hash(password, 10) });
        res.status(201).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateUser = async (req, res) => {
    try {
        const { name, email, role, phone } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (email && email !== user.email && await User.findOne({ email }))
            return res.status(400).json({ success: false, message: 'Email already in use' });
        await User.findByIdAndUpdate(req.params.id, { name, email, role, phone });
        res.json({ success: true, message: 'User updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateUserRole = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
        res.json({ success: true, message: 'Role updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id)
            return res.status(403).json({ success: false, message: 'Cannot delete own account' });
        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateEnrollmentPaymentStatus = async (req, res) => {
    try {
        await Enrollment.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus });
        res.json({ success: true, message: 'Payment status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
