import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { FaClock, FaUsers, FaStar, FaCheckCircle, FaChevronDown, FaChevronUp, FaGraduationCap, FaArrowRight, FaVideo, FaBookmark, FaFileAlt } from 'react-icons/fa';
import { courseAPI, demoSlotAPI, studentAPI, UPLOAD_URL } from '../../services/api';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [demoSlots, setDemoSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openModule, setOpenModule] = useState(0);
    const [isEnrolled, setIsEnrolled] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [courseRes, demoRes] = await Promise.all([
                    courseAPI.getCourseById(id),
                    demoSlotAPI.getSlotsByCourseId(id)
                ]);
                setCourse(courseRes.data.course);
                setDemoSlots(demoRes.data.data);

                // Check enrollment if user logged in
                if (user) {
                    const enrollRes = await studentAPI.isEnrolled(id);
                    setIsEnrolled(enrollRes.data.enrolled);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id, user]);

    const handleBookDemo = async (slotId) => {
        if (!user) return navigate('/login', { state: { message: 'Please login to book a demo slot' } });
        try {
            await demoSlotAPI.bookSlot(slotId);
            alert('Slot booked successfully!');
            // Refresh slots
            const res = await demoSlotAPI.getSlotsByCourseId(id);
            setDemoSlots(res.data.data);
        } catch (err) {
            alert(err.response?.data?.message || 'Booking failed');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="flex flex-col items-center gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
                <p className="text-slate-500 font-bold">Loading Course Details...</p>
            </div>
        </div>
    );

    if (!course) return <div className="text-center py-20 font-bold text-slate-500">Course not found</div>;

    return (
        <div className="bg-slate-50 min-h-screen pb-24">
            {/* HERO SECTION */}
            <section className="bg-slate-900 text-white pt-24 pb-32 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-primary-600 opacity-10 blur-3xl rounded-full translate-x-1/2 -translate-y-1/2"></div>
                <div className="container mx-auto px-6 relative z-10">
                    <div className="flex flex-col lg:flex-row gap-16 items-start">
                        <div className="lg:w-2/3 space-y-8">
                            <div className="flex flex-wrap gap-4">
                                <span className="px-4 py-1.5 rounded-full bg-primary-600/30 border border-primary-500/50 text-primary-400 text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                                    {course.category}
                                </span>
                                <span className="px-4 py-1.5 rounded-full bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                                    {course.skillLevel}
                                </span>
                            </div>
                            <h1 className="text-4xl md:text-6xl font-black leading-tight italic">
                                {course.title}
                            </h1>
                            <p className="text-xl text-slate-300 font-light leading-relaxed max-w-3xl">
                                {course.description}
                            </p>
                            <div className="flex flex-wrap items-center gap-8 pt-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-full border-2 border-primary-500 overflow-hidden bg-slate-800">
                                        {course.instructor?.avatar ? (
                                            <img src={`${UPLOAD_URL}/${course.instructor.avatar}`} alt={course.instructor?.name} className="object-cover h-full w-full" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center font-bold text-primary-500">
                                                {course.instructor?.name?.charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Expert Mentor</p>
                                        <p className="text-lg font-bold">{course.instructor?.name}</p>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-700 hidden md:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary-500 shadow-xl">
                                        <FaStar />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Rating</p>
                                        <p className="text-lg font-bold">{course.rating || '5.0'} / 5.0</p>
                                    </div>
                                </div>
                                <div className="h-10 w-px bg-slate-700 hidden md:block"></div>
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-500 shadow-xl">
                                        <FaUsers />
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-400 font-bold uppercase">Enrolled</p>
                                        <p className="text-lg font-bold">{course.enrolledStudents || 0} Students</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* STICKY PRICING CARD */}
                        <div className="lg:w-1/3 w-full sticky top-24">
                            <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 border border-slate-100 transform hover:scale-[1.02] transition-transform">
                                <div className="relative h-56 rounded-3xl overflow-hidden mb-8 shadow-inner bg-slate-100">
                                    {course.thumbnail ? (
                                        <img src={`${UPLOAD_URL}/${course.thumbnail}`} alt={course.title} className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center text-slate-300">
                                            <FaVideo size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-center justify-center">
                                        <button className="h-16 w-16 bg-primary-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-transform">
                                            <FaVideo size={24} />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mb-1">Total Course Fee</p>
                                            <h2 className="text-4xl font-black text-slate-900">Rs. {course.fee}</h2>
                                        </div>
                                        <span className="text-emerald-600 bg-emerald-50 px-3 py-1 rounded-lg text-sm font-bold">LIFETIME ACCESS</span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <FaClock className="text-primary-600" /> <span>{course.duration} Duration</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <FaFileAlt className="text-primary-600" /> <span>{course.syllabus?.length || 0} In-depth Modules</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium">
                                            <FaCheckCircle className="text-primary-600" /> <span>Industry Recognized Certificate</span>
                                        </div>
                                    </div>

                                    {isEnrolled ? (
                                        <Link to={`/student/course/${course._id}`} className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-center block shadow-lg shadow-emerald-200">
                                            Access Your Learning Content
                                        </Link>
                                    ) : (
                                        <Link to="/admission" state={{ courseId: course._id }} className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-center block shadow-xl shadow-primary-200 hover:bg-primary-700 transition-all">
                                            Enroll in Career Track
                                        </Link>
                                    )}
                                    <button className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all">
                                        Save for Later <FaBookmark />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SYLLABUS SECTION */}
            <section className="container mx-auto px-6 -mt-12 mb-20 relative z-20">
                <div className="flex flex-col lg:flex-row gap-16">
                    <div className="lg:w-2/3 space-y-16">
                        {/* ACCORDION SYLLABUS */}
                        <div className="bg-white rounded-[3rem] p-10 shadow-xl border border-slate-100">
                            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900">Course Curriculum</h2>
                                    <span className="text-slate-400 text-sm font-bold">{course.syllabus?.length || 0} Modules total</span>
                                </div>
                                {course.syllabusFile && (
                                    <a
                                        href={`${UPLOAD_URL}/${course.syllabusFile}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-8 py-3 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl flex items-center gap-3"
                                    >
                                        <FaFileAlt /> Download Syllabus PDF
                                    </a>
                                )}
                            </div>
                            <div className="space-y-4">
                                {course.syllabus?.map((module, idx) => (
                                    <div key={idx} className="border border-slate-100 rounded-2xl overflow-hidden shadow-sm">
                                        <button
                                            onClick={() => setOpenModule(openModule === idx ? -1 : idx)}
                                            className={`w-full p-6 flex items-center justify-between text-left transition-colors ${openModule === idx ? 'bg-primary-50' : 'bg-white hover:bg-slate-50'}`}
                                        >
                                            <div className="flex items-center gap-5">
                                                <span className="h-10 w-10 rounded-xl bg-white shadow-sm flex items-center justify-center font-black text-primary-600 border border-slate-100">
                                                    {idx + 1}
                                                </span>
                                                <h4 className="font-bold text-slate-900 text-lg">{module.topic}</h4>
                                            </div>
                                            {openModule === idx ? <FaChevronUp className="text-primary-600" /> : <FaChevronDown className="text-slate-300" />}
                                        </button>
                                        {openModule === idx && (
                                            <div className="p-8 bg-white text-slate-600 font-light leading-relaxed border-t border-slate-50 animate-fadeIn">
                                                <p className="mb-4">{module.description}</p>
                                                <ul className="space-y-2">
                                                    <li className="flex items-center gap-3 text-slate-800 font-bold"><FaCheckCircle className="text-emerald-500" /> Expert-led Sessions</li>
                                                    <li className="flex items-center gap-3 text-slate-800 font-bold"><FaCheckCircle className="text-emerald-500" /> Hands-on Projects</li>
                                                    <li className="flex items-center gap-3 text-slate-800 font-bold"><FaCheckCircle className="text-emerald-500" /> Real-world Case Studies</li>
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* INSTRUCTOR PROFILE */}
                        <div className="bg-indigo-900 rounded-[3rem] p-12 text-white flex flex-col md:flex-row gap-10 items-center">
                            <div className="h-48 w-48 rounded-[2rem] overflow-hidden border-4 border-white/20 shadow-2xl flex-shrink-0 bg-indigo-800">
                                {course.instructor?.avatar ? (
                                    <img src={`${UPLOAD_URL}/${course.instructor.avatar}`} alt={course.instructor?.name} className="object-cover h-full w-full" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center font-bold text-4xl">
                                        {course.instructor?.name?.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="space-y-4">
                                <span className="text-primary-400 font-black uppercase tracking-widest text-xs">Meet Your Master</span>
                                <h3 className="text-3xl font-black italic">{course.instructor?.name}</h3>
                                <p className="text-indigo-100 font-light leading-relaxed max-w-xl">
                                    {course.instructor?.bio || "Expert in modern technologies and software engineering. Passionate about teaching the next generation of professional talent."}
                                </p>
                                <div className="flex gap-4 pt-4">
                                    {course.instructor?.expertise?.map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-white/10 rounded-lg text-xs font-bold border border-white/10 uppercase">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: DEMO BOOKING */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-200">
                            <h3 className="text-2xl font-black text-amber-900 mb-6 flex items-center gap-3">
                                <FaClock /> Free Demo Class
                            </h3>
                            <p className="text-amber-800 mb-8 font-medium italic opacity-80">
                                Experience our teaching method before you commit. Choose an available slot below.
                            </p>
                            <div className="space-y-4">
                                {demoSlots.length > 0 ? (
                                    demoSlots.map(slot => (
                                        <div key={slot._id} className="bg-white p-5 rounded-3xl border border-amber-100 flex items-center justify-between shadow-sm">
                                            <div>
                                                <p className="font-black text-slate-800">{new Date(slot.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                                                <p className="text-sm text-slate-500 font-bold tracking-wider">{slot.time}</p>
                                            </div>
                                            {slot.isFull ? (
                                                <span className="text-xs font-black text-red-500 bg-red-50 px-3 py-1.5 rounded-full uppercase italic">Full</span>
                                            ) : (
                                                <button
                                                    onClick={() => handleBookDemo(slot._id)}
                                                    className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-black active:scale-95 transition-transform"
                                                >
                                                    Book
                                                </button>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-amber-900/40 font-bold border-2 border-dashed border-amber-200 rounded-2xl italic">
                                        No demo slots available right now.
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* REVIEWS SECTION PREVIEW */}
                        <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <FaStar className="text-amber-500" /> Student Feedback
                            </h3>
                            <div className="space-y-8">
                                {course.reviews?.length > 0 ? (
                                    course.reviews.slice(0, 3).map((review, i) => (
                                        <div key={i} className="space-y-3 pb-6 border-b border-slate-50 last:border-0 last:pb-0">
                                            <div className="flex justify-between items-center text-amber-500">
                                                <div className="flex gap-1 text-xs">
                                                    {[...Array(5)].map((_, i) => <FaStar key={i} className={i < review.rating ? 'text-amber-500' : 'text-slate-200'} />)}
                                                </div>
                                                <span className="text-[10px] text-slate-300 font-bold">{new Date(review.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-slate-600 font-medium italic text-sm">"{review.comment}"</p>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-primary-600 text-xs shadow-sm">
                                                    {review.student?.name?.charAt(0)}
                                                </div>
                                                <span className="text-xs font-black text-slate-900">{review.student?.name}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 text-slate-300 font-bold flex flex-col items-center">
                                        <div className="text-4xl mb-4">⭐</div>
                                        <p>No reviews yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CourseDetail;
