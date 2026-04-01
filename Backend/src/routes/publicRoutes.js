import express from 'express';
import {
    getJobs,
    createJob,
    updateJob,
    deleteJob,
    getSettings,
    getTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
    setupAdmin
} from '../controller/publicController.js';

import { getPublicInstructors } from '../controller/authController.js';
import { protect, authorize } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Publicly accessible jobs
router.get('/jobs', getJobs);
router.get('/settings', getSettings);
router.get('/testimonials', getTestimonials);
router.get('/instructors', getPublicInstructors);
router.get('/setup-admin', setupAdmin);


// Protected routes for admins to manage jobs
router.post('/jobs', protect, authorize('admin'), createJob);
router.put('/jobs/:id', protect, authorize('admin'), updateJob);
router.delete('/jobs/:id', protect, authorize('admin'), deleteJob);
router.post('/testimonials', protect, authorize('admin'), upload.single('avatar'), createTestimonial);
router.put('/testimonials/:id', protect, authorize('admin'), upload.single('avatar'), updateTestimonial);
router.delete('/testimonials/:id', protect, authorize('admin'), deleteTestimonial);

export default router;
