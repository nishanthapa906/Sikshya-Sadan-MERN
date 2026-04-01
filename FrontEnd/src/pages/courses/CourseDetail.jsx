import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { courseAPI, demoSlotAPI, studentAPI } from '../../services/api';

const CourseDetail = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const nav = useNavigate();
    const [course, setCourse] = useState(null);
    const [slots, setSlots] = useState([]);
    const [enrolled, setEnrolled] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [cRes, dRes] = await Promise.all([
                    courseAPI.getCourseById(id),
                    demoSlotAPI.getSlotsByCourseId(id).catch(() => ({ data: { data: [] } }))
                ]);
                setCourse(cRes.data.course);
                setSlots(dRes?.data?.data || []);
                if (user) {
                    const eRes = await studentAPI.isEnrolled(id);
                    setEnrolled(eRes.data.enrolled);
                }
            } catch (err) { console.error(err); } 
            finally { setLoading(false); }
        };
        fetchAll();
    }, [id, user]);

    const book = async (sId) => {
        if (!user) return nav('/login');
        try {
            await demoSlotAPI.bookSlot(sId);
            alert('Slot booked!');
            demoSlotAPI.getSlotsByCourseId(id).then(r => setSlots(r.data.data));
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;
    if (!course) return <div className="p-8 text-center text-red-500 font-bold">Course not found</div>;

    return (
        <div className="max-w-5xl mx-auto my-10 px-6 font-sans">
            <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl mb-12 shadow-xl">
                <span className="bg-indigo-600 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">{course.category} | {course.skillLevel}</span>
                <h1 className="text-3xl md:text-5xl font-black mt-6 mb-4">{course.title}</h1>
                <p className="text-lg text-slate-300 md:max-w-3xl leading-relaxed">{course.description}</p>
                
                <div className="flex flex-wrap gap-6 md:gap-12 mt-8 py-6 border-y border-white/10">
                    <div><span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Instructor</span> <span className="font-bold text-lg">{course.instructor?.name}</span></div>
                    <div><span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Rating</span> <span className="font-bold text-lg text-yellow-400">{course.rating || 'N/A'}</span></div>
                    <div><span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Students</span> <span className="font-bold text-lg">{course.enrolledStudents || 0}</span></div>
                    <div><span className="block text-[10px] text-slate-400 uppercase tracking-widest font-bold">Fee</span> <span className="font-black text-2xl text-emerald-400">Rs. {course.fee}</span></div>
                </div>
                
                <div className="mt-8">
                    {enrolled ? (
                        <Link to={`/student/course/${course._id}`} className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-colors inline-block">Go to Course</Link>
                    ) : (
                        <Link to="/admission" state={{ courseId: course._id }} className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold transition-colors inline-block">Enroll Now</Link>
                    )}
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-12">
                <div className="flex-[2]">
                    <h2 className="text-2xl font-black text-slate-800 mb-6">Course Syllabus</h2>
                    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                        <table className="w-full text-left border-collapse">
                            <tbody>
                                {course.syllabus?.map((s, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-6 w-12 text-slate-400 font-black align-top">{i + 1}.</td>
                                        <td className="p-6">
                                            <div className="font-bold text-slate-800 mb-1">{s.topic}</div>
                                            <div className="text-slate-500 text-sm leading-relaxed">{s.description}</div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-10">
                    <div>
                        <h2 className="text-xl font-black text-slate-800 mb-6">Demo Slots</h2>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            {slots.length === 0 ? <p className="text-slate-500 italic text-sm">No slots available</p> : slots.map(s => (
                                <div key={s._id} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
                                    <div>
                                        <div className="font-bold text-slate-800 text-sm">{new Date(s.date).toLocaleDateString()}</div>
                                        <div className="text-slate-500 text-xs mt-1">{s.time}</div>
                                    </div>
                                    {s.isFull ? <span className="text-red-500 text-xs font-black uppercase tracking-widest bg-red-50 px-2 py-1 rounded">Full</span> : (
                                        <button onClick={() => book(s._id)} className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Book</button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-black text-slate-800 mb-6">Reviews</h2>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200">
                            {course.reviews?.length === 0 ? <p className="text-slate-500 italic text-sm">No reviews yet.</p> : course.reviews?.slice(0,3).map((r, i) => (
                                <div key={i} className="mb-4 pb-4 border-b border-slate-100 last:border-0 last:mb-0 last:pb-0">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-slate-800 text-sm">{r.student?.name}</span>
                                        <span className="text-yellow-500 font-bold text-xs bg-yellow-50 px-2 py-1 rounded">{r.rating}/5</span>
                                    </div>
                                    <div className="text-slate-500 text-sm italic">"{r.comment}"</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CourseDetail;
