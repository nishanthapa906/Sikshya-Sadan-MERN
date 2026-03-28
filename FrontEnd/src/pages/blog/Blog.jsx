import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaCalendarAlt, FaUser, FaTag, FaArrowRight, FaEye, FaChevronRight } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../../services/api';

const Blog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);

    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const fetchBlogs = async () => {
            setLoading(true);
            try {
                const [blogRes, metaRes] = await Promise.all([
                    publicAPI.getAllBlogs({ category, search }),
                    publicAPI.getBlogMeta()
                ]);
                setBlogs(blogRes.data.data.blogs || []);
                setMeta(metaRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogs();
    }, [category, search]);

    if (loading) return <div className="h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div></div>;

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                {/* HEADER */}
                <div className="max-w-3xl mx-auto mb-14">
                    <h1 className="text-3xl font-bold text-slate-900 mb-3">Blog</h1>
                    <p className="text-slate-500">
                        Latest articles, tech tips, and learning guides from our instructors.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-16">
                    {/* BLOG LIST */}
                    <div className="lg:w-2/3 space-y-16">
                        {blogs.length > 0 ? (
                            blogs.map(blog => (
                                <article key={blog._id} className="group relative">
                                    <div className="flex flex-col md:flex-row gap-10 items-center">
                                        <div className="md:w-1/2 overflow-hidden rounded-[2.5rem] shadow-2xl aspect-[4/3]">
                                            <img
                                                src={blog.thumbnail ? `${UPLOAD_URL}/${blog.thumbnail}` : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                alt={blog.title}
                                            />
                                        </div>
                                        <div className="md:w-1/2 space-y-4">
                                            <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-primary-600">
                                                <span>{blog.category}</span>
                                                <span className="h-1 w-1 bg-slate-300 rounded-full"></span>
                                                <span className="text-slate-400">{new Date(blog.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h2 className="text-3xl font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                                                <Link to={`/blog/${blog.slug}`}>{blog.title}</Link>
                                            </h2>
                                            <p className="text-slate-500 font-medium leading-relaxed line-clamp-3">
                                                {blog.content.replace(/<[^>]*>?/gm, '').substring(0, 160)}...
                                            </p>
                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary-600 text-xs shadow-inner">
                                                        {blog.author?.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-700">{blog.author?.name}</span>
                                                </div>
                                                <Link to={`/blog/${blog.slug}`} className="p-3 bg-slate-900 text-white rounded-2xl group-hover:bg-primary-600 transition-all shadow-xl">
                                                    <FaArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                    {/* Decoration */}
                                    <div className="absolute -left-4 top-1/2 -translate-y-1/2 h-2/3 w-1 bg-primary-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                </article>
                            ))
                        ) : (
                            <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaSearch size={16} className="text-slate-300" />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900">No posts found</h3>
                                <p className="text-slate-500 mt-1 text-sm">Try different keywords or categories.</p>
                            </div>
                        )}
                    </div>

                    {/* SIDEBAR */}
                    <div className="lg:w-1/3 space-y-12">
                        {/* SEARCH */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <FaSearch size={13} className="text-slate-400" /> Search
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 ring-primary-100 transition-all outline-none font-bold text-slate-800"
                                    onKeyPress={(e) => e.key === 'Enter' && setSearchParams({ search: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* CATEGORIES */}
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 mb-5">Categories</h3>
                            <div className="space-y-4">
                                <button
                                    onClick={() => setSearchParams({})}
                                    className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${!category ? 'bg-primary-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                >
                                    <span>All Posts</span>
                                    <FaChevronRight size={12} />
                                </button>
                                {meta?.categories?.map(cat => (
                                    <button
                                        key={cat._id}
                                        onClick={() => setSearchParams({ category: cat._id })}
                                        className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all ${category === cat._id ? 'bg-primary-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        <span className="capitalize">{cat._id}</span>
                                        <span className={`px-2 py-1 rounded-lg text-[10px] ${category === cat._id ? 'bg-white/20' : 'bg-white text-slate-400'}`}>{cat.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* POPULAR POSTS */}
                        <div className="bg-slate-900 p-10 rounded-[3rem] shadow-2xl text-white">
                            <h3 className="text-base font-bold mb-5 text-slate-200">Popular Posts</h3>
                            <div className="space-y-8">
                                {meta?.popular?.map(post => (
                                    <Link key={post._id} to={`/blog/${post.slug}`} className="flex gap-4 group">
                                        <div className="h-16 w-16 rounded-2xl bg-white/10 flex-shrink-0 overflow-hidden">
                                            <img src={`${UPLOAD_URL}/${post.thumbnail}`} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" alt={post.title} />
                                        </div>
                                        <div className="space-y-1">
                                            <h4 className="text-sm font-bold leading-tight group-hover:text-primary-400 transition-colors line-clamp-2">{post.title}</h4>
                                            <div className="flex items-center gap-3 text-[10px] text-slate-500 font-black uppercase">
                                                <span className="flex items-center gap-1"><FaEye /> {post.views}</span>
                                                <span>•</span>
                                                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
