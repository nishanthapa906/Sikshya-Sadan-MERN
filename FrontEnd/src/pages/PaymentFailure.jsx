import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { paymentAPI } from '../services/api';


const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [enrollment, setEnrollment] = useState(null);

    // Get 'data' parameter from eSewa v2 failure redirect
    const data = searchParams.get('data');

    useEffect(() => {
        const fetchFailureDetails = async () => {
            try {
                if (data) {
                    // Decode base64 data from eSewa
                    const decodedString = atob(data);
                    const failureData = JSON.parse(decodedString);
                    const transaction_uuid = failureData.transaction_uuid;

                    if (transaction_uuid) {
                        // Fetch enrollment details to get course info
                        const response = await paymentAPI.getPaymentStatus(transaction_uuid);

                        if (response.data.success) {
                            setEnrollment(response.data.data);
                        }
                    }
                }
            } catch (error) {
                console.error("Error fetching payment failure details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFailureDetails();
    }, [data, token]);

    const handleRetry = () => {
        if (enrollment && enrollment.course) {
            // Retry payment for the specific course
            navigate('/admission', {
                state: {
                    courseId: enrollment.course._id
                }
            });
        } else {
            // Fallback
            navigate('/courses');
        }
    };

    return (
        <div className="payment-status-container">
            <div className="status-card error">
                <div className="icon">⚠️</div>
                <h2>Payment Failed</h2>
                <p>We couldn't process your payment. Please try again or contact support if the issue persists.</p>

                {enrollment && enrollment.course && (
                    <div className="transaction-details">
                        <p><strong>Course:</strong> {enrollment.course.title}</p>
                        <p><strong>Amount:</strong> Rs. {enrollment.amount}</p>
                    </div>
                )}

                <div className="actions">
                    <button onClick={handleRetry} className="btn btn-primary">
                        {enrollment ? 'Retry Payment' : 'Try Again'}
                    </button>
                    <Link to="/contact" className="btn btn-outline">Contact Support</Link>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailure;
