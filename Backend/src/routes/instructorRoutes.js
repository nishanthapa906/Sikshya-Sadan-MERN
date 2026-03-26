import express from 'express';
const router = express.Router();
import {
    getDashboard,
    getMyCourses,
    getMyStudents,
    createAssignment,
    getCourseAssignments,
    getAssignmentSubmissions,
    gradeSubmission,
    uploadResource,
    getCourseResources,
    deleteResource,
    markAttendance,
    updateEnrollment
} from '../controller/instructorController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// All routes are protected
router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/courses', getMyCourses);
router.get('/students', getMyStudents);
router.get('/students/:courseId', getMyStudents);
router.post('/courses/:courseId/assignments', upload.array('attachments', 5), createAssignment);
router.get('/courses/:courseId/assignments', getCourseAssignments);
router.get('/assignments/:assignmentId/submissions', getAssignmentSubmissions);
router.put('/submissions/:submissionId/grade', gradeSubmission);
router.post('/courses/:courseId/resources', upload.single('file'), uploadResource);
router.get('/courses/:courseId/resources', getCourseResources);
router.delete('/resources/:resourceId', deleteResource);
router.post('/enrollments/:enrollmentId/attendance', markAttendance);
router.put('/enrollments/:id', updateEnrollment);

export default router;
