import express from 'express';
import { getJobs, createJob, updateJob, deleteJob } from '../controller/publicController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Publicly accessible jobs
router.get('/jobs', getJobs);

// Protected routes for admins to manage jobs
router.post('/jobs', protect, authorize('admin'), createJob);
router.put('/jobs/:id', protect, authorize('admin'), updateJob);
router.delete('/jobs/:id', protect, authorize('admin'), deleteJob);

export default router;
