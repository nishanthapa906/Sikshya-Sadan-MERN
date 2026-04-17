import dotenv from 'dotenv';
dotenv.config();

// Authentication
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Database
export const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sikshya_sadan';

// Payment Gateways (Nepal)
export const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
export const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY; 
export const ESEWA_URL = process.env.ESEWA_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

export const KHALTI_PUBLIC_KEY = process.env.KHALTI_PUBLIC_KEY;
export const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY;

// Payment Gateways (Global)
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;

// URLs
export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Email Configuration
export const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
export const EMAIL_PORT = process.env.EMAIL_PORT || 587;
export const EMAIL_USER = process.env.EMAIL_USER;
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;

