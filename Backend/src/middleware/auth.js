import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { JWT_SECRET } from '../utils/constants.js';

// Protect routes - verify JWT token
export const protect = async (req, res, next) => {
  try {
    let token = req.cookies.jwt_token;

    // Check Authorization header if cookie not present
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        status: 401,
        success: false,
        message: 'Not authorized, please login first!'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(404).json({
        status: 404,
        success: false,
        message: 'User not found!'
      });
    }

    next();
  } catch (error) {
    res.status(401).json({
      status: 401,
      success: false,
      message: 'Invalid or expired token',
      error: error.message
    });
  }
};

// Authorize specific roles
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 403,
        success: false,
        message: `Role ${req.user.role} is not authorized`
      });
    }
    next();
  };
};