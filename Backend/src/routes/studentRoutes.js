import express from 'express';
const router = express.Router();
import {
    getDashboard,
    getMyCourses,
    isEnrolled
} from '../controller/studentController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes are protected and only for students
router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/my-courses', getMyCourses);
router.get('/is-enrolled/:courseId', isEnrolled);

export default router;
