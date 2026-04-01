import React, { useState, useEffect } from 'react';
import { blogAPI, UPLOAD_URL } from '../../services/api';
import { FaPlus, FaTrash, FaEdit } from 'react-icons/fa';

const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [form, setForm] = useState({ title: '', category: 'Technology', content: '', tags: '', status: 'published' });

    useEffect(() => { fetchBlogs(); }, []);

    const fetchBlogs = async () => {
        try {
            const res = await blogAPI.getMyBlogs();
            setBlogs(res.data.data || []);
        } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const resetForm = () => {
        setForm({ title: '', category: 'Technology', content: '', tags: '', status: 'published' });
        setThumbnail(null); setEditId(null); setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            const slug = form.title.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
            data.append('title', form.title);
            data.append('category', form.category);
            data.append('content', form.content);
            data.append('tags', form.tags);
            data.append('slug', editId ? slug : `${slug}-${Date.now()}`);
            data.append('excerpt', form.content.slice(0, 180));
            data.append('isPublished', form.status === 'published');
            if (thumbnail) data.append('thumbnail', thumbnail);
            if (editId) await blogAPI.updateBlog(editId, data);
            else await blogAPI.createBlog(data);
            alert(editId ? 'Blog updated!' : 'Blog created!');
            fetchBlogs(); resetForm();
        } catch (err) { alert(err.response?.data?.message || 'Failed to save'); }
    };

    const handleEdit = (b) => {
        setForm({ title: b.title, category: b.category, content: b.content, tags: b.tags.join(', '), status: b.isPublished ? 'published' : 'draft' });
        setEditId(b._id); setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this blog?')) return;
        try { await blogAPI.deleteBlog(id); fetchBlogs(); } catch (err) { alert('Failed to delete'); }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h1 style={{ margin: 0 }}>Manage Blogs</h1>
                <button onClick={() => setShowForm(!showForm)} style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}>
                    {showForm ? 'Cancel' : <><FaPlus /> New Blog</>}
                </button>
            </div>

            {showForm && (
                <form onSubmit={handleSubmit} style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
                    <h3 style={{ marginTop: 0 }}>{editId ? 'Edit' : 'New'} Blog</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                        <div>
                            <label>Title</label><br />
                            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required style={{ width: '100%', padding: '0.4rem' }} />
                        </div>
                        <div>
                            <label>Category</label><br />
                            <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                                {['Technology', 'Education', 'Career', 'Development', 'Design', 'News'].map(c => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label>Status</label><br />
                            <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={{ width: '100%', padding: '0.4rem' }}>
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                            </select>
                        </div>
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label>Tags (comma separated)</label><br />
                        <input type="text" value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="react, node" style={{ width: '100%', padding: '0.4rem' }} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label>Thumbnail</label><br />
                        <input type="file" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
                    </div>
                    <div style={{ marginBottom: '0.75rem' }}>
                        <label>Content</label><br />
                        <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} required rows={6} style={{ width: '100%', padding: '0.4rem' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                        <button type="button" onClick={resetForm} style={{ padding: '0.4rem 1rem' }}>Cancel</button>
                        <button type="submit" style={{ padding: '0.4rem 1rem' }}>{editId ? 'Update' : 'Create'}</button>
                    </div>
                </form>
            )}

            {blogs.length === 0 ? <p>No blogs yet.</p> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Title</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Category</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Views</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '0.5rem', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {blogs.map(b => (
                            <tr key={b._id} style={{ borderBottom: '1px solid #eee' }}>
                                <td style={{ padding: '0.5rem' }}>{b.title}</td>
                                <td style={{ padding: '0.5rem' }}>{b.category}</td>
                                <td style={{ padding: '0.5rem' }}>{b.isPublished ? 'Published' : 'Draft'}</td>
                                <td style={{ padding: '0.5rem' }}>{b.views || 0}</td>
                                <td style={{ padding: '0.5rem' }}>{new Date(b.createdAt).toLocaleDateString()}</td>
                                <td style={{ padding: '0.5rem', display: 'flex', gap: '0.5rem' }}>
                                    <button onClick={() => handleEdit(b)} style={{ cursor: 'pointer' }}><FaEdit /></button>
                                    <button onClick={() => handleDelete(b._id)} style={{ cursor: 'pointer', color: 'red' }}><FaTrash /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ManageBlogs;
