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
import upload from '../middleware/upload.js';

// Public routes
router.post('/register', upload.single('avatar'), register);
router.post('/login', login);
router.get('/logout', logout);

// Protected routes
router.get('/me', protect, getMe);
router.put('/update-profile', protect, upload.single('avatar'), updateProfile);

export default router;