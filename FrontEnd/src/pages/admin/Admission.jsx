import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI } from '../../services/api';
import { usePayment } from '../../hooks/usePayment';
import { FaUserPlus, FaCheckCircle, FaCreditCard } from 'react-icons/fa';

const Admission = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { processPayment, loading: paying, error: payErr } = usePayment();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [form, setForm] = useState({ courseId: location.state?.courseId || '', paymentMethod: 'esewa', installmentPlanId: '' });

    const selected = courses.find(c => c._id === form.courseId);

    useEffect(() => {
        if (!user) { navigate('/login', { state: { from: '/admission' } }); return; }
        courseAPI.getAllCourses()
            .then(res => setCourses(res.data.courses || []))
            .catch(() => setErr('Failed to load courses'))
            .finally(() => setLoading(false));
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.courseId) return setErr('Please select a course');
        setErr('');
        try { await processPayment(form.paymentMethod, form.courseId, form.installmentPlanId); }
        catch { setErr('Payment failed. Try again.'); }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem', maxWidth: '800px', margin: '0 auto' }}>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FaUserPlus /> Admission Form</h1>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Select your course and payment method to enroll.</p>

            {(err || payErr) && <p style={{ color: 'red', marginBottom: '1rem' }}>⚠️ {err || payErr}</p>}

            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                {/* Student Info */}
                <div style={{ marginBottom: '1rem', background: '#f9fafb', padding: '0.75rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <label style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 'bold' }}>Student</label>
                    <p style={{ margin: '0.25rem 0 0', fontWeight: 'bold' }}>{user?.name} ({user?.email})</p>
                </div>

                {/* Course */}
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>Select Course</label>
                    <select value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })} required style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                        <option value="">-- Select a Program --</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title} — Rs. {c.fee}</option>)}
                    </select>
                </div>

                {/* Installment */}
                {selected?.installmentAvailable && (
                    <div style={{ marginBottom: '1rem' }}>
                        <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>Payment Plan</label>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                <tr>
                                    <td style={{ padding: '0.5rem' }}>
                                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                            <input type="radio" name="plan" value="" checked={form.installmentPlanId === ''} onChange={() => setForm({ ...form, installmentPlanId: '' })} />
                                            <span><strong>Full Payment</strong> — Rs. {selected.fee}</span>
                                        </label>
                                    </td>
                                </tr>
                                {selected.installmentPlans?.map(p => (
                                    <tr key={p._id}>
                                        <td style={{ padding: '0.5rem' }}>
                                            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                                                <input type="radio" name="plan" value={p._id} checked={form.installmentPlanId === p._id} onChange={() => setForm({ ...form, installmentPlanId: p._id })} />
                                                <span><strong>{p.numberOfInstallments} installments</strong> — Rs. {p.amountPerInstallment}/month</span>
                                            </label>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Payment Method */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.4rem' }}>Payment Method</label>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {[
                            { val: 'esewa', label: 'eSewa', bg: '#059669', color: '#fff' },
                            { val: 'khalti', label: 'Khalti', bg: '#7c3aed', color: '#fff' },
                            { val: 'stripe', label: 'Card/Stripe', icon: <FaCreditCard /> },
                        ].map(m => (
                            <label key={m.val} style={{ cursor: 'pointer', padding: '0.5rem 1rem', border: `2px solid ${form.paymentMethod === m.val ? '#6366f1' : '#e2e8f0'}`, borderRadius: '8px', background: form.paymentMethod === m.val ? '#eef2ff' : '#fff', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                <input type="radio" name="paymentMethod" value={m.val} checked={form.paymentMethod === m.val} onChange={() => setForm({ ...form, paymentMethod: m.val })} style={{ display: 'none' }} />
                                {m.bg ? <span style={{ background: m.bg, color: m.color, padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{m.label}</span> : <>{m.icon} {m.label}</>}
                            </label>
                        ))}
                    </div>
                </div>

                <div style={{ background: '#f9fafb', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', border: '1px solid #e2e8f0' }}>
                    {['Pro Industrial Syllabus', 'Live Project Experience', 'Global Certification'].map(f => (
                        <p key={f} style={{ margin: '0.25rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#059669', fontSize: '0.85rem' }}><FaCheckCircle /> {f}</p>
                    ))}
                </div>

                <button type="submit" disabled={paying} style={{ width: '100%', padding: '0.75rem', background: paying ? '#94a3b8' : '#1e1b4b', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: paying ? 'not-allowed' : 'pointer' }}>
                    {paying ? 'Redirecting...' : 'Proceed to Payment'}
                </button>
                <p style={{ textAlign: 'center', fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>🔒 Secure 256-bit SSL encrypted payment</p>
            </form>
        </div>
    );
};

export default Admission;
