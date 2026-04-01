import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../utils/constants.js';

export const register = async (req, res) => {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone)
        return res.status(400).json({ success: false, message: 'All fields required' });
    try {
        if (await User.findOne({ email }))
            return res.status(400).json({ success: false, message: 'User already exists' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashed, phone, role: role || 'student', avatar: req.file?.filename || 'default-avatar.png' });
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '5d' });
        res.status(201).json({ success: true, user, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ success: false, message: 'Email and password required' });
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ success: false, message: 'User not found' });
        if (!await bcrypt.compare(password, user.password))
            return res.status(400).json({ success: false, message: 'Invalid credentials' });
        user.lastActive = new Date();
        await user.save();
        const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '5d' });
        res.cookie('jwt_token', token).json({ success: true, user, token });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const logout = (req, res) => {
    res.clearCookie('jwt_token').json({ success: true, message: 'Logged out' });
};

export const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user) { user.lastActive = new Date(); await user.save(); }
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateProfile = async (req, res) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.phone) updates.phone = req.body.phone;
        if (req.file?.filename) updates.avatar = req.file.filename;
        const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
        res.json({ success: true, user });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getPublicInstructors = async (req, res) => {
    try {
        const data = await User.find({ role: 'instructor', isActive: true }).select('name avatar bio expertise');
        res.json({ success: true, data });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};