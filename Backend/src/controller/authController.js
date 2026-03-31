import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/constants.js';

// User Registration
export const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'All fields must be filled!'
        });
    }

    try {
        let isExist = await User.findOne({ email });
        if (isExist) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'User already exists!'
            });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        let userRes = new User({
            name,
            email,
            password: hashPassword,
            phone,
            role: role || 'student',
            avatar: req.file?.filename || 'default-avatar.png'
        });

        userRes = await userRes.save();
        const token = jwt.sign(
            { id: userRes._id, email: userRes.email, role: userRes.role },
            JWT_SECRET,
            { expiresIn: "5d" }
        );

        res.status(201).json({
            status: 201,
            success: true,
            message: 'User Registered Successfully!',
            user: userRes,
            token
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error!',
            error: error.message
        });
    }
};

// User Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            status: 400,
            success: false,
            message: 'Email and password are required!'
        });
    }

    try {
        let resUser = await User.findOne({ email: email });
        if (!resUser) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'User Not Found!'
            });
        }

        const isMatch = await bcrypt.compare(password, resUser.password);
        if (!isMatch) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Credentials do not match!'
            });
        }

        // Update last active on login
        resUser.lastActive = new Date();
        await resUser.save();

        const token = jwt.sign(
            { id: resUser._id, email: resUser.email, role: resUser.role },
            JWT_SECRET,
            { expiresIn: "5d" }
        );

        res.cookie("jwt_token", token).status(200).json({
            status: 200,
            success: true,
            message: "User Login Successfully!",
            user: resUser,
            token,
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error!',
            error: error.message
        });
    }
};

// User Logout
export const logout = (req, res) => {
    try {
        res.clearCookie("jwt_token").status(200).json({
            status: 200,
            success: true,
            message: "User logged out successfully!",
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error!',
            error: error.message
        });
    }
};

// Get Profile
export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.lastActive = new Date();
            await user.save();
        }
        res.status(200).json({
            status: 200,
            success: true,
            user
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Update Profile
export const updateProfile = async (req, res) => {
    try {
        const updates = {};
        if (req.body.name !== undefined) updates.name = req.body.name;
        if (req.body.phone !== undefined) updates.phone = req.body.phone;
        if (req.file?.filename) updates.avatar = req.file.filename;

        const user = await User.findByIdAndUpdate(req.user.id, updates, { returnDocument: 'after' });
        res.status(200).json({
            status: 200,
            success: true,
            message: 'Profile updated!',
            user
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Public Instructors
export const getPublicInstructors = async (req, res) => {
    try {
        const instructors = await User.find({ role: 'instructor', isActive: true }).select('name avatar bio expertise');
        res.status(200).json({ status: 200, success: true, data: instructors });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};