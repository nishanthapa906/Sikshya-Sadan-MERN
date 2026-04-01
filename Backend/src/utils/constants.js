import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'sikshya_sadan_secret_key_2024';
export const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';
export const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/SIKSHYA-sadan-db';

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
