import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";

export const createEnrollement = async (req, res) => {
    const { courseId, paymentMethod, transactionId } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        const enrollment = await Enrollment.create({
            student: req.user.id, course: courseId,
            totalAmount: course.fee, paidAmount: course.fee,
            paymentMethod: paymentMethod || 'manual',
            paymentStatus: 'completed',
            transactionId: transactionId || `TXN-${Date.now()}`
        });
        res.status(201).json({ success: true, enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyEnrollments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id, paymentStatus: { $in: ['completed', 'installment'] } }).populate('course');
        res.json({ success: true, enrollments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getEnrollmentDetails = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course').populate('student', 'name email');
        res.json({ success: true, enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateProgress = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(req.params.enrollmentId, { progress: req.body.progress }, { new: true });
        res.json({ success: true, enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const isEnrolled = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId });
        res.json({ success: true, enrolled: !!enrollment, enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
