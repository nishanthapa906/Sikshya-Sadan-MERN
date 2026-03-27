import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaClock, FaStar, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { courseAPI, UPLOAD_URL } from '../services/api';

const Courses = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [courses, setCourses] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states from URL or default
    const [filters, setFilters] = useState({
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        skillLevel: searchParams.get('skillLevel') || '',
        sort: searchParams.get('sort') || 'newest',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || ''
    });

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await courseAPI.getAllCourses(filters);
                setCourses(res.data.courses);
                if (res.data.categories) setCategories(res.data.categories);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
        // Update URL
        const cleanFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ''));
        setSearchParams(cleanFilters);
    }, [filters, setSearchParams]);

    const handleFilterChange = (name, value) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-20 pb-24">
            <div className="container mx-auto px-6">
                {/* PAGE HEADER */}
                <div className="mb-12 text-center max-w-3xl mx-auto">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 italic">Master Modern Skills</h1>
                    <p className="text-slate-600 text-lg">
                        Select from our professional career tracks and gain the skills companies are looking for.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-10">
                    {/* SIDEBAR FILTERS - DESKTOP */}
                    <div className="lg:w-1/4 space-y-8">
                        {/* SEARCH */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FaSearch className="text-primary-600" /> Search
                            </h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Course name..."
                                    className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-primary-100"
                                    value={filters.search}
                                    onChange={(e) => handleFilterChange('search', e.target.value)}
                                />
                            </div>
                        </div>

                        {/* CATEGORIES */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FaFilter className="text-primary-600" /> Categories
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 group cursor-pointer">
                                    <input
                                        type="radio"
                                        name="category"
                                        className="w-5 h-5 text-primary-600 border-slate-300 focus:ring-primary-500"
                                        checked={filters.category === ''}
                                        onChange={() => handleFilterChange('category', '')}
                                    />
                                    <span className={`font-medium ${filters.category === '' ? 'text-primary-600' : 'text-slate-600'}`}>All Courses</span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center gap-3 group cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            className="w-5 h-5 text-primary-600 border-slate-300 focus:ring-primary-500"
                                            checked={filters.category === cat}
                                            onChange={() => handleFilterChange('category', cat)}
                                        />
                                        <span className={`font-medium ${filters.category === cat ? 'text-primary-600' : 'text-slate-600'}`}>{cat}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* SKILL LEVEL */}
                        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
                            <h3 className="text-lg font-bold mb-4">Level</h3>
                            <select
                                className="w-full bg-slate-50 border-0 rounded-xl px-4 py-3 outline-none appearance-none"
                                value={filters.skillLevel}
                                onChange={(e) => handleFilterChange('skillLevel', e.target.value)}
                            >
                                <option value="">All Levels</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>

                    {/* MAIN CONTENT */}
                    <div className="lg:w-3/4">
                        {/* SORT & RESULT INFO */}
                        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                            <p className="text-slate-500 font-medium">
                                Showing <span className="text-slate-900 font-bold">{courses.length}</span> results
                            </p>
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">Sort By:</span>
                                <select
                                    className="bg-slate-50 border-0 rounded-xl px-4 py-2 text-sm font-bold outline-none"
                                    value={filters.sort}
                                    onChange={(e) => handleFilterChange('sort', e.target.value)}
                                >
                                    <option value="newest">Newest First</option>
                                    <option value="price-low">Price: Low to High</option>
                                    <option value="price-high">Price: High to Low</option>
                                    <option value="rating">Top Rated</option>
                                </select>
                            </div>
                        </div>

                        {/* COURSE GRID */}
                        {loading ? (
                            <div className="grid md:grid-cols-2 gap-8 animate-pulse">
                                {[...Array(4)].map((_, i) => (
                                    <div key={i} className="h-96 bg-white rounded-3xl border border-slate-100"></div>
                                ))}
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid md:grid-cols-2 gap-8">
                                {courses.map(course => (
                                    <div key={course._id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 group">
                                        <div className="relative h-56 overflow-hidden">
                                            <img
                                                src={`${UPLOAD_URL}/${course.thumbnail}`}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-primary-900 uppercase shadow-lg">
                                                {course.category}
                                            </div>
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6 h-1/2 flex items-end">
                                                <div className="flex items-center gap-3 text-white">
                                                    <div className="h-10 w-10 rounded-full border-2 border-white/50 bg-slate-900 flex items-center justify-center font-bold overflow-hidden">
                                                        {course.instructor?.photo ? <img src={`${UPLOAD_URL}/${course.instructor.photo}`} alt={course.instructor?.name} className="object-cover h-full w-full" /> : course.instructor?.name?.charAt(0)}
                                                    </div>
                                                    <span className="text-sm font-bold">{course.instructor?.name}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-6">
                                            <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest text-primary-600">
                                                <span className="flex items-center gap-1.5"><FaGraduationCap /> {course.skillLevel}</span>
                                                <span className="flex items-center gap-1.5"><FaClock /> {course.duration || '8 Weeks'}</span>
                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 leading-tight group-hover:text-primary-600 transition-colors">
                                                <Link to={`/courses/${course._id}`}>{course.title}</Link>
                                            </h3>
                                            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex text-amber-500">
                                                        {[...Array(5)].map((_, i) => <FaStar key={i} />)}
                                                    </div>
                                                    <span className="text-sm font-bold text-slate-400">({course.reviews?.length || 0})</span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">Fee Amount</p>
                                                    <p className="text-xl font-black text-primary-900">Rs. {course.fee}</p>
                                                </div>
                                            </div>
                                            <Link to={`/courses/${course._id}`} className="w-full py-4 bg-slate-900 group-hover:bg-primary-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl shadow-slate-200">
                                                View Curriculum <FaArrowRight />
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                                <div className="text-6xl mb-6">🔍</div>
                                <h3 className="text-2xl font-black text-slate-900">No courses match your criteria</h3>
                                <p className="text-slate-500 mt-2">Try adjusting your filters or search keywords.</p>
                                <button
                                    onClick={() => setFilters({ search: '', category: '', skillLevel: '', sort: 'newest', minPrice: '', maxPrice: '' })}
                                    className="mt-8 px-8 py-3 bg-primary-600 text-white rounded-xl font-bold"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Courses;
