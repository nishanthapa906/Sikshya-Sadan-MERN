import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaGraduationCap, FaSearch, FaCheckCircle, FaUserGraduate } from 'react-icons/fa';

const VerifyCompletion = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [courseFilter, setCourseFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [busy, setBusy] = useState(null);
    const [certFiles, setCertFiles] = useState({});

    const load = async () => {
        try {
            setLoading(true);
            const [sr, cr] = await Promise.all([instructorAPI.getMyStudents(), instructorAPI.getMyCourses()]);
            setEnrollments(sr.data.enrollments || []);
            setCourses(cr.data.courses || []);
        } catch (err) { alert('Failed to load'); }
        finally { setLoading(false); }
    };

    useEffect(() => { load(); }, []);

    const markComplete = async (id) => {
        if (!confirm('Mark as completed?')) return;
        try {
            setBusy(id);
            await instructorAPI.updateEnrollment(id, { status: 'completed' });
            setEnrollments(p => p.map(e => e._id === id ? { ...e, status: 'completed' } : e));
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
        finally { setBusy(null); }
    };

    const revoke = async (id) => {
        if (!confirm('Revoke completion?')) return;
        try {
            setBusy(id);
            await instructorAPI.updateEnrollment(id, { status: 'active' });
            setEnrollments(p => p.map(e => e._id === id ? { ...e, status: 'active' } : e));
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
        finally { setBusy(null); }
    };

    const uploadCert = async (id) => {
        const file = certFiles[id];
        if (!file) return alert('Choose a certificate image first');
        try {
            setBusy(`upload-${id}`);
            const fd = new FormData(); fd.append('certificateImage', file);
            await instructorAPI.uploadCertificate(id, fd);
            alert('Certificate uploaded!');
            load(); setCertFiles(p => { const n = { ...p }; delete n[id]; return n; });
        } catch (err) { alert(err.response?.data?.message || 'Failed to upload'); }
        finally { setBusy(null); }
    };

    const attPct = e => {
        const total = e.attendance?.length || 0;
        if (!total) return 0;
        return Math.round((e.attendance.filter(a => a.status === 'present').length / total) * 100);
    };

    const filtered = enrollments.filter(e =>
        (!courseFilter || e.course?._id === courseFilter) &&
        (!statusFilter || e.status === statusFilter) &&
        (!search || e.student?.name?.toLowerCase().includes(search.toLowerCase()) || e.student?.email?.toLowerCase().includes(search.toLowerCase()))
    );

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1><FaGraduationCap /> Certification Center</h1>

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <input type="text" placeholder="Search student..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.4rem 0.75rem', border: '1px solid #ddd', borderRadius: '6px' }} />
                <select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} style={{ padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <option value="">All Courses</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '0.4rem', border: '1px solid #ddd', borderRadius: '6px' }}>
                    <option value="">All Statuses</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                </select>
            </div>

            {filtered.length === 0 ? <p>No students match.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#1e293b', color: '#fff' }}>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Student</th>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Course</th>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Attendance</th>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Payment</th>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '0.6rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filtered.map(e => {
                            const done = e.status === 'completed';
                            const paid = ['completed', 'installment'].includes(e.paymentStatus);
                            const uploading = busy === `upload-${e._id}`;
                            return (
                                <tr key={e._id} style={{ borderBottom: '1px solid #eee', background: done ? '#f0fdf4' : '#fff' }}>
                                    <td style={{ padding: '0.6rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{e.student?.name}</div>
                                        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{e.student?.email}</div>
                                    </td>
                                    <td style={{ padding: '0.6rem', fontSize: '0.85rem' }}>{e.course?.title}</td>
                                    <td style={{ padding: '0.6rem' }}>{attPct(e)}% ({e.attendance?.length || 0} classes)</td>
                                    <td style={{ padding: '0.6rem' }}>
                                        <span style={{ color: paid ? 'green' : 'red', fontWeight: 'bold', fontSize: '0.8rem' }}>{e.paymentStatus}</span>
                                    </td>
                                    <td style={{ padding: '0.6rem' }}>
                                        {done ? <span style={{ color: 'green', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.3rem' }}><FaCheckCircle /> Done</span> : <span style={{ color: '#f59e0b', fontWeight: 'bold' }}>Active</span>}
                                        {e.certificateIssued && <div style={{ fontSize: '0.7rem', color: '#6366f1' }}>🎓 Cert Issued</div>}
                                    </td>
                                    <td style={{ padding: '0.6rem' }}>
                                        {done ? (
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                                {!e.certificateIssued && (
                                                    <button onClick={() => revoke(e._id)} disabled={busy === e._id} style={{ padding: '0.2rem 0.6rem', cursor: 'pointer', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }}>Revoke</button>
                                                )}
                                                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                                                    <input type="file" accept="image/*" onChange={ev => setCertFiles(p => ({ ...p, [e._id]: ev.target.files?.[0] || null }))} style={{ fontSize: '0.7rem', maxWidth: '140px' }} />
                                                    <button onClick={() => uploadCert(e._id)} disabled={uploading || !certFiles[e._id]} style={{ padding: '0.2rem 0.6rem', cursor: 'pointer', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '0.75rem' }}>
                                                        {uploading ? '...' : e.certificateIssued ? 'Replace' : 'Upload Cert'}
                                                    </button>
                                                </div>
                                                {e.certificateUrl && <a href={`${UPLOAD_URL}/${e.certificateUrl}`} target="_blank" rel="noreferrer" style={{ fontSize: '0.7rem', color: '#6366f1' }}>View</a>}
                                            </div>
                                        ) : (
                                            <button onClick={() => markComplete(e._id)} disabled={busy === e._id || !paid} title={!paid ? 'Payment must be completed first' : ''} style={{ padding: '0.3rem 0.75rem', cursor: paid ? 'pointer' : 'not-allowed', background: paid ? '#1e1b4b' : '#e2e8f0', color: paid ? '#fff' : '#94a3b8', border: 'none', borderRadius: '4px', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem' }}>
                                                <FaUserGraduate /> {busy === e._id ? '...' : 'Verify'}
                                            </button>
                                        )}
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

export default VerifyCompletion;
