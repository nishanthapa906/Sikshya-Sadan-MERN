import Assignment from '../models/assignmentModel.js';
import Submission from '../models/submissionModel.js';
import Certificate from '../models/certificateModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';

export const getMyAssignments = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({ student: req.user.id, paymentStatus: { $in: ['completed', 'installment'] } });
        const courseIds = enrollments.map(e => e.course);
        const assignments = await Assignment.find({ course: { $in: courseIds }, isActive: true })
            .populate('course', 'title category').populate('instructor', 'name').sort({ dueDate: 1 });
        const submissions = await Submission.find({ student: req.user.id });
        const data = assignments.map(a => ({
            ...a.toObject(),
            submission: submissions.find(s => s.assignment.toString() === a._id.toString()) || null
        }));
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
        const enrollment = await Enrollment.findOne({ student: req.user.id, course: assignment.course, paymentStatus: { $in: ['completed', 'installment'] } });
        if (!enrollment) return res.status(403).json({ success: false, message: 'Not enrolled in this course' });

        let submission = await Submission.findOne({ assignment: assignmentId, student: req.user.id });
        const submittedAt = new Date();
        const isLate = submittedAt > assignment.dueDate;
        const fileData = req.file ? { filename: req.file.filename, url: `/uploads/${req.file.filename}`, uploadedAt: new Date() } : null;

        if (submission) {
            submission.submissionText = req.body.submissionText || submission.submissionText;
            if (fileData) submission.submissionFile = fileData;
            submission.submittedAt = submittedAt;
            submission.isLate = isLate;
            submission.status = 'submitted';
        } else {
            submission = new Submission({ assignment: assignmentId, student: req.user.id, course: assignment.course, submissionText: req.body.submissionText || '', submissionFile: fileData, submittedAt, isLate, status: 'submitted' });
        }
        await submission.save();
        assignment.totalSubmissions = await Submission.countDocuments({ assignment: assignmentId });
        await assignment.save();
        res.json({ success: true, message: 'Submitted!', data: submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyCertificates = async (req, res) => {
    try {
        const certs = await Certificate.find({ student: req.user.id })
            .populate('student', 'name email avatar').populate('course', 'title category instructor').sort({ issuedDate: -1 });
        res.json({ success: true, data: certs });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const claimCertificate = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId, status: 'completed' });
        if (!enrollment) return res.status(404).json({ success: false, message: 'Course not completed yet' });
        if (!['completed', 'installment'].includes(enrollment.paymentStatus))
            return res.status(400).json({ success: false, message: 'Payment must be completed first' });

        const cert = await Certificate.findOne({ student: req.user.id, course: req.params.courseId });
        if (!cert?.certificateImage) return res.status(400).json({ success: false, message: 'Certificate not issued yet' });
        if (cert.claimStatus === 'claimed') return res.status(400).json({ success: false, message: 'Already claimed' });

        cert.claimStatus = 'pending-claim';
        cert.claimDate = new Date();
        await cert.save();
        res.json({ success: true, message: 'Claim submitted. Visit office.', data: cert });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createAssignment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description, dueDate, maxMarks, instructions } = req.body;
        const course = await Course.findOne({ _id: courseId, instructor: req.user.id });
        if (!course) return res.status(403).json({ success: false, message: 'Permission denied' });
        if (new Date(dueDate) <= new Date()) return res.status(400).json({ success: false, message: 'Due date must be in future' });

        const assignment = new Assignment({ course: courseId, instructor: req.user.id, title, description, dueDate, maxMarks: maxMarks || 100, instructions: instructions || '' });
        if (req.files?.length > 0)
            assignment.attachments = req.files.map(f => ({ filename: f.filename, url: `/uploads/${f.filename}`, uploadedAt: new Date() }));
        await assignment.save();
        await assignment.populate('course', 'title');
        res.status(201).json({ success: true, data: assignment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCourseAssignments = async (req, res) => {
    try {
        const course = await Course.findOne({ _id: req.params.courseId, instructor: req.user.id });
        if (!course) return res.status(403).json({ success: false, message: 'Permission denied' });
        const assignments = await Assignment.find({ course: req.params.courseId }).populate('instructor', 'name').sort({ dueDate: -1 });
        const data = await Promise.all(assignments.map(async a => {
            const total = await Submission.countDocuments({ assignment: a._id });
            const graded = await Submission.countDocuments({ assignment: a._id, status: 'graded' });
            return { ...a.toObject(), stats: { totalSubmissions: total, gradedSubmissions: graded, pendingSubmissions: total - graded } };
        }));
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAssignmentSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId).populate('instructor');
        if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
        if (assignment.instructor._id.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Permission denied' });
        const submissions = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'name email avatar').sort({ submittedAt: -1 });
        res.json({ success: true, data: submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const gradeSubmission = async (req, res) => {
    try {
        const { grade, feedback } = req.body;
        if (grade < 0 || grade > 100) return res.status(400).json({ success: false, message: 'Grade must be 0-100' });
        const submission = await Submission.findById(req.params.submissionId).populate('assignment').populate('student', 'name email');
        if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
        if (submission.assignment.instructor.toString() !== req.user.id)
            return res.status(403).json({ success: false, message: 'Permission denied' });
        submission.grade = grade;
        submission.feedback = feedback || '';
        submission.status = 'graded';
        submission.gradedAt = new Date();
        submission.gradedBy = req.user.id;
        await submission.save();
        res.json({ success: true, data: submission });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
