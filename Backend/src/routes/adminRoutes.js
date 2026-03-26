import express from 'express';
const router = express.Router();
import {
    getStats,
    getAllUsers,
    updateUserStatus,
    getFinancialReports,
    createUser,
    updateUser,
    updateUserRole,
    updateEnrollmentPaymentStatus
} from '../controller/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

// All routes are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.put('/users/:id/status', updateUserStatus);
router.get('/financial-reports', getFinancialReports);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/role', updateUserRole);
router.put('/enrollments/:id/status', updateEnrollmentPaymentStatus);

export default router;
