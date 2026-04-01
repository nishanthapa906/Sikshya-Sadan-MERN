import dotenv from 'dotenv';

// Only load .env if not in production or for local testing
const isProd = process.env.NODE_ENV === 'production';
if (!isProd) {
    dotenv.config();
} else {
    // In production, we can still call it but quieter, though Vercel injects natively
    dotenv.config({ quiet: true });
}

export const JWT_SECRET = process.env.JWT_SECRET || 'sikshya_sadan_secret_key_2024';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

// Support both common names
export const MONGODB_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

if (!MONGODB_URI && isProd) {
    console.error("CRITICAL ERROR: Neither MONGO_URI nor MONGODB_URI is defined in production environment variables!");
    console.log("Current process.env keys:", Object.keys(process.env).filter(k => !k.includes('SECRET') && !k.includes('KEY')));
}


export const ESEWA_MERCHANT_ID = process.env.ESEWA_MERCHANT_ID || 'EPAYTEST';
export const ESEWA_SECRET_KEY = process.env.ESEWA_SECRET_KEY || '8gBm/:&EnhH.1/q';
export const ESEWA_URL = process.env.ESEWA_URL || 'https://rc-epay.esewa.com.np/api/epay/main/v2/form';

export const KHALTI_PUBLIC_KEY = process.env.KHALTI_PUBLIC_KEY || 'test_public_key_dc74e0fd57cb46cd93832aee0a390234';
export const KHALTI_SECRET_KEY = process.env.KHALTI_SECRET_KEY || 'test_secret_key_f59e8b7d18b4499ca40f68195a846e9b';

export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';

export const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

export const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
export const EMAIL_PORT = process.env.EMAIL_PORT || 587;
export const EMAIL_USER = process.env.EMAIL_USER || 'nishanthapa906@gmail.com';
export const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD || 'your_app_password';
