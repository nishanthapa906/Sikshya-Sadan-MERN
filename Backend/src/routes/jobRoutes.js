import express from 'express';
import { getJobs, createJob, updateJob, deleteJob } from '../controller/publicController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Publicly accessible jobs
router.get('/', getJobs);

// Protected routes for admins to manage jobs
router.post('/', protect, authorize('admin'), createJob);
router.put('/:id', protect, authorize('admin'), updateJob);
router.delete('/:id', protect, authorize('admin'), deleteJob);

export default router;
