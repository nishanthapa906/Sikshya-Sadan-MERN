import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaSearch, FaArrowRight } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../../services/api';

const Blog = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [blogs, setBlogs] = useState([]);
    const [meta, setMeta] = useState(null);
    const [loading, setLoading] = useState(true);
    const category = searchParams.get('category') || '';
    const search = searchParams.get('search') || '';

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const [blogRes, metaRes] = await Promise.all([
                    publicAPI.getAllBlogs({ category, search }),
                    publicAPI.getBlogMeta()
                ]);
                setBlogs(blogRes.data.data.blogs || []);
                setMeta(metaRes.data.data);
            } catch (err) { console.error(err); } finally { setLoading(false); }
        };
        load();
    }, [category, search]);

    if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>;

    return (
        <div style={{ padding: '1.5rem', maxWidth: '1100px', margin: '0 auto' }}>
            <h1>Blog</h1>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
                {/* Blog List */}
                <div style={{ flex: 2 }}>
                    {blogs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '2rem', background: '#f9f9f9', borderRadius: '8px' }}>
                            <FaSearch /> <p>No posts found.</p>
                        </div>
                    ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <tbody>
                                {blogs.map(b => (
                                    <tr key={b._id} style={{ borderBottom: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0' }}>
                                        <td>
                                            {b.thumbnail && <img src={`${UPLOAD_URL}/${b.thumbnail}`} alt={b.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '6px' }} />}
                                        </td>
                                        <td style={{ flex: 1 }}>
                                            <span style={{ fontSize: '0.75rem', color: '#666' }}>{b.category} · {new Date(b.createdAt).toLocaleDateString()}</span>
                                            <h3 style={{ margin: '0.25rem 0' }}><Link to={`/blog/${b.slug}`}>{b.title}</Link></h3>
                                            <p style={{ fontSize: '0.85rem', color: '#555', margin: 0 }}>{b.content?.replace(/<[^>]*>?/gm, '').substring(0, 120)}...</p>
                                            <small>By {b.author?.name}</small>
                                        </td>
                                        <td>
                                            <Link to={`/blog/${b.slug}`}><FaArrowRight /></Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                {/* Sidebar */}
                <div style={{ flex: 1 }}>
                    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                        <h3 style={{ marginTop: 0 }}><FaSearch /> Search</h3>
                        <input type="text" placeholder="Search articles..." style={{ width: '100%', padding: '0.4rem', boxSizing: 'border-box' }}
                            onKeyPress={e => e.key === 'Enter' && setSearchParams({ search: e.target.value })} />
                    </div>

                    <div style={{ background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
                        <h3 style={{ marginTop: 0 }}>Categories</h3>
                        <div>
                            <button onClick={() => setSearchParams({})} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem', marginBottom: '0.25rem', background: !category ? '#333' : '#fff', color: !category ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>All Posts</button>
                            {meta?.categories?.map(cat => (
                                <button key={cat} onClick={() => setSearchParams({ category: cat })} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.4rem', marginBottom: '0.25rem', background: category === cat ? '#333' : '#fff', color: category === cat ? '#fff' : '#333', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer' }}>
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Blog;
