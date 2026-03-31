import React, { useState, useEffect } from 'react';
import { blogAPI, UPLOAD_URL } from '../../services/api';
import { FaPlus, FaTrash, FaEdit, FaImage, FaArrowRight, FaEye, FaTag, FaNewspaper } from 'react-icons/fa';


const ManageBlogs = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        category: 'Technology',
        content: '',
        tags: '',
        status: 'published'
    });

    useEffect(() => {
        fetchBlogs();
    }, []);

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await blogAPI.getMyBlogs();
            setBlogs(response.data.data || []);
        } catch (err) {
            console.error('Failed to fetch blogs:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            category: 'Technology',
            content: '',
            tags: '',
            status: 'published'
        });
        setThumbnail(null);
        setPreviewUrl(null);
        setIsEditing(false);
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            const slug = formData.title
                .toLowerCase()
                .trim()
                .replace(/[^a-z0-9\s-]/g, '')
                .replace(/\s+/g, '-')
                .replace(/-+/g, '-');

            data.append('title', formData.title);
            data.append('category', formData.category);
            data.append('content', formData.content);
            data.append('tags', formData.tags);
            data.append('slug', isEditing ? slug || `blog-${editingId}` : `${slug}-${Date.now()}`);
            data.append('excerpt', formData.content.slice(0, 180));
            data.append('isPublished', formData.status === 'published');

            if (thumbnail) {
                data.append('thumbnail', thumbnail);
            }

            if (isEditing) {
                await blogAPI.updateBlog(editingId, data);
                alert('Blog updated successfully!');
            } else {
                await blogAPI.createBlog(data);
                alert('Blog created successfully!');
            }
            fetchBlogs();
            resetForm();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save blog');
        }
    };

    const handleEdit = (blog) => {
        setFormData({
            title: blog.title,
            category: blog.category,
            content: blog.content,
            tags: blog.tags.join(', '),
            status: blog.isPublished ? 'published' : 'draft'
        });
        setPreviewUrl(blog.thumbnail ? `${UPLOAD_URL}/${blog.thumbnail}` : null);
        setIsEditing(true);
        setEditingId(blog._id);
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this blog?')) return;
        try {
            await blogAPI.deleteBlog(id);
            alert('Blog deleted successfully');
            fetchBlogs();
        } catch (err) {
            alert('Failed to delete blog');
        }
    };

    if (loading) return (
        <div className="instructor-portal min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="instructor-portal min-h-screen bg-slate-50 pb-24">
            <div className="portal-header flex justify-between items-center mb-12 p-8 bg-white shadow-sm border-b border-slate-100">
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic text-slate-900 leading-tight">Content Management</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Publish and manage your industrial insights</p>
                </div>
                <button
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${showForm ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-900 text-white hover:bg-primary-600'}`}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Abort Mission' : <><FaPlus /> Create New Article</>}
                </button>
            </div>

            <div className="container mx-auto px-8">
                {showForm && (
                    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden mb-16 animate-fadeIn">
                        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                            <h2 className="text-2xl font-black italic">{isEditing ? 'Revise Article' : 'Draft New Insight'}</h2>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Knowledge Hub Controller</span>
                        </div>

                        <form onSubmit={handleSubmit} className="p-12 space-y-12">
                            <div className="grid lg:grid-cols-2 gap-12">
                                <div className="space-y-8">
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Article Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 transition-all"
                                            placeholder="The Future of MERN Development"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                            <select
                                                name="category"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 appearance-none"
                                                value={formData.category}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Technology">Technology</option>
                                                <option value="Education">Education</option>
                                                <option value="Career">Career</option>
                                                <option value="Development">Development</option>
                                                <option value="Design">Design</option>
                                                <option value="News">News</option>
                                            </select>
                                        </div>
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Status</label>
                                            <select
                                                name="status"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 appearance-none"
                                                value={formData.status}
                                                onChange={handleInputChange}
                                            >
                                                <option value="published">Published</option>
                                                <option value="draft">Draft</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            name="tags"
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 transition-all"
                                            placeholder="react, logic, industry"
                                            value={formData.tags}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Featured Image</label>
                                        <div className="relative group border-4 border-dashed border-slate-100 rounded-[2.5rem] h-[16.5rem] flex flex-col items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:border-primary-200 transition-all">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <FaImage size={48} className="text-slate-200 mx-auto mb-4" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Upload Header Banner</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Article Content (HTML/Text)</label>
                                <textarea
                                    name="content"
                                    className="w-full bg-slate-50 border-0 rounded-[2rem] px-8 py-8 focus:ring-4 ring-primary-100 outline-none font-medium text-slate-600 leading-relaxed min-h-[400px]"
                                    placeholder="Write your insightful thoughts here..."
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="flex gap-4">
                                <button type="submit" className="flex-1 py-6 bg-primary-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-primary-200 hover:bg-slate-900 transition-all transform active:scale-[0.98] flex items-center justify-center gap-4">
                                    {isEditing ? 'Update & Repost' : 'Deploy Article'} <FaArrowRight />
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="px-12 py-6 bg-slate-100 text-slate-400 rounded-[2.5rem] font-black text-sm uppercase hover:text-red-500 transition-all"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {blogs.length === 0 ? (
                        <div className="card text-center py-20 bg-slate-50 border-dashed border-2 border-slate-200" style={{ gridColumn: '1/-1' }}>
                            <p className="text-slate-400 font-bold">No articles published yet.</p>
                        </div>
                    ) : (
                        blogs.map(blog => (
                            <div key={blog._id} className="bg-white rounded-[3.5rem] shadow-xl border border-slate-100 overflow-hidden group hover:shadow-2xl transition-all">
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={blog.thumbnail ? `${UPLOAD_URL}/${blog.thumbnail}` : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                        alt={blog.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600">
                                            {blog.category}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${blog.isPublished ? 'bg-emerald-500 text-white' : 'bg-amber-400 text-white'}`}>
                                            {blog.isPublished ? 'published' : 'draft'}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <h3 className="text-xl font-black text-slate-900 mb-4 italic leading-tight group-hover:text-primary-600 transition-colors">{blog.title}</h3>
                                    <div className="flex items-center gap-6 text-[10px] font-black uppercase text-slate-400 mb-8">
                                        <span className="flex items-center gap-2"><FaEye /> {blog.views} Views</span>
                                        <span className="flex items-center gap-2"><FaTag /> {blog.tags?.length || 0} Tags</span>
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-slate-50">
                                        <span className="text-[10px] font-black text-slate-300 uppercase">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEdit(blog)}
                                                className="h-10 w-10 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 hover:bg-primary-50 hover:text-primary-600 transition-all"
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(blog._id)}
                                                className="h-10 w-10 bg-red-50 flex items-center justify-center rounded-xl text-red-300 hover:bg-red-500 hover:text-white transition-all"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageBlogs;
