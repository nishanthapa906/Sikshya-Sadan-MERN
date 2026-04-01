import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import { FaSearch, FaCheckCircle, FaTimesCircle, FaWallet } from 'react-icons/fa';

const AdminFinance = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ totalRevenue: 0 });
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('');

    useEffect(() => {
        adminAPI.getFinancialReports()
            .then(res => { setEnrollments(res.data.data.enrollments || []); setStats({ totalRevenue: res.data.data.totalRevenue || 0 }); })
            .catch(() => alert('Failed to load'))
            .finally(() => setLoading(false));
    }, []);

    const updatePayment = async (id, status) => {
        try {
            await adminAPI.updateEnrollmentPaymentStatus(id, { paymentStatus: status });
            setEnrollments(prev => prev.map(e => e._id === id ? { ...e, paymentStatus: status } : e));
        } catch { alert('Failed to update'); }
    };

    const filtered = enrollments.filter(e => {
        const s = search.toLowerCase();
        return (!s || e.student?.name?.toLowerCase().includes(s) || e.course?.title?.toLowerCase().includes(s)) &&
            (!filter || e.paymentStatus === filter);
    });

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>Financial Reports</h1>

            {/* Stats */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}><FaWallet /> Total Revenue</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Total Enrollments</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}>Pending</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>Rs. {stats.totalRevenue.toLocaleString()}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>{enrollments.length}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontWeight: 'bold', fontSize: '1.25rem' }}>{enrollments.filter(e => e.paymentStatus === 'pending').length}</td>
                    </tr>
                </tbody>
            </table>

            {/* Filters */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative' }}>
                    <FaSearch style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                    <input type="text" placeholder="Search student or course..." value={search} onChange={e => setSearch(e.target.value)} style={{ paddingLeft: '2rem', padding: '0.4rem 0.5rem 0.4rem 2rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)} style={{ padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="installment">Installment</option>
                </select>
            </div>

            {filtered.length === 0 ? <p>No records found.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#1e293b', color: '#fff' }}>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Student</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Course</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Amount</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '0.6rem 0.75rem', textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(e => (
                            <tr key={e._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.6rem 0.75rem' }}>
                                    <div style={{ fontWeight: 'bold' }}>{e.student?.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.student?.email}</div>
                                </td>
                                <td style={{ padding: '0.6rem 0.75rem' }}>{e.course?.title}</td>
                                <td style={{ padding: '0.6rem 0.75rem', fontWeight: 'bold' }}>Rs. {e.course?.fee?.toLocaleString()}</td>
                                <td style={{ padding: '0.6rem 0.75rem' }}>
                                    <span style={{ padding: '2px 8px', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 'bold', background: e.paymentStatus === 'completed' ? '#d1fae5' : e.paymentStatus === 'pending' ? '#fef3c7' : e.paymentStatus === 'installment' ? '#e0e7ff' : '#fee2e2', color: e.paymentStatus === 'completed' ? '#065f46' : e.paymentStatus === 'pending' ? '#92400e' : e.paymentStatus === 'installment' ? '#3730a3' : '#991b1b' }}>
                                        {e.paymentStatus}
                                    </span>
                                </td>
                                <td style={{ padding: '0.6rem 0.75rem' }}>
                                    {e.paymentStatus === 'pending' && (
                                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                                            <button onClick={() => updatePayment(e._id, 'completed')} style={{ cursor: 'pointer', color: 'green', background: 'none', border: 'none' }} title="Approve"><FaCheckCircle /></button>
                                            <button onClick={() => updatePayment(e._id, 'failed')} style={{ cursor: 'pointer', color: 'red', background: 'none', border: 'none' }} title="Reject"><FaTimesCircle /></button>
                                        </div>
                                    )}
                                    {e.paymentStatus === 'completed' && <span style={{ color: 'green', fontSize: '0.75rem' }}>✓ Settled</span>}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default AdminFinance;
