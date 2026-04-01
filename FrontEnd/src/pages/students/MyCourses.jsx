import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, UPLOAD_URL } from '../../services/api';

const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        enrollmentAPI.getMyEnrollments()
            .then(res => setEnrollments(res.data.enrollments || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>My Courses</h1>
            {enrollments.length === 0 ? (
                <p>No courses yet. <a href="/courses">Enroll now!</a></p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Thumbnail</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Course</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Instructor</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Progress</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {enrollments.map(e => (
                            <tr key={e._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>
                                    <img src={`${UPLOAD_URL}/${e.course.thumbnail}`} alt={e.course.title} onError={ev => { ev.target.src = 'https://via.placeholder.com/60x40'; }} style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }} />
                                </td>
                                <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{e.course.title}</td>
                                <td style={{ padding: '0.5rem', color: '#64748b' }}>{e.course.instructor?.name || 'Sipalaya Tech'}</td>
                                <td style={{ padding: '0.5rem' }}>
                                    <div style={{ background: '#e2e8f0', borderRadius: '99px', height: '6px', width: '80px' }}>
                                        <div style={{ background: '#6366f1', height: '6px', borderRadius: '99px', width: `${e.progress || 0}%` }} />
                                    </div>
                                    <small>{e.progress || 0}%</small>
                                </td>
                                <td style={{ padding: '0.5rem' }}>
                                    <Link to={`/student/course/${e.course._id}`} style={{ padding: '0.25rem 0.75rem', background: '#1e1b4b', color: '#fff', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' }}>Go to Class</Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default MyCourses;
