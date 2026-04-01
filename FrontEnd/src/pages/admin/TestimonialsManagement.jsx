import React, { useEffect, useState } from 'react';
import { adminAPI, UPLOAD_URL } from '../../services/api';

const init = { name: '', role: '', comment: '', rating: 5, isActive: true };

const TestimonialsManagement = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(init);
    const [avatar, setAvatar] = useState(null);
    const [editId, setEditId] = useState(null);

    const fetch = async () => { const res = await adminAPI.getTestimonials(); setItems(res.data?.data || []); };
    useEffect(() => { fetch(); }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (avatar) fd.append('avatar', avatar);
        if (editId) await adminAPI.updateTestimonial(editId, fd);
        else await adminAPI.createTestimonial(fd);
        setForm(init); setAvatar(null); setEditId(null); fetch();
    };

    const handleEdit = (t) => {
        setEditId(t._id);
        setForm({ name: t.name || '', role: t.role || '', comment: t.comment || '', rating: t.rating || 5, isActive: t.isActive ?? true });
    };

    return (
        <div style={{ padding: '1.5rem' }}>
            <h1>Testimonials</h1>

            <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '1.5rem' }}>
                <h3 style={{ marginTop: 0 }}>{editId ? 'Edit' : 'Add'} Testimonial</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                    <div><label>Name</label><br /><input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div><label>Role</label><br /><input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div><label>Rating (1-5)</label><br /><input type="number" min="1" max="5" value={form.rating} onChange={e => setForm({ ...form, rating: e.target.value })} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingTop: '1.2rem' }}>
                        <input type="checkbox" id="active" checked={form.isActive} onChange={e => setForm({ ...form, isActive: e.target.checked })} />
                        <label htmlFor="active">Active</label>
                    </div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}><label>Comment</label><br /><textarea value={form.comment} onChange={e => setForm({ ...form, comment: e.target.value })} required rows={3} style={{ width: '100%', padding: '0.4rem', border: '1px solid #ddd', borderRadius: '4px' }} /></div>
                <div style={{ marginBottom: '0.75rem' }}><label>Avatar</label><br /><input type="file" accept="image/*" onChange={e => setAvatar(e.target.files?.[0] || null)} /></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {editId && <button type="button" onClick={() => { setForm(init); setEditId(null); }} style={{ padding: '0.4rem 1rem', cursor: 'pointer' }}>Cancel</button>}
                    <button type="submit" style={{ padding: '0.4rem 1rem', background: '#1e1b4b', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>{editId ? 'Update' : 'Add'}</button>
                </div>
            </form>

            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr style={{ background: '#f0f0f0' }}>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Avatar</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Role</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Rating</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Active</th>
                        <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map(t => (
                        <tr key={t._id} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '0.5rem' }}>
                                {t.avatar ? <img src={`${UPLOAD_URL}/${t.avatar}`} alt={t.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} /> : <span style={{ color: '#999' }}>—</span>}
                            </td>
                            <td style={{ padding: '0.5rem', fontWeight: 'bold' }}>{t.name}</td>
                            <td style={{ padding: '0.5rem', color: '#64748b' }}>{t.role}</td>
                            <td style={{ padding: '0.5rem' }}>{t.rating}/5</td>
                            <td style={{ padding: '0.5rem' }}>{t.isActive ? '✓' : '✗'}</td>
                            <td style={{ padding: '0.5rem', display: 'flex', gap: '0.4rem' }}>
                                <button onClick={() => handleEdit(t)} style={{ padding: '0.2rem 0.6rem', cursor: 'pointer', background: '#dbeafe', color: '#1d4ed8', border: 'none', borderRadius: '4px' }}>Edit</button>
                                <button onClick={() => adminAPI.deleteTestimonial(t._id).then(fetch)} style={{ padding: '0.2rem 0.6rem', cursor: 'pointer', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '4px' }}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TestimonialsManagement;
