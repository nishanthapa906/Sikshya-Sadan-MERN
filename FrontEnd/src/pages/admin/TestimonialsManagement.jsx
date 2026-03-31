import React, { useEffect, useState } from 'react';
import { adminAPI, UPLOAD_URL } from '../../services/api';

const initialForm = { name: '', role: '', comment: '', rating: 5, isActive: true };

const TestimonialsManagement = () => {
    const [items, setItems] = useState([]);
    const [form, setForm] = useState(initialForm);
    const [avatar, setAvatar] = useState(null);
    const [editingId, setEditingId] = useState(null);

    const fetchItems = async () => {
        const res = await adminAPI.getTestimonials();
        setItems(res.data?.data || []);
    };

    useEffect(() => {
        fetchItems();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => fd.append(k, v));
        if (avatar) fd.append('avatar', avatar);

        if (editingId) await adminAPI.updateTestimonial(editingId, fd);
        else await adminAPI.createTestimonial(fd);

        setForm(initialForm);
        setAvatar(null);
        setEditingId(null);
        fetchItems();
    };

    const handleEdit = (t) => {
        setEditingId(t._id);
        setForm({
            name: t.name || '',
            role: t.role || '',
            comment: t.comment || '',
            rating: t.rating || 5,
            isActive: t.isActive ?? true
        });
    };

    const handleDelete = async (id) => {
        await adminAPI.deleteTestimonial(id);
        fetchItems();
    };

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-6">
                <h1 className="text-3xl font-black mb-6">Testimonials</h1>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow mb-8 grid md:grid-cols-2 gap-4">
                    <input className="border rounded-lg p-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
                    <input className="border rounded-lg p-3" placeholder="Role (e.g. MERN Graduate)" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
                    <input className="border rounded-lg p-3" type="number" min="1" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} />
                    <label className="flex items-center gap-2 p-3">
                        <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} />
                        Active
                    </label>
                    <textarea className="border rounded-lg p-3 md:col-span-2" rows="3" placeholder="Comment" value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} required />
                    <input className="border rounded-lg p-3 md:col-span-2" type="file" accept="image/*" onChange={(e) => setAvatar(e.target.files?.[0] || null)} />
                    <button className="bg-slate-900 text-white rounded-lg px-4 py-3 md:col-span-2" type="submit">
                        {editingId ? 'Update Testimonial' : 'Add Testimonial'}
                    </button>
                </form>

                <div className="grid md:grid-cols-2 gap-6">
                    {items.map((t) => (
                        <div key={t._id} className="bg-white rounded-2xl p-5 shadow border">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                                    {t.avatar ? (
                                        <img src={`${UPLOAD_URL}/${t.avatar}`} alt={t.name} className="h-full w-full object-cover" />
                                    ) : null}
                                </div>
                                <div>
                                    <p className="font-bold">{t.name}</p>
                                    <p className="text-sm text-slate-500">{t.role}</p>
                                </div>
                            </div>
                            <p className="text-slate-600 mb-3">"{t.comment}"</p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold">Rating: {t.rating}/5</span>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(t)} className="px-3 py-1 rounded bg-blue-100 text-blue-700">Edit</button>
                                    <button onClick={() => handleDelete(t._id)} className="px-3 py-1 rounded bg-red-100 text-red-700">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TestimonialsManagement;
