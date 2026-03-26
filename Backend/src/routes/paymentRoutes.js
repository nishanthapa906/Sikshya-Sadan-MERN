import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { getPaymentStatus, initiateEsewaPayment, verifyEsewaPayment } from '../controller/paymentController.js';
const router = express.Router();


// eSewa verify is a browser redirect callback - no auth header possible
router.get('/esewa/verify', verifyEsewaPayment);

// All other payment routes require authentication
router.post('/esewa/initiate', protect, authorize('student'), initiateEsewaPayment);// Get payment status
router.get('/status/:enrollmentId', protect, getPaymentStatus);

export default router;