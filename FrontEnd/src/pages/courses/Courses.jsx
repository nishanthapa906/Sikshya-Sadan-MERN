import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { courseAPI, UPLOAD_URL } from '../../services/api';

const Courses = () => {
    const [params, setParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [cats, setCats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: params.get('search') || '', category: params.get('category') || '',
        skillLevel: params.get('skillLevel') || '', sort: params.get('sort') || 'newest'
    });

    useEffect(() => {
        setLoading(true);
        courseAPI.getAllCourses(filters)
            .then(res => { setCourses(res.data.courses); setCats(res.data.categories || []); })
            .catch(() => alert('Failed to load courses'))
            .finally(() => setLoading(false));
            
        const clean = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
        setParams(clean);
    }, [filters, setParams]);

    const setF = (k, v) => setFilters(p => ({ ...p, [k]: v }));

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold min-h-[50vh]">Loading courses...</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 px-6 font-sans">
            <h1 className="text-4xl font-black text-slate-800 text-center mb-10">Explore Our Courses</h1>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 mb-10 flex flex-col md:flex-row gap-4 items-center justify-between">
                <input placeholder="Search courses..." value={filters.search} onChange={e => setF('search', e.target.value)} className="w-full md:w-auto flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" />
                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 flex-[2] justify-end">
                    <select value={filters.category} onChange={e => setF('category', e.target.value)} className="w-full sm:w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                        <option value="">All Categories</option>
                        {cats.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <select value={filters.skillLevel} onChange={e => setF('skillLevel', e.target.value)} className="w-full sm:w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                        <option value="">All Levels</option><option value="Beginner">Beginner</option><option value="Intermediate">Intermediate</option><option value="Advanced">Advanced</option>
                    </select>
                    <select value={filters.sort} onChange={e => setF('sort', e.target.value)} className="w-full sm:w-1/3 p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                        <option value="newest">Newest</option><option value="price-low">Price: Low</option><option value="price-high">Price: High</option><option value="rating">Top Rated</option>
                    </select>
                </div>
            </div>

            {courses.length === 0 ? <p className="text-center text-slate-500 font-bold p-10 bg-white rounded-2xl border border-slate-200">No courses match your filters.</p> : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map(c => (
                        <div key={c._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col group">
                            <div className="relative overflow-hidden h-48 bg-slate-100">
                                <img src={`${UPLOAD_URL}/${c.thumbnail}`} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full">{c.category}</div>
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-slate-800 mb-2 line-clamp-2">{c.title}</h3>
                                <div className="text-slate-500 text-sm font-medium mb-4 flex items-center justify-between">
                                    <span>{c.skillLevel}</span>
                                    {c.rating && <span className="flex items-center gap-1 text-yellow-500 font-bold">★ {c.rating}</span>}
                                </div>
                                <div className="flex justify-between items-end mt-auto pt-6 border-t border-slate-100">
                                    <div>
                                        <div className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Fee</div>
                                        <span className="font-black text-2xl text-emerald-500">Rs. {c.fee}</span>
                                    </div>
                                    <Link to={`/courses/${c._id}`} className="bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-colors">Details</Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Courses;
