import User from '../models/userModel.js';
import Course from '../models/courseModel.js';
import Enrollment from '../models/enrollmentModel.js';

export const getStats = async (req, res) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'student' });
        const totalCourses = await Course.countDocuments();
        const totalEnrollments = await Enrollment.countDocuments();

        const stats = {
            totalStudents,
            totalCourses,
            totalEnrollments,
            totalInstructors: await User.countDocuments({ role: 'instructor' }),
            placementPercentage: 90,
            yearsOfExperience: "5+"
        };

        res.status(200).json({ status: 200, success: true, data: stats });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
