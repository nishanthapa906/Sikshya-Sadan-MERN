import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FaCalendarAlt, FaUser, FaTag, FaChevronLeft, FaEye, FaFacebook, FaTwitter, FaLinkedin, FaQuoteRight } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../../services/api';

const BlogDetail = () => {
    const { slug } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBlog = async () => {
            try {
                const res = await publicAPI.getBlogBySlug(slug);
                setBlog(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchBlog();
        window.scrollTo(0, 0);
    }, [slug]);

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div></div>;
    if (!blog) return <div className="text-center py-20 font-black text-2xl">Article Not Found</div>;

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* HERO BAR */}
            <div className="bg-white border-b border-slate-100 pt-24 pb-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
                <div className="container mx-auto px-6 flex items-center justify-between">
                    <Link to="/blog" className="flex items-center gap-2 text-slate-400 hover:text-primary-600 font-bold transition-colors">
                        <FaChevronLeft /> Back to Insights
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="hidden md:flex items-center gap-2 text-slate-400 font-bold text-sm">
                            <FaEye className="text-primary-500" /> {blog.views} Views
                        </div>
                        <div className="h-6 w-px bg-slate-200 hidden md:block"></div>
                        <div className="flex gap-4">
                            <button className="text-slate-400 hover:text-blue-600 transition-colors"><FaFacebook size={20} /></button>
                            <button className="text-slate-400 hover:text-sky-400 transition-colors"><FaTwitter size={20} /></button>
                            <button className="text-slate-400 hover:text-indigo-600 transition-colors"><FaLinkedin size={20} /></button>
                        </div>
                    </div>
                </div>
            </div>

            <article className="pb-24">
                {/* HEADER */}
                <header className="container mx-auto px-6 max-w-4xl pt-16 text-center">
                    <span className="px-5 py-2 rounded-full bg-primary-50 text-primary-600 text-xs font-black uppercase tracking-widest mb-8 inline-block animate-bounce">
                        {blog.category}
                    </span>
                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-10 leading-tight italic">
                        {blog.title}
                    </h1>
                    <div className="flex flex-wrap items-center justify-center gap-10 mb-16 grayscale">
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-bold text-lg shadow-xl">
                                {blog.author?.name?.charAt(0)}
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Authored By</p>
                                <p className="font-bold text-slate-800">{blog.author?.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="h-12 w-12 rounded-2xl bg-primary-100 text-primary-600 flex items-center justify-center text-lg">
                                <FaCalendarAlt />
                            </div>
                            <div className="text-left leading-tight">
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Published On</p>
                                <p className="font-bold text-slate-800">{new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
                            </div>
                        </div>
                    </div>
                </header>

                {/* FEATURED IMAGE */}
                <div className="container mx-auto px-6 max-w-6xl mb-16">
                    <div className="rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200 aspect-video relative group">
                        <img
                            src={blog.thumbnail ? `${UPLOAD_URL}/${blog.thumbnail}` : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
                            className="h-full w-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                            alt={blog.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent"></div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="container mx-auto px-6 max-w-3xl">
                    <div
                        className="prose prose-xl prose-slate max-w-none prose-headings:font-black prose-headings:italic prose-a:text-primary-600 prose-img:rounded-3xl prose-blockquote:border-primary-600 prose-blockquote:bg-slate-50 prose-blockquote:p-8 prose-blockquote:rounded-3xl prose-blockquote:italic prose-blockquote:not-italic"
                        dangerouslySetInnerHTML={{ __html: blog.content }}
                    />

                    {/* TAGS */}
                    <div className="mt-20 pt-10 border-t border-slate-100 flex flex-wrap gap-4">
                        {blog.tags?.map(tag => (
                            <span key={tag} className="px-6 py-2 bg-slate-100 text-slate-500 rounded-full text-sm font-black uppercase tracking-tighter hover:bg-primary-600 hover:text-white cursor-pointer transition-colors">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    {/* AUTHOR CARD */}
                    <div className="mt-20 bg-white p-12 rounded-[3.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row gap-10 items-center">
                        <div className="h-32 w-32 rounded-[2.5rem] bg-indigo-900 border-4 border-white shadow-2xl flex-shrink-0 flex items-center justify-center text-4xl text-white font-black">
                            {blog.author?.name?.charAt(0)}
                        </div>
                        <div className="space-y-4 text-center md:text-left">
                            <h3 className="text-2xl font-black text-slate-900 italic">About {blog.author?.name}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">
                                {blog.author?.bio || `${blog.author?.name} is a regular contributor to our knowledge base, specializing in modern development stacks and career guidance.`}
                            </p>
                            <div className="flex justify-center md:justify-start gap-4 text-primary-600 font-black uppercase text-sm tracking-widest cursor-pointer hover:gap-6 transition-all">
                                Follow Author ➞
                            </div>
                        </div>
                    </div>
                </div>
            </article>

            {/* NEWSLETTER MINI */}
            <section className="container mx-auto px-6 max-w-4xl pb-24">
                <div className="bg-primary-600 rounded-[3rem] p-12 text-white flex flex-col md:flex-row items-center justify-between gap-10 shadow-2xl shadow-primary-200">
                    <div className="space-y-2">
                        <h3 className="text-2xl font-black italic">Stay updated with IT trends</h3>
                        <p className="font-light opacity-80">Get the best of our articles delivered to your inbox.</p>
                    </div>
                    <div className="flex w-full md:w-auto gap-4">
                        <input type="email" placeholder="Your email..." className="px-6 py-4 rounded-2xl bg-white/10 border border-white/20 text-white placeholder:text-white/50 outline-none w-full md:w-64" />
                        <button className="bg-white text-primary-600 px-8 py-4 rounded-2xl font-black shadow-lg">Join</button>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default BlogDetail;
