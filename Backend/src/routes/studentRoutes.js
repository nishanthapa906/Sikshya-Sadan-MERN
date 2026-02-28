import express from 'express';
const router = express.Router();
import {
    getDashboard,
    getMyCourses,
    getMyAssignments,
    submitAssignment,
    getMyCertificates,
    getMyAttendance,
    claimCertificate,
    isEnrolled
} from '../controller/studentController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// All routes are protected and only for students
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/my-courses', getMyCourses);
router.get('/assignments', getMyAssignments);
router.post('/assignments/:assignmentId/submit', upload.single('file'), submitAssignment);
router.get('/certificates', getMyCertificates);
router.post('/course/:courseId/claim-certificate', claimCertificate);
router.get('/attendance/:courseId', getMyAttendance);
router.get('/is-enrolled/:courseId', isEnrolled);

export default router;
