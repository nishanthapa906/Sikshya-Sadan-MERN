import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';
import Assignment from '../models/assignmentModel.js';
import Submission from '../models/submissionModel.js';

export const getDashboard = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id, paymentStatus: { $in: ['completed', 'installment'] } }).populate('course');
        const courseIds = enrollments.map(e => e.course._id);
        const assignments = await Assignment.find({ course: { $in: courseIds } });
        const submissions = await Submission.find({ student: req.user.id });
        let pendingCount = 0;
        assignments.forEach(a => { if (!submissions.find(s => s.assignment.toString() === a._id.toString())) pendingCount++; });
        res.json({
            success: true, data: {
                enrollments,
                totalCourses: enrollments.length,
                activeCourses: enrollments.filter(e => e.status === 'active').length,
                completedCourses: enrollments.filter(e => e.status === 'completed').length,
                pendingAssignments: pendingCount
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id, paymentStatus: { $in: ['completed', 'installment'] } })
            .populate('course', 'title category thumbnail instructor').populate('student', 'name email avatar');
        res.json({ success: true, enrollments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const isEnrolled = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId, paymentStatus: { $in: ['completed', 'installment'] } });
        res.json({ success: true, enrolled: !!enrollment, enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId, paymentStatus: { $in: ['completed', 'installment'] } });
        if (!enrollment) return res.status(404).json({ success: false, message: 'Not enrolled in this course' });
        const list = (enrollment.attendance || []).sort((a, b) => new Date(b.date) - new Date(a.date));
        const summary = { present: 0, late: 0, absent: 0, total: list.length };
        list.forEach(r => { summary[r.status] = (summary[r.status] || 0) + 1; });
        res.json({ success: true, data: list, summary });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
