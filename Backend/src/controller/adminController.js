import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
// import Course from '../models/courseModel.js';
// import Enrollment from '../models/enrollmentModel.js';

// Stats
export const getStats = async (req, res) => {
    try {
        const stats = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            totalInstructors: await User.countDocuments({ role: 'instructor' }),
            // totalCourses: await Course.countDocuments(),
            // totalEnrollments: await Enrollment.countDocuments(),
            // totalRevenue: await Enrollment.aggregate([
            //     { $group: { _id: null, total: { $sum: '$paidAmount' } } }
            // ]).then(res => res[0]?.total || 0)
        };
        res.status(200).json({ status: 200, success: true, data: stats });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Users
export const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json({ status: 200, success: true, data: users });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// User Status
export const updateUserStatus = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(403).json({ status: 403, success: false, message: 'You cannot suspend your own account.' });
        }
        await User.findByIdAndUpdate(req.params.id, { isActive: req.body.isActive });
        res.status(200).json({ status: 200, success: true, message: 'Status Modified Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// // Financial Reports
// export const getFinancialReports = async (req, res) => {
//     try {
//         const enrollments = await Enrollment.find().populate('student', 'name').populate('course', 'title');
//         const totalRevenue = enrollments.reduce((acc, curr) => acc + (curr.paidAmount || 0), 0);
//         res.status(200).json({ status: 200, success: true, data: { enrollments, totalRevenue } });
//     } catch (error) {
//         res.status(500).json({ status: 500, success: false, message: error.message });
//     }
// };

// Create User
export const createUser = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'All fields must be filled!'
        });
    }

    try {
        const isExist = await User.findOne({ email });
        if (isExist) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'User already exists!'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({
            ...req.body,
            password: hashedPassword
        });

        res.status(201).json({
            status: 201,
            success: true,
            message: 'User Created & Authorized!',
            user
        });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Update User
export const updateUser = async (req, res) => {
    try {
        const { name, email, role, phone } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ status: 404, success: false, message: 'User not found' });
        }

        // Check if email already taken by someone else
        if (email && email !== user.email) {
            const emailExist = await User.findOne({ email });
            if (emailExist) {
                return res.status(400).json({ status: 400, success: false, message: 'Email already in use' });
            }
        }

        await User.findByIdAndUpdate(req.params.id, { name, email, role, phone });
        res.status(200).json({ status: 200, success: true, message: 'User Updated Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// User Role
export const updateUserRole = async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { role: req.body.role });
        res.status(200).json({ status: 200, success: true, message: 'Role Modified Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Delete User
export const deleteUser = async (req, res) => {
    try {
        if (req.params.id === req.user.id) {
            return res.status(403).json({ status: 403, success: false, message: 'You cannot delete your own account.' });
        }
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ status: 200, success: true, message: 'User Deleted Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// // Payment Status
// export const updateEnrollmentPaymentStatus = async (req, res) => {
//     try {
//         await Enrollment.findByIdAndUpdate(req.params.id, { paymentStatus: req.body.paymentStatus });
//         res.status(200).json({ status: 200, success: true, message: 'Payment Status Updated Successfully!' });
//     } catch (error) {
//         res.status(500).json({ status: 500, success: false, message: error.message });
//     }
// };
