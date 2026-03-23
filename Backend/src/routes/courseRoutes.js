import express from 'express';
import { addReview, createCourse, deleteCourse, getAllCourses, getCourseById, getInstructorCourses, updateCourse } from '../controller/courseController.js';
import { protect } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

//public routes
router.get('/', getAllCourses);
router.get('/:id', getCourseById);

//protected routes
router.post('/:id/review', protect, addReview);
router.get('/instructor/my-courses', protect, getInstructorCourses);

const courseUpload = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'syllabusFile', maxCount: 1 }
]);

router.post('/' , protect, courseUpload, createCourse);
router.put('/:id', protect, courseUpload, updateCourse);
router.delete('/:id', protect, deleteCourse);

export default router; 
