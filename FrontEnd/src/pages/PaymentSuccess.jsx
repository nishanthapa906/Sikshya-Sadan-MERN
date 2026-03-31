import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';


const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrollment, setEnrollment] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const navigate = useNavigate();

    // Get parameters from various payment gateways
    const eseData = searchParams.get('data'); // eSewa v2
    const stripeSessionId = searchParams.get('session_id'); // Stripe
    const khaltiPidx = searchParams.get('pidx'); // Khalti (if using redirect)
    const enrollmentId = searchParams.get('enrollmentId');

    useEffect(() => {
        const verifyPayment = async () => {
            try {
                setLoading(true);
                let response;

                if (eseData) {
                    // eSewa v2 verification - doesn't require auth (browser redirect)
                    console.log("Verifying eSewa payment...");
                    response = await paymentAPI.verifyEsewa({ data: eseData });
                    console.log("eSewa verification response:", response);
                } else if (stripeSessionId) {
                    // Stripe verification
                    if (!token) {
                        setError('Authentication required for payment verification');
                        setLoading(false);
                        return;
                    }
                    response = await paymentAPI.verifyStripe({
                        sessionId: stripeSessionId,
                        enrollmentId
                    });
                } else if (khaltiPidx) {
                    // Khalti verification
                    if (!token) {
                        setError('Authentication required for payment verification');
                        setLoading(false);
                        return;
                    }
                    response = await paymentAPI.verifyKhalti({
                        pidx: khaltiPidx,
                        enrollmentId
                    });
                } else if (enrollmentId) {
                    // Just fetch status if already verified or for other methods
                    if (!token) {
                        setError('Authentication required for payment verification');
                        setLoading(false);
                        return;
                    }
                    response = await paymentAPI.getPaymentStatus(enrollmentId);
                } else {
                    setError('Invalid payment verification request - no payment data provided.');
                    setLoading(false);
                    return;
                }

                if (response.data?.success) {
                    console.log("Payment verified successfully:", response.data);
                    setEnrollment(response.data.enrollment || response.data.data);
                } else {
                    console.error("Payment verification failed:", response.data);
                    setError(response.data?.message || 'Payment verification failed. Please try again or contact support.');
                }
            } catch (err) {
                console.error('Verification error:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Failed to verify payment. Please contact support.';
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        // eSewa verification doesn't require token (browser redirect)
        // Other methods require authentication
        if (eseData || token) {
            verifyPayment();
        } else if (!loading) {
            setError('Authentication required. Please log in to verify your payment.');
            setLoading(false);
        }
    }, [eseData, stripeSessionId, khaltiPidx, enrollmentId, token]);

    useEffect(() => {
        if (!loading && !error && enrollment) {
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        navigate('/student/dashboard');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [loading, error, enrollment, navigate]);

    if (loading) {
        return (
            <div className="payment-status-container">
                <div className="status-card">
                    <div className="spinner"></div>
                    <h2>Verifying Payment...</h2>
                    <p>Please wait while we confirm your transaction with the provider.</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="payment-status-container">
                <div className="status-card error">
                    <div className="icon">❌</div>
                    <h2>Payment Verification Failed</h2>
                    <p>{error}</p>
                    <div className="actions">
                        <Link to="/contact" className="btn btn-outline">Contact Support</Link>
                        <Link to="/courses" className="btn btn-primary">Back to Courses</Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="payment-status-container">
            <div className="status-card success">
                <div className="icon">✅</div>
                <h2>Payment Successful!</h2>
                <p>Thank you for your enrollment. Your transaction has been completed successfully.</p>
                <div className="bg-emerald-50 text-emerald-600 font-bold p-3 rounded-xl mb-6 text-sm">
                    Redirecting to your dashboard in {countdown} seconds...
                </div>

                {enrollment && (
                    <div className="transaction-details">
                        <div className="detail-item">
                            <span>Course:</span>
                            <strong>{enrollment.course?.title || 'Course'}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Transaction ID:</span>
                            <strong>{enrollment.transactionId}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Amount Paid:</span>
                            <strong>Rs. {enrollment.paidAmount || enrollment.totalAmount}</strong>
                        </div>
                        <div className="detail-item">
                            <span>Status:</span>
                            <strong className={enrollment.paymentStatus === 'completed' ? 'text-emerald-600' : 'text-amber-600'}>
                                {enrollment.paymentStatus === 'completed' ? 'Full Payment' : 'First Installment Paid'}
                            </strong>
                        </div>
                    </div>
                )}

                <div className="actions">
                    <Link to="/student/dashboard" className="btn btn-primary">Go to My Learning</Link>
                    <Link to="/courses" className="btn btn-outline">Browse More Courses</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
