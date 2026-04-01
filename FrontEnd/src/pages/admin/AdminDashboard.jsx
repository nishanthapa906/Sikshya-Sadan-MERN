import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaClipboardList, FaWallet, FaUsersCog, FaChartLine, FaBriefcase, FaCommentDots } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({ totalStudents: 0, totalInstructors: 0, totalCourses: 0, totalRevenue: 0, totalEnrollments: 0 });
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        adminAPI.getStats()
            .then(res => setStats(res.data.data))
            .catch(() => setErr('Failed to load'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (err) return <div style={{ padding: '2rem', color: 'red' }}>{err}</div>;

    const statCards = [
        { label: 'Students', val: stats.totalStudents, icon: <FaUserGraduate /> },
        { label: 'Instructors', val: stats.totalInstructors, icon: <FaChalkboardTeacher /> },
        { label: 'Courses', val: stats.totalCourses, icon: <FaBook /> },
        { label: 'Enrollments', val: stats.totalEnrollments, icon: <FaClipboardList /> },
        { label: 'Revenue', val: `Rs. ${(stats.totalRevenue || 0).toLocaleString()}`, icon: <FaWallet /> },
    ];

    const links = [
        { to: '/admin/users', label: 'Users', icon: <FaUsersCog /> },
        { to: '/admin/finance', label: 'Finance', icon: <FaChartLine /> },
        { to: '/instructor/courses', label: 'Courses', icon: <FaBook /> },
        { to: '/admin/jobs', label: 'Jobs', icon: <FaBriefcase /> },
        { to: '/admin/testimonials', label: 'Testimonials', icon: <FaCommentDots /> },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>Admin Dashboard</h1>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        {statCards.map(s => <th key={s.label} style={{ padding: '0.75rem', textAlign: 'center' }}>{s.icon} {s.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {statCards.map(s => <td key={s.label} style={{ padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{s.val}</td>)}
                    </tr>
                </tbody>
            </table>

            <h2>Management Tools</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    <tr>
                        {links.map(l => (
                            <td key={l.to} style={{ padding: '0.75rem', textAlign: 'center', border: '1px solid #eee' }}>
                                <Link to={l.to} style={{ textDecoration: 'none', color: '#333', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                                    <span style={{ fontSize: '1.5rem' }}>{l.icon}</span>
                                    <span style={{ fontWeight: 'bold' }}>{l.label}</span>
                                </Link>
                            </td>
                        ))}
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
