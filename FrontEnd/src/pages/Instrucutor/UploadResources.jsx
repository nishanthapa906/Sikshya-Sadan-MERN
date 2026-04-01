import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';

const UploadResources = () => {
    const [courses, setCourses] = useState([]);
    const [course, setCourse] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', type: 'document', file: null });

    useEffect(() => {
        instructorAPI.getMyCourses()
            .then(res => setCourses(res.data.courses || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!course) { setResources([]); return; }
        instructorAPI.getCourseResources(course)
            .then(res => setResources(res.data.data || []))
            .catch(err => console.error(err));
    }, [course]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!course) return alert('Select a course');
        if (!form.file) return alert('Select a file');
        try {
            setUploading(true);
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('description', form.description);
            fd.append('type', form.type);
            fd.append('file', form.file);
            await instructorAPI.uploadResource(course, fd);
            alert('Uploaded!');
            setForm({ title: '', description: '', type: 'document', file: null });
            document.getElementById('res-file').value = '';
            instructorAPI.getCourseResources(course).then(r => setResources(r.data.data || []));
        } catch (err) { alert(err.response?.data?.message || 'Failed to upload'); }
        finally { setUploading(false); }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this resource?')) return;
        try {
            await instructorAPI.deleteResource(id);
            setResources(prev => prev.filter(r => r._id !== id));
        } catch { alert('Failed to delete'); }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>Upload Resources</h1>

            <div style={{ marginBottom: '1rem' }}>
                <label>Select Course: </label>
                <select value={course} onChange={e => setCourse(e.target.value)} style={{ padding: '0.4rem', marginLeft: '0.5rem' }}>
                    <option value="">-- Select a Course --</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
            </div>

            {course && (
                <>
                    <form onSubmit={handleSubmit} style={{ background: '#f9fafb', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
                        <h3 style={{ marginTop: 0 }}>Upload New Resource</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                            <div>
                                <label>Title</label><br />
                                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                            </div>
                            <div>
                                <label>Type</label><br />
                                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }}>
                                    <option value="document">Document (PDF/DOC)</option>
                                    <option value="video">Video</option>
                                    <option value="presentation">Presentation</option>
                                    <option value="code">Source Code</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label>Description</label><br />
                            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} />
                        </div>
                        <div style={{ marginBottom: '0.75rem' }}>
                            <label>File</label><br />
                            <input id="res-file" type="file" onChange={e => setForm({ ...form, file: e.target.files[0] })} required />
                        </div>
                        <button type="submit" disabled={uploading} style={{ padding: '0.4rem 1.25rem', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                            {uploading ? 'Uploading...' : '📤 Upload'}
                        </button>
                    </form>

                    <h3>Uploaded Resources</h3>
                    {resources.length === 0 ? <p>No resources yet.</p> : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ background: '#f0f0f0' }}>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Title</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Type</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Description</th>
                                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {resources.map(r => (
                                    <tr key={r._id} style={{ borderBottom: '1px solid #eee' }}>
                                        <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{r.title}</td>
                                        <td style={{ padding: '0.5rem' }}>{r.type}</td>
                                        <td style={{ padding: '0.5rem', color: '#64748b', fontSize: '0.85rem' }}>{r.description}</td>
                                        <td style={{ padding: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                                            <a href={r.fileUrl ? `${UPLOAD_URL}${r.fileUrl}` : r.url} target="_blank" rel="noreferrer" style={{ padding: '0.2rem 0.6rem', background: '#dbeafe', color: '#1d4ed8', borderRadius: '4px', textDecoration: 'none', fontSize: '0.8rem' }}>View</a>
                                            <button onClick={() => handleDelete(r._id)} style={{ padding: '0.2rem 0.6rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </>
            )}
        </div>
    );
};

export default UploadResources;
