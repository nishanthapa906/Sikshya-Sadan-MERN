import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../services/api';
// Using the new custom hook for clean, beginner-friendly payment logic!
import { usePayment } from '../../hooks/usePayment'; 
import { FaUserPlus, FaCheckCircle, FaExclamationCircle, FaCreditCard } from 'react-icons/fa';

const Admission = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { processPayment, loading: paymentLoading, error: paymentError } = usePayment(); // <-- Our custom hook

    // Initial course if navigated from course details
    const initialCourseId = location.state?.courseId || '';

    const [courses, setCourses] = useState([]);
    const [formData, setFormData] = useState({
        courseId: initialCourseId,
        paymentMethod: 'esewa',
        installmentPlanId: ''
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const selectedCourse = courses.find(c => c._id === formData.courseId);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await courseAPI.getAllCourses();
                setCourses(res.data.courses || []);
            } catch (err) {
                console.error('Failed to fetch courses:', err);
                setError('Failed to load available courses.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();

        if (!user) {
            navigate('/login', { state: { from: '/admission', message: 'Please login to apply for admission' } });
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.courseId) return setError('Please select a course');
        setError('');

        try {
            // All complex payment processing redirects are now abstracted to our custom hook
            await processPayment(formData.paymentMethod, formData.courseId, formData.installmentPlanId);
        } catch (err) {
            console.error('Admission Error:', err);
            setError('Payment Failed to Initiate. Please try again.');
        }
    };

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-24">
            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col md:flex-row">
                    <div className="md:w-1/3 bg-primary-900 p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-primary-600/20 via-transparent to-transparent"></div>
                        <div className="relative z-10">
                            <FaUserPlus size={48} className="text-primary-400 mb-8" />
                            <h2 className="text-3xl font-black italic mb-6">Start Your Journey</h2>
                            <p className="text-primary-100 font-light text-sm leading-relaxed">
                                Complete the form to secure your seat in the upcoming batch. Our expert instructors are ready to guide you.
                            </p>
                        </div>
                        <div className="relative z-10 mt-12 space-y-4">
                            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                                <FaCheckCircle /> Pro Industrial Syllabus
                            </p>
                            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                                <FaCheckCircle /> Live Project Experience
                            </p>
                            <p className="flex items-center gap-3 text-xs font-bold uppercase tracking-wider text-emerald-400">
                                <FaCheckCircle /> Global Certification
                            </p>
                        </div>
                    </div>

                    <div className="md:w-2/3 p-12 space-y-8">
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 mb-2">Admission Form</h1>
                            <p className="text-slate-400 font-medium">Please select your course and payment method.</p>
                        </div>

                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fadeIn">
                                <FaExclamationCircle /> {error}
                            </div>
                        )}
                        {paymentError && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-fadeIn">
                                <FaExclamationCircle /> {paymentError}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Logged In Student</label>
                                <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100 font-bold text-slate-700">
                                    {user?.name} ({user?.email})
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Choose Course</label>
                                <select
                                    name="courseId"
                                    required
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 ring-primary-100 outline-none font-bold text-slate-800 appearance-none shadow-sm"
                                    value={formData.courseId}
                                    onChange={handleChange}
                                >
                                    <option value="">Select a Program</option>
                                    {courses.map(course => (
                                        <option key={course._id} value={course._id}>{course.title} — Rs. {course.fee}</option>
                                    ))}
                                </select>
                            </div>

                            {selectedCourse?.installmentAvailable && (
                                <div className="space-y-4 animate-fadeIn">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Payment Plan</label>
                                    <div className="grid grid-cols-1 gap-4">
                                        <label className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.installmentPlanId === '' ? 'border-primary-600 bg-primary-50' : 'border-slate-100'}`}>
                                            <input
                                                type="radio"
                                                name="installmentPlanId"
                                                value=""
                                                className="hidden"
                                                onChange={handleChange}
                                                checked={formData.installmentPlanId === ''}
                                            />
                                            <div className="flex flex-col">
                                                <span className="font-black text-slate-800">One-time Full Payment</span>
                                                <span className="text-sm text-slate-500 font-bold tracking-tight">Pay the total amount of Rs. {selectedCourse.fee} today.</span>
                                            </div>
                                            <span className="h-6 w-6 rounded-full border-2 border-primary-600 flex items-center justify-center">
                                                {formData.installmentPlanId === '' && <div className="h-3 w-3 rounded-full bg-primary-600"></div>}
                                            </span>
                                        </label>

                                        {selectedCourse.installmentPlans?.map((plan) => (
                                            <label key={plan._id} className={`flex items-center justify-between p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.installmentPlanId === plan._id ? 'border-primary-600 bg-primary-50' : 'border-slate-100'}`}>
                                                <input
                                                    type="radio"
                                                    name="installmentPlanId"
                                                    value={plan._id}
                                                    className="hidden"
                                                    onChange={handleChange}
                                                    checked={formData.installmentPlanId === plan._id}
                                                />
                                                <div className="flex flex-col">
                                                    <span className="font-black text-slate-800 italic">Installment Plan: {plan.numberOfInstallments} Parts</span>
                                                    <span className="text-sm text-slate-500 font-bold tracking-tight">Only Rs. {plan.amountPerInstallment} per month.</span>
                                                </div>
                                                <span className="h-6 w-6 rounded-full border-2 border-primary-600 flex items-center justify-center">
                                                    {formData.installmentPlanId === plan._id && <div className="h-3 w-3 rounded-full bg-primary-600"></div>}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="space-y-4">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-2">Payment Method</label>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'esewa' ? 'border-primary-600 bg-primary-50' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="esewa"
                                            className="hidden"
                                            onChange={handleChange}
                                            checked={formData.paymentMethod === 'esewa'}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-8 w-16 bg-emerald-600 rounded flex items-center justify-center text-[10px] font-black text-white italic">eSewa</div>
                                            <span className="text-[10px] font-bold uppercase">eSewa Wallet</span>
                                        </div>
                                    </label>

                                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'stripe' ? 'border-primary-600 bg-primary-50' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="stripe"
                                            className="hidden"
                                            onChange={handleChange}
                                            checked={formData.paymentMethod === 'stripe'}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <FaCreditCard className="text-slate-600" size={24} />
                                            <span className="text-[10px] font-bold uppercase">Card / Stripe</span>
                                        </div>
                                    </label>

                                    <label className={`block p-4 rounded-2xl border-2 cursor-pointer transition-all ${formData.paymentMethod === 'khalti' ? 'border-primary-600 bg-primary-50' : 'border-slate-100 hover:border-slate-300'}`}>
                                        <input
                                            type="radio"
                                            name="paymentMethod"
                                            value="khalti"
                                            className="hidden"
                                            onChange={handleChange}
                                            checked={formData.paymentMethod === 'khalti'}
                                        />
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="h-8 w-16 bg-purple-600 rounded flex items-center justify-center text-[10px] font-black text-white italic">Khalti</div>
                                            <span className="text-[10px] font-bold uppercase">Khalti SDK</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button
                                    type="submit"
                                    disabled={paymentLoading}
                                    className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg shadow-xl shadow-slate-200 hover:bg-primary-600 transition-all flex items-center justify-center gap-3 disabled:bg-slate-300"
                                >
                                    {paymentLoading ? 'Redirecting to Payment...' : 'Proceed to Payment'}
                                </button>
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4 tracking-tighter">Secure 256-bit SSL encrypted payment.</p>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admission;
