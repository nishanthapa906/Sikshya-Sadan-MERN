import express from 'express'
import {
  getDashboard,
  getMyCourses,
  getMyAssignments,
  submitAssignment,
  getMyCertificates,
  getMyAttendance,
  claimCertificate
} from '../controller/studentController.js';

const router = express.Router();

router.get('/dashboard', getDashboard);

export default router;