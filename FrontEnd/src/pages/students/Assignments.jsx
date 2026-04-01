import React, { useState, useEffect } from 'react';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaCalendarAlt, FaStar, FaPaperPlane, FaFileUpload, FaCheckCircle, FaPaperclip } from 'react-icons/fa';

const Assignments = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');
    const [selected, setSelected] = useState(null);
    const [file, setFile] = useState(null);
    const [text, setText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        studentAPI.getMyAssignments()
            .then(res => setAssignments(res.data.data || []))
            .catch(e => setErr(e.response?.data?.message || 'Failed to load'))
            .finally(() => setLoading(false));
    }, []);

    const handleSubmit = async (id) => {
        if (!text.trim() && !file) return alert('Add text or file');
        try {
            setSubmitting(true);
            const fd = new FormData();
            fd.append('submissionText', text);
            if (file) fd.append('file', file);
            await studentAPI.submitAssignment(id, fd);
            alert('Submitted!');
            setSelected(null); setText(''); setFile(null);
            studentAPI.getMyAssignments().then(res => setAssignments(res.data.data || []));
        } catch (e) { alert(e.response?.data?.message || 'Failed to submit'); }
        finally { setSubmitting(false); }
    };

    const badge = (a) => {
        if (a.submission?.grade != null) return <span style={{ color: 'green', fontWeight: 'bold' }}>Graded: {a.submission.grade}%</span>;
        if (a.submission) return <span style={{ color: 'orange', fontWeight: 'bold' }}>Submitted</span>;
        if (new Date(a.dueDate) < new Date()) return <span style={{ color: 'red', fontWeight: 'bold' }}>Overdue</span>;
        return <span style={{ color: '#6366f1', fontWeight: 'bold' }}>Pending</span>;
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>My Assignments</h1>
            {err && <p style={{ color: 'red' }}>{err}</p>}
            {assignments.length === 0 ? (
                <p style={{ textAlign: 'center', color: '#888', padding: '2rem' }}>No assignments found.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Assignment</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}><FaCalendarAlt /> Due Date</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}><FaStar /> Points</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assignments.map(a => (
                            <React.Fragment key={a._id}>
                                <tr style={{ borderBottom: '1px solid #eee' }}>
                                    <td style={{ padding: '0.6rem' }}>
                                        <div style={{ fontWeight: 'bold' }}>{a.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{a.course?.title}</div>
                                        {a.attachments?.length > 0 && a.attachments.map((f, i) => (
                                            <a key={i} href={f.url ? `${UPLOAD_URL}${f.url}` : '#'} target="_blank" rel="noreferrer" style={{ fontSize: '0.75rem', color: '#6366f1', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginRight: '0.5rem' }}>
                                                <FaPaperclip /> {f.filename}
                                            </a>
                                        ))}
                                    </td>
                                    <td style={{ padding: '0.6rem' }}>{new Date(a.dueDate).toLocaleDateString()}</td>
                                    <td style={{ padding: '0.6rem' }}>{a.maxMarks || 100}</td>
                                    <td style={{ padding: '0.6rem' }}>{badge(a)}</td>
                                    <td style={{ padding: '0.6rem' }}>
                                        {!a.submission && (
                                            <button onClick={() => setSelected(selected === a._id ? null : a._id)} style={{ padding: '0.25rem 0.75rem', cursor: 'pointer', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '4px' }}>
                                                {selected === a._id ? 'Cancel' : 'Submit'}
                                            </button>
                                        )}
                                        {a.submission && <FaCheckCircle style={{ color: 'green' }} />}
                                    </td>
                                </tr>
                                {selected === a._id && (
                                    <tr>
                                        <td colSpan={5} style={{ padding: '0.75rem', background: '#f8fafc', borderBottom: '1px solid #eee' }}>
                                            {a.submission?.submissionText && <p style={{ fontStyle: 'italic', color: '#555', marginBottom: '0.5rem' }}>"{a.submission.submissionText}"</p>}
                                            {a.submission?.grade != null && <p style={{ color: 'green', fontWeight: 'bold', marginBottom: '0.5rem' }}>Grade: {a.submission.grade}% — {a.submission.feedback}</p>}
                                            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                                                <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Your answer or GitHub link..." rows={2} style={{ flex: 1, padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px', minWidth: '200px' }} />
                                                <label style={{ cursor: 'pointer', padding: '0.4rem 0.75rem', border: '1px dashed #6366f1', borderRadius: '4px', color: '#6366f1', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FaFileUpload /> {file ? file.name : 'Upload File'}
                                                    <input type="file" style={{ display: 'none' }} onChange={e => setFile(e.target.files[0])} />
                                                </label>
                                                <button onClick={() => handleSubmit(a._id)} disabled={submitting} style={{ padding: '0.4rem 1rem', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                    <FaPaperPlane /> {submitting ? 'Sending...' : 'Submit'}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Assignments;
