import express from 'express';
const router = express.Router();
import {
    getMyAssignments,
    submitAssignment,
    getMyCertificates,
    claimCertificate,
    createAssignment,
    getCourseAssignments,
    getAssignmentSubmissions,
    gradeSubmission
} from '../controller/assignmentController.js';
import { protect, authorize } from '../middleware/auth.js';
import { assignmentValidation, validate } from '../middleware/validation.js';
import upload from '../middleware/upload.js';

// Student routes (protected)
router.get('/student/assignments', protect, authorize('student'), getMyAssignments);
router.post('/student/assignments/:assignmentId/submit', protect, authorize('student'), upload.single('file'), submitAssignment);
router.get('/student/certificates', protect, authorize('student'), getMyCertificates);
router.post('/student/:courseId/claim-certificate', protect, authorize('student'), claimCertificate);

// Instructor routes (protected)
router.post('/instructor/courses/:courseId/assignments', protect, authorize('instructor', 'admin'), upload.array('attachments', 5), assignmentValidation, validate, createAssignment);
router.get('/instructor/courses/:courseId/assignments', protect, authorize('instructor', 'admin'), getCourseAssignments);
router.get('/instructor/assignments/:assignmentId/submissions', protect, authorize('instructor', 'admin'), getAssignmentSubmissions);
router.put('/instructor/submissions/:submissionId/grade', protect, authorize('instructor', 'admin'), gradeSubmission);

export default router;
