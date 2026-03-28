import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { enrollmentAPI, UPLOAD_URL } from '../../services/api';


const MyCourses = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEnrollments();
    }, []);

    const fetchEnrollments = async () => {
        try {
            const response = await enrollmentAPI.getMyEnrollments();
            setEnrollments(response.data.enrollments || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching enrollments:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading courses...</div>;

    return (
        <div className="my-courses-page">
            <div className="container">
                <h1>My Courses</h1>
                <div className="enrolled-courses-grid">
                    {enrollments.map(enrollment => (
                        <div key={enrollment._id} className="enrolled-course-card">
                            <img
                                src={`${UPLOAD_URL}/${enrollment.course.thumbnail}`}
                                alt={enrollment.course.title}
                                onError={(e) => { e.target.src = 'https://via.placeholder.com/300x200?text=Course+Image' }}
                            />
                            <div className="card-content">
                                <h3>{enrollment.course.title}</h3>
                                <p className="instructor">Instructor: {enrollment.course.instructor?.name || 'Sipalaya Tech'}</p>
                                <div className="progress-section">
                                    <div className="progress-bar">
                                        <div
                                            className="fill"
                                            style={{ width: `${enrollment.progress || 0}%` }}
                                        ></div>
                                    </div>
                                    <span>{enrollment.progress || 0}%</span>
                                </div>
                                <Link to={`/student/course/${enrollment.course._id}`} className="btn btn-primary btn-block" style={{ marginTop: '1rem', display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                                    Go to Class
                                </Link>
                            </div>
                        </div>
                    ))}

                    {enrollments.length === 0 && (
                        <p>No courses found. <a href="/courses">Enroll now!</a></p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
