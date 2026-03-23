import express from 'express';
const router = express.Router();

import { protect } from '../middleware/auth.js';
import { createEnrollement, getEnrollmentDetails, getMyEnrollments, isEnrolled, updateProgress } from '../controller/enrollmentController.js';

router.use(protect);

router.post('/', createEnrollement);
router.get('/my-enrollments', getMyEnrollments);
router.get('/:enrollmentId', getEnrollmentDetails);
router.put('/:enrollmentId/progress', updateProgress);

router.get('/is-enrolled/:courseId', isEnrolled);

export default router;