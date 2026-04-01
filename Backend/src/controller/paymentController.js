import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";
import crypto from 'crypto';
import { ESEWA_MERCHANT_ID, ESEWA_SECRET_KEY, ESEWA_URL, KHALTI_SECRET_KEY, FRONTEND_URL as DEFAULT_FRONTEND_URL } from "../utils/constants.js";

// Use dynamic FRONTEND_URL or fallback to constant
const FRONTEND_URL = process.env.FRONTEND_URL || DEFAULT_FRONTEND_URL;

const genInvoice = () => `INV-${new Date().getFullYear()}${Date.now().toString().slice(-4)}`;

export const initiateEsewaPayment = async (req, res) => {
    const { courseId, amount } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        const total = amount || course.fee;
        const enrollment = await Enrollment.create({ student: req.user.id, course: course._id, totalAmount: total, paidAmount: 0, remainingAmount: total, paymentMethod: 'esewa', paymentStatus: 'pending', invoiceNumber: genInvoice() });
        const uuid = enrollment._id.toString();
        const msg = `total_amount=${total},transaction_uuid=${uuid},product_code=${ESEWA_MERCHANT_ID}`;
        const signature = crypto.createHmac('sha256', ESEWA_SECRET_KEY).update(msg).digest('base64');
        res.json({ success: true, enrollmentId: enrollment._id, esewaParams: { amount: String(total), tax_amount: "0", product_service_charge: "0", product_delivery_charge: "0", total_amount: String(total), transaction_uuid: uuid, product_code: ESEWA_MERCHANT_ID, success_url: `${FRONTEND_URL}/payment/success`, failure_url: `${FRONTEND_URL}/payment/failure`, signed_field_names: 'total_amount,transaction_uuid,product_code', signature }, url: ESEWA_URL });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const initiateKhaltiPayment = async (req, res) => {
    const { courseId, amount } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        const total = amount || course.fee;
        const enrollment = await Enrollment.create({ student: req.user.id, course: course._id, totalAmount: total, paidAmount: 0, remainingAmount: total, paymentMethod: 'khalti', paymentStatus: 'pending', invoiceNumber: genInvoice() });
        const res2 = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", { method: 'POST', headers: { 'Authorization': `Key ${KHALTI_SECRET_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ return_url: `${FRONTEND_URL}/payment/success`, website_url: FRONTEND_URL, amount: total * 100, purchase_order_id: enrollment._id.toString(), purchase_order_name: course.title, customer_info: { name: req.user.name || 'Student', email: req.user.email, phone: '9800000000' } }) });
        const data = await res2.json();
        if (data.payment_url) return res.json({ success: true, payment_url: data.payment_url, enrollmentId: enrollment._id });
        res.status(400).json({ success: false, message: 'Khalti init failed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyEsewaPayment = async (req, res) => {
    let { data } = req.query;
    try {
        if (!data) return res.status(400).json({ success: false, message: 'No data provided' });
        data = data.replace(/ /g, '+');
        const decoded = JSON.parse(Buffer.from(data, 'base64').toString());
        const msg = `total_amount=${decoded.total_amount},transaction_uuid=${decoded.transaction_uuid},product_code=${decoded.product_code}`;
        const expected = crypto.createHmac('sha256', ESEWA_SECRET_KEY).update(msg).digest('base64');
        const enrollment = await Enrollment.findById(decoded.transaction_uuid);
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        if (decoded.status === 'COMPLETE' || decoded.status === 'COMPLETED') {
            enrollment.paidAmount = Math.max(enrollment.paidAmount || 0, parseFloat(decoded.total_amount || 0));
            enrollment.remainingAmount = Math.max(0, enrollment.totalAmount - enrollment.paidAmount);
            enrollment.transactionId = decoded.transaction_code;
            enrollment.paymentStatus = 'completed';
            await enrollment.save();
            const full = await Enrollment.findById(enrollment._id).populate('course');
            return res.json({ success: true, enrollment: full });
        }
        enrollment.paymentStatus = 'failed';
        await enrollment.save();
        res.status(400).json({ success: false, message: `Payment ${decoded.status}` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyKhaltiPayment = async (req, res) => {
    const { pidx, enrollmentId } = req.body;
    try {
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        const r = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", { method: 'POST', headers: { 'Authorization': `Key ${KHALTI_SECRET_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ pidx }) });
        const data = await r.json();
        if (data?.status === 'Completed') {
            enrollment.paidAmount += parseFloat(data.total_amount) / 100;
            enrollment.remainingAmount = enrollment.totalAmount - enrollment.paidAmount;
            enrollment.transactionId = data.transaction_id;
            enrollment.paymentStatus = 'completed';
            await enrollment.save();
            return res.json({ success: true, enrollment });
        }
        res.status(400).json({ success: false, message: 'Khalti verification failed' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createStripeSession = async (req, res) => {
    const { courseId, amount } = req.body;
    try {
        const course = await Course.findById(courseId);
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        const total = amount || course.fee;
        const enrollment = await Enrollment.create({ student: req.user.id, course: course._id, totalAmount: total, paidAmount: 0, remainingAmount: total, paymentMethod: 'stripe', paymentStatus: 'pending', invoiceNumber: genInvoice() });
        const sessionId = 'test_stripe_' + enrollment._id.toString();
        res.json({ success: true, url: `${FRONTEND_URL}/payment/success?session_id=${sessionId}&enrollmentId=${enrollment._id}`, sessionId, enrollmentId: enrollment._id });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const verifyStripePayment = async (req, res) => {
    const { sessionId, enrollmentId } = req.body;
    try {
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        if (sessionId?.startsWith('test_stripe_')) {
            enrollment.paidAmount = enrollment.totalAmount;
            enrollment.remainingAmount = 0;
            enrollment.transactionId = sessionId;
            enrollment.paymentStatus = 'completed';
            await enrollment.save();
            return res.json({ success: true, enrollment });
        }
        res.status(400).json({ success: false, message: 'Invalid session' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course');
        res.json({ success: true, data: enrollment });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
