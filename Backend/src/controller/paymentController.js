import Enrollment from "../models/enrollmentModel.js";
import Course from "../models/courseModel.js";
import crypto from 'crypto';

const FRONTEND_URL = "http://localhost:3000";
const ESEWA_SECRET_KEY = "8gBm/:&EnhH.1/q";
const ESEWA_MERCHANT_ID = "EPAYTEST";


//Helper for Invoice Number

const generateInvoice = ()=>{
    const date = new Date();
     return `INV-${date.getFullYear()}${Date.now().toString().slice(-4)}`;
}

//eSewa Initiation 
export const initiateEsewaPayment = async ( req, res)=>{
    const{courseId, amount } = req.body;
    try {
        const course = await Course.findById(courseId);
        if(!course) return res.status(404).json({status: 404, success:false, message:'Course not Found'});
        const enrollment = await Enrollment.create({
           student: req.user.id,
            course: course._id,
            totalAmount: course.fee,
            paidAmount: 0,
            remainingAmount: course.fee,
            paymentMethod: 'esewa',
            paymentStatus: 'pending',
            invoiceNumber: generateInvoice()
        });
        const secret = ESEWA_SECRET_KEY;
        const product_code = ESEWA_MERCHANT_ID;
        const transaction_uuid = enrollment._id.toString();
        const total_amount = amount || course.fee;

        const message = `total_amount=${total_amount},transaction_uuid=${transaction_uuid},product_code=${product_code}`;
        const signature = crypto.createHmac('sha256', secret).update(message).digest('base64');

        const esewaParams = {
            amount: total_amount,
            tax_amount: 0,
            product_service_charge: 0,
            product_delivery_charge: 0,
            total_amount: total_amount,
            transaction_uuid: transaction_uuid,
            product_code: product_code,
            success_url: `${FRONTEND_URL}/payment/success`,
            failure_url: `${FRONTEND_URL}/payment/failure`,
            signed_field_names: 'total_amount,transaction_uuid,product_code',
            signature: signature
        };

        res.status(200).json({
            status: 200,
            success: true,
            enrollmentId: enrollment._id,
            esewaParams,
            url: 'https://rc-epay.esewa.com.np/api/epay/main/v2/form'
        });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// eSewa Verify
export const verifyEsewaPayment = async (req, res) => {
    const { data } = req.query;
    try {
        const decodedString = Buffer.from(data, 'base64').toString();
        const decoded = JSON.parse(decodedString);

        const enrollment = await Enrollment.findById(decoded.transaction_uuid);
        if (!enrollment) return res.status(404).json({ status: 404, success: false, message: 'Enrollment not found' });

        if (decoded.status === 'COMPLETE') {
            enrollment.paidAmount += parseFloat(decoded.total_amount);
            enrollment.remainingAmount = enrollment.totalAmount - enrollment.paidAmount;
            enrollment.transactionId = decoded.transaction_code;
            enrollment.paymentStatus = 'completed';
            await enrollment.save();
        }

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Payment Processed',
            status_code: decoded.status,
            enrollment
        });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
    // Status
export const getPaymentStatus = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course');
        res.status(200).json({ status: 200, success: true, data: enrollment });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
