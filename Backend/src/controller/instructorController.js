import Course from '../models/courseModel.js';
import Assignment from '../models/assignmentModel.js';
import Submission from '../models/submissionModel.js';
import Certificate from '../models/certificateModel.js';
import Enrollment from '../models/enrollmentModel.js';

export const getDashboard = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        const totalStudents = await Enrollment.countDocuments({ course: { $in: courses.map(c => c._id) } });
        res.json({ success: true, data: { totalCourses: courses.length, totalStudents, courses } });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        res.json({ success: true, courses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyStudents = async (req, res) => {
    try {
        const myCourses = await Course.find({ instructor: req.user.id }).select('_id');
        const ids = myCourses.map(c => c._id);
        let query;
        if (req.params.courseId) {
            if (!ids.some(id => id.toString() === req.params.courseId))
                return res.status(403).json({ success: false, message: 'Access denied' });
            query = { course: req.params.courseId };
        } else {
            query = { course: { $in: ids } };
        }
        const enrollments = await Enrollment.find(query).populate('student', 'name email phone avatar lastActive').populate('course', 'title');
        res.json({ success: true, enrollments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createAssignment = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        req.body.course = req.params.courseId;
        if (req.files?.length > 0)
            req.body.attachments = req.files.map(f => ({ filename: f.originalname, url: `/uploads/${f.filename}` }));
        const assignment = await Assignment.create(req.body);
        res.status(201).json({ success: true, assignment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCourseAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.json({ success: true, assignments });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, feedback } = req.body;
        const assignment = await Assignment.findOne({ "submissions._id": submissionId });
        const sub = assignment.submissions.id(submissionId);
        sub.marksObtained = marks;
        sub.feedback = feedback;
        sub.status = 'graded';
        sub.gradedBy = req.user.id;
        sub.gradedAt = new Date();
        await assignment.save();
        res.json({ success: true, message: 'Graded!' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const uploadResource = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        course.resources.push({ title: req.body.title, description: req.body.description, type: req.body.type, fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.url });
        await course.save();
        res.json({ success: true, course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteResource = async (req, res) => {
    try {
        const course = await Course.findOne({ "resources._id": req.params.resourceId });
        course.resources.pull(req.params.resourceId);
        await course.save();
        res.json({ success: true, message: 'Resource deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const markAttendance = async (req, res) => {
    try {
        const toDateStr = (v = new Date()) => { const d = new Date(v); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`; };
        const enrollment = await Enrollment.findById(req.params.enrollmentId);
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        if (!['present', 'late', 'absent'].includes(req.body.status))
            return res.status(400).json({ success: false, message: 'Invalid status' });
        const targetStr = req.body.date || toDateStr();
        if (targetStr > toDateStr()) return res.status(400).json({ success: false, message: 'Cannot mark future attendance' });
        const existing = enrollment.attendance.find(a => toDateStr(a.date) === targetStr);
        if (existing) {
            existing.status = req.body.status;
            await enrollment.save();
            return res.json({ success: true, message: `Updated to ${req.body.status}`, updated: true });
        }
        enrollment.attendance.push({ date: new Date(targetStr + 'T12:00:00Z'), status: req.body.status });
        await enrollment.save();
        res.json({ success: true, message: 'Attendance marked', updated: false });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCourseResources = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        res.json({ success: true, resources: course.resources });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateEnrollment = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.id).populate('course', 'instructor title');
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        if (enrollment.course?.instructor?.toString() !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: 'Access denied' });
        const data = { ...req.body };
        if (data.status === 'completed') {
            if (!['completed', 'installment'].includes(enrollment.paymentStatus))
                return res.status(400).json({ success: false, message: 'Payment must be completed first' });
            data.completionDate = new Date();
        }
        const updated = await Enrollment.findByIdAndUpdate(req.params.id, data, { new: true });
        res.json({ success: true, enrollment: updated });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const uploadCertificate = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('student', 'name').populate('course', 'title duration instructor');
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        if (enrollment.course?.instructor?.toString() !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: 'Access denied' });
        if (enrollment.status !== 'completed') return res.status(400).json({ success: false, message: 'Mark student completed first' });
        if (!req.file) return res.status(400).json({ success: false, message: 'Certificate image required' });

        const submissions = await Submission.find({ student: enrollment.student._id, course: enrollment.course._id });
        const graded = submissions.filter(s => s.grade != null);
        const finalGrade = graded.length > 0 ? Math.round(graded.reduce((sum, s) => sum + s.grade, 0) / graded.length) : 0;

        let cert = await Certificate.findOne({ student: enrollment.student._id, course: enrollment.course._id });
        if (!cert) cert = new Certificate({ student: enrollment.student._id, course: enrollment.course._id, completionDate: enrollment.completionDate || new Date(), issuedDate: new Date() });

        cert.status = 'issued';
        cert.claimStatus = cert.claimStatus || 'not-claimed';
        cert.certificateImage = req.file.filename;
        cert.issuedBy = req.user.id;
        cert.finalGrade = finalGrade;
        cert.completionDate = enrollment.completionDate || new Date();
        cert.issuedDate = new Date();
        await cert.save();

        enrollment.certificateIssued = true;
        enrollment.certificateId = cert.certificateNumber;
        enrollment.certificateIssuedDate = cert.issuedDate;
        enrollment.certificateUrl = cert.certificateImage;
        await enrollment.save();
        res.json({ success: true, data: cert });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getAssignmentSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId).populate('submissions.student', 'name email avatar');
        res.json({ success: true, submissions: assignment.submissions });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
