import express from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { 
    getPaymentStatus, 
    initiateEsewaPayment, 
    verifyEsewaPayment, 
    initiateKhaltiPayment, 
    verifyKhaltiPayment,
    createStripeSession,
    verifyStripePayment
} from '../controller/paymentController.js';
const router = express.Router();

// eSewa verify is a browser redirect callback - no auth header possible
router.get('/esewa/verify', verifyEsewaPayment);

// All other payment routes require authentication
router.post('/esewa/initiate', protect, authorize('student'), initiateEsewaPayment);
router.post('/khalti/initiate', protect, authorize('student'), initiateKhaltiPayment);
router.post('/khalti/verify', protect, authorize('student'), verifyKhaltiPayment);

// Stripe test endpoints
router.post('/stripe/create-session', protect, authorize('student'), createStripeSession);
router.post('/stripe/verify', protect, authorize('student'), verifyStripePayment);

// Get payment status
router.get('/status/:enrollmentId', protect, getPaymentStatus);

export default router;