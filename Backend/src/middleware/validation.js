import { body, validationResult } from 'express-validator';

// Validation middleware
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array()
        });
    }
    next();
};

// Register validation rules
export const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone number is required')
        .matches(/^[0-9]{10}$/).withMessage('Please provide a valid 10-digit phone number')
];

// Login validation rules
export const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Course validation rules
export const courseValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Course title is required')
        .isLength({ max: 100 }).withMessage('Title cannot exceed 100 characters'),
    body('description')
        .trim()
        .notEmpty().withMessage('Course description is required'),
    body('category')
        .notEmpty().withMessage('Category is required'),
    body('skillLevel')
        .notEmpty().withMessage('Skill level is required'),
    body('duration')
        .notEmpty().withMessage('Duration is required')
        .isNumeric().withMessage('Duration must be a number'),
    body('fee')
        .notEmpty().withMessage('Fee is required')
        .isNumeric().withMessage('Fee must be a number'),
    body('startDate')
        .notEmpty().withMessage('Start date is required')
        .isISO8601().withMessage('Please provide a valid date')
];

// Assignment validation rules
export const assignmentValidation = [
    body('title')
        .trim()
        .notEmpty().withMessage('Assignment title is required'),
    body('description')
        .trim()
        .notEmpty().withMessage('Assignment description is required'),
    body('maxMarks')
        .notEmpty().withMessage('Maximum marks is required')
        .isNumeric().withMessage('Maximum marks must be a number'),
    body('dueDate')
        .notEmpty().withMessage('Due date is required')
        .isISO8601().withMessage('Please provide a valid date')
];

// Enrollment validation rules
export const enrollmentValidation = [
    body('courseId')
        .notEmpty().withMessage('Course ID is required'),
    body('paymentMethod')
        .notEmpty().withMessage('Payment method is required')
];
