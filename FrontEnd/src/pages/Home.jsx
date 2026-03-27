import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaArrowRight, FaClock, FaStar, FaUsers, FaLaptopCode, FaChartLine, FaHistory, FaChalkboardTeacher } from 'react-icons/fa';
import { bannerAPI, statsAPI, courseAPI, publicAPI, UPLOAD_URL } from '../services/api';

const Home = () => {
    const [banners, setBanners] = useState([]);
    const [stats, setStats] = useState(null);
    const [courses, setCourses] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchCategory, setSearchCategory] = useState('');
    const [searchLevel, setSearchLevel] = useState('');
    const [categories, setCategories] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const statsRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bannerRes, statsRes, courseRes, testimonialRes] = await Promise.all([
                    bannerAPI.getBanners(),
                    statsAPI.getStats(),
                    courseAPI.getAllCourses({ featured: true, limit: 6 }),
                    publicAPI.getTestimonials()
                ]);

                setBanners(bannerRes.data.data);
                setStats(statsRes.data.data);
                setCourses(courseRes.data.courses);
                setTestimonials(testimonialRes.data.data.slice(0, 3));
                if (courseRes.data.categories) setCategories(courseRes.data.categories);
            } catch (err) {
                console.error("Home Data Fetch Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Carousel Logic
    useEffect(() => {
        if (banners.length > 0) {
            const timer = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % banners.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [banners]);

    // Intersection Observer for Stats
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                }
            },
            { threshold: 0.2 }
        );

        if (statsRef.current) {
            observer.observe(statsRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Real-time Search
    useEffect(() => {
        if (searchQuery.length > 2) {
            const timeout = setTimeout(async () => {
                try {
                    const res = await courseAPI.getAllCourses({ search: searchQuery, limit: 5 });
                    setSearchResults(res.data.courses);
                } catch (err) {
                    console.error(err);
                }
            }, 300);
            return () => clearTimeout(timeout);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (searchCategory) params.append('category', searchCategory);
        if (searchLevel) params.append('skillLevel', searchLevel);
        navigate(`/courses?${params.toString()}`);
    };

    const CountUp = ({ end, duration = 2000 }) => {
        const [count, setCount] = useState(0);
        useEffect(() => {
            if (isVisible) {
                let start = 0;
                const increment = end / (duration / 16);
                const timer = setInterval(() => {
                    start += increment;
                    if (start >= end) {
                        setCount(end);
                        clearInterval(timer);
                    } else {
                        setCount(Math.floor(start));
                    }
                }, 16);
            }
        }, [isVisible, end, duration]);

        return <span>{count}</span>;
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary-600"></div>
        </div>
    );

    return (
        <div className="bg-slate-50 overflow-x-hidden">
            {/* HERO SECTION - CAROUSEL */}
            <section className="relative h-[80vh] min-h-[600px] text-white">
                {banners.length > 0 ? (
                    banners.map((slide, idx) => (
                        <div
                            key={slide._id}
                            className={`absolute inset-0 transition-opacity duration-1000 flex items-center ${idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                            style={{ backgroundColor: slide.bgColor, backgroundImage: slide.bgImage ? `url(${UPLOAD_URL}/${slide.bgImage})` : 'none', backgroundSize: 'cover', backgroundPosition: 'center' }}
                        >
                            <div className="absolute inset-0 bg-black/40"></div>
                            <div className="container mx-auto px-6 relative z-20">
                                <div className="max-w-3xl space-y-6">
                                    {slide.badgeText && (
                                        <span className="inline-block px-4 py-1 rounded-full bg-primary-600 text-sm font-semibold tracking-wider animate-bounce">
                                            {slide.badgeText}
                                        </span>
                                    )}
                                    <h1 className="text-5xl md:text-7xl font-bold leading-tight drop-shadow-lg">
                                        {slide.heading}
                                    </h1>
                                    <p className="text-xl md:text-2xl text-slate-100 max-w-2xl font-light">
                                        {slide.subheading}
                                    </p>
                                    <div className="flex flex-wrap gap-4 pt-4">
                                        <Link to={slide.cta1Link} className="px-8 py-3 bg-white text-primary-900 rounded-lg font-bold hover:bg-primary-50 transition-colors shadow-lg shadow-black/20 flex items-center gap-2">
                                            {slide.cta1Label} <FaArrowRight />
                                        </Link>
                                        {slide.cta2Label && (
                                            <Link to={slide.cta2Link} className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition-colors">
                                                {slide.cta2Label}
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gradient-to-r from-primary-900 to-indigo-900">
                        <div className="text-center p-6">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">Welcome to Sikshya Sadan</h1>
                            <p className="text-xl opacity-80">Empowering the next generation of IT leaders in Nepal.</p>
                            <Link to="/courses" className="mt-8 inline-block px-8 py-3 bg-white text-primary-900 rounded-lg font-bold">Explore Our Courses</Link>
                        </div>
                    </div>
                )}

                {/* SLIDE INDICATORS */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex gap-2">
                    {banners.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentSlide ? 'w-10 bg-white' : 'w-3 bg-white/40'}`}
                        />
                    ))}
                </div>
            </section>

            {/* SEARCH BAR SECTION */}
            <div className="container mx-auto px-6 -mt-10 relative z-40">
                <div className="max-w-5xl mx-auto relative">
                    <form onSubmit={handleSearchSubmit} className="bg-white rounded-[2rem] shadow-2xl p-4 border border-slate-200">
                        <div className="flex flex-col md:flex-row items-center gap-4">
                            <div className="flex-1 flex items-center min-w-[200px]">
                                <div className="pl-4 text-slate-400">
                                    <FaSearch size={18} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Keywords..."
                                    className="w-full px-4 py-4 text-slate-800 outline-none placeholder:text-slate-400 font-bold"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                            <select
                                className="w-full md:w-auto px-6 py-4 bg-slate-50 border-0 rounded-xl outline-none font-bold text-slate-600 appearance-none min-w-[180px]"
                                value={searchCategory}
                                onChange={(e) => setSearchCategory(e.target.value)}
                            >
                                <option value="">Global Category</option>
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                            <div className="h-10 w-px bg-slate-100 hidden md:block"></div>
                            <select
                                className="w-full md:w-auto px-6 py-4 bg-slate-50 border-0 rounded-xl outline-none font-bold text-slate-600 appearance-none min-w-[160px]"
                                value={searchLevel}
                                onChange={(e) => setSearchLevel(e.target.value)}
                            >
                                <option value="">Skill Protocol</option>
                                <option value="Beginner">Beginner</option>
                                <option value="Intermediate">Intermediate</option>
                                <option value="Advanced">Advanced</option>
                            </select>
                            <button type="submit" className="w-full md:w-auto bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl active:scale-95">
                                Initiate
                            </button>
                        </div>
                    </form>

                    {searchResults.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-3 bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
                            {searchResults.map(course => (
                                <Link
                                    key={course._id}
                                    to={`/courses/${course._id}`}
                                    className="flex items-center justify-between p-4 hover:bg-primary-50 transition-colors border-b border-slate-50 last:border-0"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="h-12 w-12 rounded-lg bg-slate-100 flex items-center justify-center text-primary-600 overflow-hidden">
                                            {course.thumbnail ? (
                                                <img src={`${UPLOAD_URL}/${course.thumbnail}`} alt={course.title} className="object-cover h-full w-full" />
                                            ) : <FaLaptopCode size={24} />}
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900">{course.title}</h4>
                                            <p className="text-sm text-slate-500">{course.category}</p>
                                        </div>
                                    </div>
                                    <FaArrowRight className="text-slate-300 group-hover:text-primary-600" />
                                </Link>
                            ))}
                            <div className="p-3 bg-slate-50 text-center text-sm">
                                <Link to={`/courses?search=${searchQuery}`} className="text-primary-600 font-semibold hover:underline">
                                    View all results for "{searchQuery}"
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* STATISTICS SECTION */}
            < section ref={statsRef} className="py-24 bg-white relative" >
                <div className="container mx-auto px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                        <div className="text-center group">
                            <div className="bg-blue-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                <FaUsers size={32} />
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 mb-2">
                                <CountUp end={stats?.totalStudents || 0} />+
                            </h3>
                            <p className="text-slate-500 font-medium text-lg uppercase tracking-widest">Enrolled Students</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-indigo-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                <FaLaptopCode size={32} />
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 mb-2">
                                <CountUp end={stats?.totalCourses || 0} />
                            </h3>
                            <p className="text-slate-500 font-medium text-lg uppercase tracking-widest">Global Courses</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-emerald-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                <FaChalkboardTeacher size={32} />
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 mb-2">
                                <CountUp end={stats?.totalInstructors || 0} />
                            </h3>
                            <p className="text-slate-500 font-medium text-lg uppercase tracking-widest">Expert Instructors</p>
                        </div>
                        <div className="text-center group">
                            <div className="bg-amber-50 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-all duration-300 transform group-hover:rotate-6">
                                <FaHistory size={32} />
                            </div>
                            <h3 className="text-5xl font-black text-slate-900 mb-2">
                                <CountUp end={5} />+
                            </h3>
                            <p className="text-slate-500 font-medium text-lg uppercase tracking-widest">Years of Excellence</p>
                        </div>
                    </div>
                </div>
            </section >

            {/* FEATURED COURSES SECTION */}
            < section className="py-24 bg-slate-50" >
                <div className="container mx-auto px-6 text-center">
                    <div className="mb-16">
                        <span className="text-primary-600 font-bold tracking-widest uppercase">Popular Courses</span>
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4">Top Rated Programs</h2>
                        <div className="h-1.5 w-24 bg-primary-600 mx-auto mt-6 rounded-full"></div>
                    </div>

                    {courses.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {courses.map(course => (
                                <div key={course._id} className="bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group flex flex-col border border-slate-100">
                                    <div className="relative h-60 overflow-hidden">
                                        <img src={`${UPLOAD_URL}/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-black text-primary-900 uppercase">
                                            {course.category}
                                        </div>
                                        <div className="absolute top-4 right-4 bg-primary-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                            Rs. {course.fee}
                                        </div>
                                    </div>
                                    <div className="p-8 text-left flex-grow space-y-4">
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <FaStar /> <FaStar /> <FaStar /> <FaStar /> <FaStar />
                                            <span className="text-slate-400 text-sm ml-2">({course.rating || '5.0'})</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 leading-snug hover:text-primary-600 transition-colors">
                                            <Link to={`/courses/${course._id}`}>{course.title}</Link>
                                        </h3>
                                        <div className="flex items-center gap-3 py-2 border-y border-slate-50">
                                            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary-600 overflow-hidden">
                                                {course.instructor?.photo ? <img src={`${UPLOAD_URL}/${course.instructor.photo}`} className="object-cover h-full w-full" alt={course.instructor?.name} /> : course.instructor?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-800">{course.instructor?.name}</p>
                                                <p className="text-xs text-slate-500">Senior Instructor</p>
                                            </div>
                                        </div>
                                        <div className="flex justify-between items-center text-sm font-medium text-slate-500 pt-2">
                                            <div className="flex items-center gap-2">
                                                <FaClock className="text-primary-500" /> {course.duration || '3 Months'}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <FaUsers className="text-emerald-500" /> Enrolled
                                            </div>
                                        </div>
                                    </div>
                                    <div className="px-8 pb-8">
                                        <Link to={`/courses/${course._id}`} className="w-full py-4 bg-slate-900 group-hover:bg-primary-600 text-white rounded-2xl font-bold flex items-center justify-center gap-3 transition-colors">
                                            Course Details <FaArrowRight />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-20 text-slate-400 font-medium">No courses available yet. Check back soon!</div>
                    )}

                    <div className="mt-20">
                        <Link to="/courses" className="px-12 py-5 border-2 border-primary-600 text-primary-600 rounded-2xl font-black hover:bg-primary-600 hover:text-white transition-all transform hover:-translate-y-1">
                            Explore All Courses
                        </Link>
                    </div>
                </div>
            </section >

            {/* TESTIMONIALS SECTION */}
            < section className="py-24 bg-white relative overflow-hidden" >
                <div className="absolute top-0 right-0 h-96 w-96 bg-primary-50 rounded-full -mr-48 -mt-48 blur-3xl opacity-60"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/3 text-left">
                            <span className="text-primary-600 font-bold uppercase tracking-widest">Success Stories</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mt-4 leading-tight">Hear from our Alumni</h2>
                            <p className="text-slate-600 mt-6 text-lg font-light leading-relaxed">
                                Join thousands of students who have launched their careers through Sikshya Sadan. Real stories from real learners.
                            </p>
                            <Link to="/about" className="mt-10 inline-flex items-center gap-3 text-primary-600 font-black hover:gap-5 transition-all">
                                About Us <FaArrowRight />
                            </Link>
                        </div>
                        <div className="lg:w-2/3 grid md:grid-cols-2 gap-8">
                            {testimonials.length > 0 ? (
                                testimonials.map((t, i) => (
                                    <div key={t._id} className={`bg-slate-50 p-8 rounded-3xl ${i === 1 ? 'md:mt-12' : ''} border border-slate-100 shadow-sm relative group`}>
                                        <div className="absolute top-8 right-8 text-primary-100 group-hover:text-primary-200 transition-colors transform group-hover:scale-110">
                                            <svg className="h-12 w-12 fill-current" viewBox="0 0 32 32"><path d="M10 8v8h6l-3 6h4l3-6v-8h-10zM22 8v8h6l-3 6h4l3-6v-8h-10z"></path></svg>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500 mb-6 font-bold">
                                            {[...Array(t.rating || 5)].map((_, i) => <FaStar key={i} />)}
                                        </div>
                                        <p className="text-slate-700 italic font-medium leading-relaxed relative z-10">
                                            "{t.comment}"
                                        </p>
                                        <div className="flex items-center gap-4 mt-8 pt-6 border-t border-slate-200">
                                            <div className="h-14 w-14 rounded-2xl bg-indigo-100 flex items-center justify-center font-bold text-primary-600 overflow-hidden shadow-inner">
                                                {t.student?.photo ? <img src={`${UPLOAD_URL}/${t.student.photo}`} alt={t.student?.name} /> : t.student?.name?.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900">{t.student?.name}</h4>
                                                <p className="text-sm text-slate-500">{t.course?.title}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-slate-400 p-8">No testimonials to show yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            </section >

            {/* CTA SECTION */}
            < section className="py-24" >
                <div className="container mx-auto px-6">
                    <div className="bg-primary-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-primary-900/40">
                        <div className="absolute top-0 left-0 h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary-800/50 via-transparent to-transparent"></div>
                        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
                            <span className="px-6 py-2 rounded-full bg-white/10 text-white font-bold mb-8 uppercase tracking-widest text-sm backdrop-blur-sm border border-white/20">Ready to start?</span>
                            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight italic">Your Future in Tech Begins Here.</h2>
                            <p className="text-xl text-primary-100 mb-12 font-light leading-relaxed max-w-2xl">
                                Join our community of developers and innovators. Enroll today and get access to premium resources and mentorship.
                            </p>
                            <div className="flex flex-wrap items-center justify-center gap-6">
                                <Link to="/admission" className="px-10 py-5 bg-white text-primary-900 rounded-2xl font-black text-lg hover:scale-105 transition-transform shadow-xl">
                                    Apply for Admission
                                </Link>
                                <Link to="/contact" className="px-10 py-5 border-2 border-white/40 text-white rounded-2xl font-black text-lg hover:bg-white/10 transition-all flex items-center gap-3">
                                    Contact Us <FaArrowRight />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section >
        </div >
    );
};

export default Home;
