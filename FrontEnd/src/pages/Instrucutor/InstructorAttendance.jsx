import React, { useState, useEffect } from 'react';
import { instructorAPI } from '../../services/api';

const getLocalDate = (d = new Date()) => {
    const date = new Date(d);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

const InstructorAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null);
    const [date, setDate] = useState(getLocalDate());
    const [marked, setMarked] = useState({});

    useEffect(() => {
        instructorAPI.getMyCourses()
            .then(res => setCourses(res.data.courses || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!course) { setStudents([]); setMarked({}); return; }
        instructorAPI.getMyStudents(course)
            .then(res => setStudents(res.data.enrollments || []))
            .catch(err => console.error(err));
    }, [course]);

    useEffect(() => {
        if (!students.length) return;
        const m = {};
        students.forEach(e => {
            const rec = e.attendance?.find(a => getLocalDate(a.date) === date);
            if (rec) m[e._id] = rec.status;
        });
        setMarked(m);
    }, [date, students]);

    const mark = async (enrollmentId, status) => {
        try {
            setMarking(enrollmentId + '_' + status);
            const res = await instructorAPI.markAttendance(enrollmentId, { date, status });
            if (res.data.success) {
                setMarked(prev => ({ ...prev, [enrollmentId]: status }));
                setStudents(prev => prev.map(e => {
                    if (e._id !== enrollmentId) return e;
                    const list = [...(e.attendance || [])];
                    const idx = list.findIndex(a => getLocalDate(a.date) === date);
                    if (idx >= 0) list[idx] = { ...list[idx], status };
                    else list.push({ date, status });
                    return { ...e, attendance: list };
                }));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to mark attendance');
        } finally { setMarking(null); }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>Course Attendance</h1>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div>
                    <label>Select Course: </label>
                    <select value={course} onChange={e => setCourse(e.target.value)} style={{ padding: '0.4rem', marginLeft: '0.5rem' }}>
                        <option value="">-- Choose --</option>
                        {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                    </select>
                </div>
                <div>
                    <label>Date: </label>
                    <input type="date" value={date} max={getLocalDate()} onChange={e => setDate(e.target.value)} style={{ padding: '0.4rem', marginLeft: '0.5rem' }} />
                </div>
            </div>

            {!course ? (
                <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>Select a course to mark attendance</p>
            ) : students.length === 0 ? (
                <p>No students enrolled yet.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Student</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Email</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map(e => {
                            const status = marked[e._id];
                            const busy = marking?.startsWith(e._id);
                            return (
                                <tr key={e._id} style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{e.student?.name}</td>
                                    <td style={{ padding: '0.5rem', color: '#666' }}>{e.student?.email}</td>
                                    <td style={{ padding: '0.5rem', fontWeight: 'bold', color: status === 'present' ? 'green' : status === 'absent' ? 'red' : status === 'late' ? 'orange' : '#999' }}>
                                        {status ? status.toUpperCase() : '---'}
                                    </td>
                                    <td style={{ padding: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                                        {[['present', 'green'], ['late', 'orange'], ['absent', 'red']].map(([s, color]) => (
                                            <button key={s} onClick={() => mark(e._id, s)} disabled={!!busy}
                                                style={{ padding: '0.25rem 0.6rem', background: status === s ? color : '#fff', color: status === s ? '#fff' : color, border: `1px solid ${color}`, borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                {s}
                                            </button>
                                        ))}
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default InstructorAttendance;
