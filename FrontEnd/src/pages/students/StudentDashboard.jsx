import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaBookOpen, FaCheckCircle, FaTasks, FaCertificate, FaArrowRight, FaClock } from 'react-icons/fa';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        studentAPI.getDashboard()
            .then(res => { if (res.data.success) setData(res.data.data); })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    const d = data || { enrollments: [], totalCourses: 0, activeCourses: 0, completedCourses: 0, pendingAssignments: 0 };

    const stats = [
        { label: 'Enrolled', val: d.totalCourses, icon: <FaBookOpen /> },
        { label: 'Active', val: d.activeCourses, icon: <FaClock /> },
        { label: 'Completed', val: d.completedCourses, icon: <FaCheckCircle /> },
        { label: 'Pending Tasks', val: d.pendingAssignments, icon: <FaTasks /> },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>Welcome, {user?.name?.split(' ')[0]}</h1>
                <Link to="/courses" style={{ padding: '0.4rem 1rem', background: '#1e1b4b', color: '#fff', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    Browse Courses <FaArrowRight />
                </Link>
            </div>

            {/* Stats */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        {stats.map(s => <th key={s.label} style={{ padding: '0.75rem', textAlign: 'center' }}>{s.icon} {s.label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        {stats.map(s => <td key={s.label} style={{ padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{s.val}</td>)}
                    </tr>
                </tbody>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Enrollments */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <h2 style={{ margin: 0 }}>My Courses</h2>
                        <Link to="/student/my-courses" style={{ fontSize: '0.85rem', color: '#6366f1' }}>View all <FaArrowRight /></Link>
                    </div>
                    {d.enrollments.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: '#f9fafb', borderRadius: '10px', border: '1px dashed #e2e8f0' }}>
                            <p>Not enrolled yet.</p>
                            <Link to="/courses" style={{ color: '#6366f1', fontWeight: 'bold' }}>Explore Programs</Link>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f0f0f0' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Course</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Progress</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {d.enrollments.slice(0, 3).map(e => (
                                    <tr key={e._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.5rem' }}>
                                            <div style={{ fontWeight: 'bold' }}>{e.course?.title}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>by {e.course?.instructor?.name}</div>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '6px', width: '100px' }}>
                                                <div style={{ background: '#6366f1', height: '6px', borderRadius: '99px', width: `${e.progress || 0}%` }} />
                                            </div>
                                            <span style={{ fontSize: '0.75rem' }}>{e.progress || 0}%</span>
                                        </td>
                                        <td style={{ padding: '0.5rem' }}>
                                            <Link to={`/student/course/${e.course?._id}`} style={{ padding: '0.25rem 0.75rem', background: '#1e1b4b', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.8rem' }}>
                                                Resume
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Sidebar Nav */}
                <div>
                    <h2>Quick Access</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {[
                            ['/student/my-courses', <FaBookOpen />, 'My Courses'],
                            ['/student/assignments', <FaTasks />, 'Assignments'],
                            ['/student/certificates', <FaCertificate />, 'Certificates'],
                        ].map(([to, icon, label]) => (
                            <Link key={to} to={to} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', textDecoration: 'none', color: '#1e293b', fontWeight: 'bold' }}>
                                <span style={{ color: '#6366f1' }}>{icon}</span> {label} <FaArrowRight style={{ marginLeft: 'auto', color: '#94a3b8' }} />
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;
