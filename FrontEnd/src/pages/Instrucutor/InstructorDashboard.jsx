import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instructorAPI } from '../../services/api';
import { FaUsers, FaClipboardList, FaPlus, FaFileUpload, FaCheckSquare, FaBook, FaEdit, FaGraduationCap } from 'react-icons/fa';

const InstructorDashboard = () => {
    const [stats, setStats] = useState({ totalCourses: 0, totalStudents: 0, pendingSubmissions: 0 });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState(null);

    useEffect(() => {
        instructorAPI.getDashboard()
            .then(res => { const d = res.data.data; setStats({ totalCourses: d.totalCourses || 0, totalStudents: d.totalStudents || 0, pendingSubmissions: d.pendingGrading || 0 }); setCourses(d.courses || []); })
            .catch(() => setErr('Failed to load'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;
    if (err) return <div style={{ padding: '2rem', color: 'red' }}>{err}</div>;

    const actions = [
        { to: '/instructor/assignments', icon: <FaPlus />, label: 'Create Assignment', desc: 'Add tasks for students' },
        { to: '/instructor/grade-assignments', icon: <FaCheckSquare />, label: 'Grade Assignments', desc: 'Review submissions' },
        { to: '/instructor/attendance', icon: <FaUsers />, label: 'Attendance', desc: 'Mark daily attendance' },
        { to: '/instructor/resources', icon: <FaFileUpload />, label: 'Upload Resources', desc: 'Share study materials' },
        { to: '/instructor/blogs', icon: <FaEdit />, label: 'Write Blogs', desc: 'Publish articles' },
        { to: '/instructor/verify-completion', icon: <FaGraduationCap />, label: 'Verify Completion', desc: 'Issue certificates' },
    ];

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ margin: 0 }}>Instructor Dashboard</h1>
                <Link to="/instructor/courses" style={{ padding: '0.4rem 1rem', background: '#1e1b4b', color: '#fff', borderRadius: '8px', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <FaPlus /> Add Course
                </Link>
            </div>

            {/* Stats */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}><FaBook /> Courses</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}><FaUsers /> Students</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center' }}><FaClipboardList /> Pending</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalCourses}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.totalStudents}</td>
                        <td style={{ padding: '0.75rem', textAlign: 'center', fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.pendingSubmissions}</td>
                    </tr>
                </tbody>
            </table>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {actions.map(a => (
                    <Link key={a.to} to={a.to} style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem', textDecoration: 'none', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.25rem', color: '#6366f1' }}>{a.icon}</span>
                        <div>
                            <div style={{ fontWeight: 'bold' }}>{a.label}</div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.desc}</div>
                        </div>
                    </Link>
                ))}
            </div>

            <h2>Your Courses</h2>
            {courses.length === 0 ? (
                <p>No courses yet. <Link to="/instructor/courses">Create one</Link></p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Title</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Category</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Students</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.slice(0, 4).map(c => (
                            <tr key={c._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}><Link to="/instructor/courses">{c.title}</Link></td>
                                <td style={{ padding: '0.5rem' }}>{c.category}</td>
                                <td style={{ padding: '0.5rem' }}>{c.enrolledStudents || 0}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InstructorDashboard;
