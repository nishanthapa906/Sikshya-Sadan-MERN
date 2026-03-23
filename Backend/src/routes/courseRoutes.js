import express from 'express';
const router = express.Router();
import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    addReview,
    getInstructorCourses
} from '../controller/courseController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

// Public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

// Protected routes
router.post('/:id/review', protect, addReview);
router.get('/instructor/my-courses', protect, getInstructorCourses);

const courseUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'syllabusFile', maxCount: 1 }
]);

router.post('/', protect, courseUpload, createCourse);

router.put('/:id', protect, courseUpload, updateCourse);
router.delete('/:id', protect, deleteCourse);

export default router;
