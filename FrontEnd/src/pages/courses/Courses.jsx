import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FaFilter, FaSearch, FaClock, FaStar, FaGraduationCap, FaArrowRight } from 'react-icons/fa';
import { courseAPI, UPLOAD_URL } from '../../services/api';

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
        <div style={{ background: 'var(--gray-50)', minHeight: '100vh', padding: 'var(--spacing-3xl) 0' }}>
            <div className="container">
                {/* PAGE HEADER */}
                <div className="text-center" style={{ maxWidth: '800px', margin: '0 auto var(--spacing-2xl)' }}>
                    <h1 style={{ marginBottom: 'var(--spacing-md)' }}>All Courses</h1>
                    <p style={{ color: 'var(--gray-500)', fontSize: '1.125rem' }}>
                        Browse our IT courses and find the right program for your career goals.
                    </p>
                </div>

                <div className="flex" style={{ flexWrap: 'wrap', gap: 'var(--spacing-xl)' }}>
                    {/* SIDEBAR FILTERS - DESKTOP */}
                    <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {/* SEARCH */}
                        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                            <h5 className="flex items-center" style={{ gap: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
                                <FaSearch style={{ color: 'var(--primary-color)' }} /> Search
                            </h5>
                            <input
                                type="text"
                                placeholder="Course name..."
                                className="form-input"
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                            />
                        </div>

                        {/* CATEGORIES */}
                        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                            <h5 className="flex items-center" style={{ gap: '0.5rem', marginBottom: 'var(--spacing-md)' }}>
                                <FaFilter style={{ color: 'var(--primary-color)' }} /> Categories
                            </h5>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                                <label className="flex items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={filters.category === ''}
                                        onChange={() => handleFilterChange('category', '')}
                                        style={{ accentColor: 'var(--primary-color)' }}
                                    />
                                    <span style={{ fontWeight: filters.category === '' ? 'bold' : 'normal', color: filters.category === '' ? 'var(--primary-color)' : 'var(--gray-700)' }}>
                                        All Courses
                                    </span>
                                </label>
                                {categories.map(cat => (
                                    <label key={cat} className="flex items-center" style={{ gap: '0.5rem', cursor: 'pointer' }}>
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === cat}
                                            onChange={() => handleFilterChange('category', cat)}
                                            style={{ accentColor: 'var(--primary-color)' }}
                                        />
                                        <span style={{ fontWeight: filters.category === cat ? 'bold' : 'normal', color: filters.category === cat ? 'var(--primary-color)' : 'var(--gray-700)' }}>
                                            {cat}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* SKILL LEVEL */}
                        <div className="card" style={{ padding: 'var(--spacing-lg)' }}>
                            <h5 style={{ marginBottom: 'var(--spacing-md)' }}>Level</h5>
                            <select
                                className="form-select"
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
                    <div style={{ flex: '3 1 600px' }}>
                        {/* SORT & RESULT INFO */}
                        <div className="card flex flex-between" style={{ padding: 'var(--spacing-md)', marginBottom: 'var(--spacing-xl)', flexWrap: 'wrap', gap: 'var(--spacing-md)' }}>
                            <p style={{ color: 'var(--gray-600)', margin: 0 }}>
                                Showing <strong style={{ color: 'var(--gray-900)' }}>{courses.length}</strong> results
                            </p>
                            <div className="flex items-center" style={{ gap: 'var(--spacing-sm)' }}>
                                <span style={{ fontSize: '0.875rem', color: 'var(--gray-500)', fontWeight: 'bold', textTransform: 'uppercase' }}>Sort By:</span>
                                <select
                                    className="form-select"
                                    style={{ padding: '0.5rem 1rem', width: 'auto' }}
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
                            <div className="grid grid-3">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="card animate-pulse" style={{ height: '400px', background: 'var(--gray-100)' }}></div>
                                ))}
                            </div>
                        ) : courses.length > 0 ? (
                            <div className="grid grid-3 animate-fadeIn">
                                {courses.map(course => (
                                    <div key={course._id} className="card p-0 flex flex-col" style={{ overflow: 'hidden' }}>
                                        <div style={{ position: 'relative', height: '200px' }}>
                                            <img
                                                src={`${UPLOAD_URL}/${course.thumbnail}`}
                                                alt={course.title}
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                            <div style={{ position: 'absolute', top: '10px', left: '10px' }}>
                                                <span className="badge badge-info">{course.category}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="card-body" style={{ padding: 'var(--spacing-md)', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)', marginBottom: 0 }}>
                                            <div className="flex flex-between" style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', color: 'var(--gray-500)' }}>
                                                <span className="flex items-center" style={{ gap: '0.25rem' }}><FaGraduationCap style={{ color: 'var(--secondary-color)' }} /> {course.skillLevel}</span>
                                                <span className="flex items-center" style={{ gap: '0.25rem' }}><FaClock /> {course.duration || '8 wks'}</span>
                                            </div>
                                            
                                            <h5 style={{ margin: 'var(--spacing-sm) 0' }}>
                                                <Link to={`/courses/${course._id}`} style={{ color: 'var(--gray-900)' }}>{course.title}</Link>
                                            </h5>
                                            
                                            <div className="flex items-center" style={{ gap: '0.5rem' }}>
                                                <div style={{ height: '30px', width: '30px', flexShrink: 0, borderRadius: '50%', overflow: 'hidden', background: 'var(--gray-200)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                                                    {course.instructor?.photo ? <img src={`${UPLOAD_URL}/${course.instructor.photo}`} alt={course.instructor?.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : course.instructor?.name?.charAt(0)}
                                                </div>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--gray-600)', fontWeight: '500' }}>{course.instructor?.name}</span>
                                            </div>
                                            
                                            <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-md)' }}>
                                                <div className="flex flex-between items-center" style={{ marginBottom: 'var(--spacing-md)', borderTop: '1px solid var(--gray-100)', paddingTop: 'var(--spacing-md)' }}>
                                                    <div className="flex items-center" style={{ gap: '0.25rem', fontSize: '0.875rem' }}>
                                                        <FaStar style={{ color: 'var(--accent-gold)' }} />
                                                        <strong style={{ color: 'var(--gray-800)' }}>4.8</strong>
                                                        <span style={{ color: 'var(--gray-400)' }}>({course.reviews?.length || 0})</span>
                                                    </div>
                                                    <div>
                                                        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--gray-900)' }}>Rs. {course.fee}</p>
                                                    </div>
                                                </div>
                                                
                                                <Link to={`/courses/${course._id}`} className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', width: '100%' }}>
                                                    View Details <FaArrowRight />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card text-center" style={{ padding: 'var(--spacing-3xl)' }}>
                                <div className="flex flex-center" style={{ height: '60px', width: '60px', borderRadius: '50%', background: 'var(--gray-100)', margin: '0 auto var(--spacing-md)' }}>
                                    <FaSearch style={{ color: 'var(--gray-400)' }} size={24} />
                                </div>
                                <h4 style={{ marginBottom: 'var(--spacing-sm)' }}>No courses found</h4>
                                <p style={{ color: 'var(--gray-500)', marginBottom: 'var(--spacing-lg)' }}>Try adjusting your filters or search term.</p>
                                <button
                                    onClick={() => setFilters({ search: '', category: '', skillLevel: '', sort: 'newest', minPrice: '', maxPrice: '' })}
                                    className="btn btn-primary"
                                >
                                    Clear Filters
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
