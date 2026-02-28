import express from 'express';
const router = express.Router();
import {
    register,
    login,
    logout,
    getMe,
    updateProfile
} from '../controller/authController.js';
import { protect } from '../middleware/auth.js';

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);

export default router;
