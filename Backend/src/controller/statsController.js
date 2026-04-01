import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';

export const getStats = async (req, res) => {
    try {
        const stats = {
            totalStudents: await User.countDocuments({ role: 'student' }),
            totalCourses: await Course.countDocuments(),
            totalEnrollments: await Enrollment.countDocuments(),
            totalInstructors: await User.countDocuments({ role: 'instructor' })
        };
        res.json({ success: true, data: stats });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
