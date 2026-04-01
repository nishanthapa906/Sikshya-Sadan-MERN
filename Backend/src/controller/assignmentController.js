import Assignment from '../models/assignmentModel.js';
import Submission from '../models/submissionModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';

// Helper to handle errors instantly
const handle = (fn) => async (req, res) => { try { await fn(req, res); } catch (e) { res.status(500).json({ success: false, message: e.message }); } };

export const getMyAssignments = handle(async (req, res) => {
    const enrollments = await Enrollment.find({ student: req.user.id, paymentStatus: { $in: ['completed', 'installment'] } });
    const assignments = await Assignment.find({ course: { $in: enrollments.map(e => e.course) }, isActive: true })
        .populate('course', 'title category').populate('instructor', 'name').sort({ dueDate: 1 });
    const submissions = await Submission.find({ student: req.user.id });
    const data = assignments.map(a => ({ ...a.toObject(), submission: submissions.find(s => s.assignment.toString() === a._id.toString()) || null }));
    res.json({ success: true, data });
});

export const submitAssignment = handle(async (req, res) => {
    const { assignmentId } = req.params;
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    
    if (!(await Enrollment.exists({ student: req.user.id, course: assignment.course, paymentStatus: { $in: ['completed', 'installment'] } })))
        return res.status(403).json({ success: false, message: 'Not enrolled in this course or payment incomplete' });

    let submission = await Submission.findOne({ assignment: assignmentId, student: req.user.id }) || new Submission({ assignment: assignmentId, student: req.user.id, course: assignment.course });
    
    submission.submissionText = req.body.submissionText || submission.submissionText || '';
    if (req.file) submission.submissionFile = { filename: req.file.filename, url: `/uploads/${req.file.filename}`, uploadedAt: new Date() };
    submission.submittedAt = new Date();
    submission.isLate = submission.submittedAt > assignment.dueDate;
    submission.status = 'submitted';
    
    await submission.save();
    assignment.totalSubmissions = await Submission.countDocuments({ assignment: assignmentId });
    await assignment.save();
    
    res.json({ success: true, message: 'Submitted!', data: submission });
});

export const getMyCertificates = handle(async (req, res) => {
    // Simply fetch the user's completed enrollments that have a certificate.
    const enrollments = await Enrollment.find({ student: req.user.id, certificateIssued: true })
        .populate('course', 'title category instructor');
    const certs = enrollments.map(e => ({
        _id: e._id,
        course: e.course,
        issuedDate: e.certificateIssuedDate,
        certificateImage: e.certificateUrl,
    }));
    res.json({ success: true, data: certs });
});

export const createAssignment = handle(async (req, res) => {
    const { courseId } = req.params;
    if (!(await Course.exists({ _id: courseId, instructor: req.user.id }))) return res.status(403).json({ success: false, message: 'Permission denied' });
    if (new Date(req.body.dueDate) <= new Date()) return res.status(400).json({ success: false, message: 'Due date must be in future' });

    const assignment = new Assignment({ ...req.body, course: courseId, instructor: req.user.id, maxMarks: req.body.maxMarks || 100 });
    if (req.files) assignment.attachments = req.files.map(f => ({ filename: f.filename, url: `/uploads/${f.filename}`, uploadedAt: new Date() }));
    
    await assignment.save();
    res.status(201).json({ success: true, data: await assignment.populate('course', 'title') });
});

export const getCourseAssignments = handle(async (req, res) => {
    if (!(await Course.exists({ _id: req.params.courseId, instructor: req.user.id }))) return res.status(403).json({ success: false, message: 'Permission denied' });
    
    const assignments = await Assignment.find({ course: req.params.courseId }).populate('instructor', 'name').sort({ dueDate: -1 });
    const data = await Promise.all(assignments.map(async a => {
        const total = await Submission.countDocuments({ assignment: a._id });
        const graded = await Submission.countDocuments({ assignment: a._id, status: 'graded' });
        return { ...a.toObject(), stats: { totalSubmissions: total, gradedSubmissions: graded, pendingSubmissions: total - graded } };
    }));
    res.json({ success: true, data });
});

export const getAssignmentSubmissions = handle(async (req, res) => {
    const assignment = await Assignment.findById(req.params.assignmentId);
    if (!assignment) return res.status(404).json({ success: false, message: 'Assignment not found' });
    if (assignment.instructor.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Permission denied' });
    
    res.json({ success: true, data: await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'name email avatar').sort({ submittedAt: -1 }) });
});

export const gradeSubmission = handle(async (req, res) => {
    const { grade, feedback } = req.body;
    if (grade < 0 || grade > 100) return res.status(400).json({ success: false, message: 'Grade must be 0-100' });
    
    const submission = await Submission.findById(req.params.submissionId).populate('assignment');
    if (!submission) return res.status(404).json({ success: false, message: 'Submission not found' });
    if (submission.assignment.instructor.toString() !== req.user.id) return res.status(403).json({ success: false, message: 'Permission denied' });
    
    Object.assign(submission, { grade, feedback: feedback || '', status: 'graded', gradedAt: new Date(), gradedBy: req.user.id });
    await submission.save();
    
    res.json({ success: true, data: submission });
});
