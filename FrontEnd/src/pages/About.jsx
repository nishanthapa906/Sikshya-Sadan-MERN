import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaGlobe, FaBullseye, FaArrowRight } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../services/api';

const About = () => {
    const [data, setData] = useState(null);
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAboutData = async () => {
            try {
                const [settingsRes, instructorsRes] = await Promise.all([
                    publicAPI.getSettings(),
                    publicAPI.getInstructors()
                ]);
                setData(settingsRes.data.data);
                setInstructors(instructorsRes.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchAboutData();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
        </div>
    );

    const { settings, partners } = data || {};

    return (
        <div className="bg-slate-50 min-h-screen">
            {/* HERO SECTION */}
            <section className="bg-slate-900 pt-32 pb-48 relative overflow-hidden text-white">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20"></div>
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-primary-400 font-black uppercase tracking-widest text-sm mb-6 inline-block">Since {settings?.foundedYear}</span>
                    <h1 className="text-5xl md:text-7xl font-black mb-8 italic">Empowering Nepal's <br /> IT Ecosystem</h1>
                    <p className="max-w-3xl mx-auto text-xl text-slate-300 font-light leading-relaxed">
                        Sikshya Sadan is more than a training institute. We are a community of innovators, builders, and dreamers dedicated to bridging the talent gap in Nepal's tech industry.
                    </p>
                </div>
            </section>

            {/* MISSION & VISION */}
            <section className="container mx-auto px-6 -mt-24 mb-24 relative z-20">
                <div className="grid md:grid-cols-2 gap-10">
                    <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                        <div className="h-20 w-20 bg-primary-50 rounded-3xl flex items-center justify-center text-primary-600 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <FaBullseye size={32} />
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 mb-6 italic">Our Mission</h2>
                        <p className="text-slate-600 font-medium leading-relaxed italic">
                            "{settings?.mission || 'To provide world-class IT education that is accessible, practical, and aligned with global industry standards.'}"
                        </p>
                    </div>
                    <div className="bg-slate-900 p-12 rounded-[3.5rem] shadow-2xl text-white flex flex-col items-center text-center group hover:-translate-y-2 transition-transform">
                        <div className="h-20 w-20 bg-white/10 rounded-3xl flex items-center justify-center text-primary-400 mb-8 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                            <FaGlobe size={32} />
                        </div>
                        <h2 className="text-3xl font-black mb-6 italic">Our Vision</h2>
                        <p className="text-slate-300 font-light leading-relaxed">
                            "{settings?.vision || 'To become the benchmark for technical excellence in Nepal, nurturing talent that competes on the global stage.'}"
                        </p>
                    </div>
                </div>
            </section>

            {/* MILESTONES */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-4 italic uppercase">Our Journey</h2>
                        <div className="h-1.5 w-20 bg-primary-600 mx-auto rounded-full"></div>
                    </div>
                    <div className="max-w-4xl mx-auto space-y-12">
                        {settings?.history?.map((step, idx) => (
                            <div key={idx} className="flex gap-10 items-start group">
                                <div className="flex flex-col items-center">
                                    <div className="h-16 w-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center text-xl font-black flex-shrink-0 group-hover:bg-primary-600 transition-colors shadow-xl">
                                        {step.year}
                                    </div>
                                    <div className="h-full w-0.5 bg-slate-100 mt-4 group-last:hidden"></div>
                                </div>
                                <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 flex-grow shadow-sm">
                                    <h4 className="text-xl font-bold font-black italic mb-2 text-slate-800 tracking-tight">Milestone Reached</h4>
                                    <p className="text-slate-600 leading-relaxed font-medium capitalize">{step.milestone}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PARTNERS */}
            <section className="py-24 bg-slate-50 border-t border-slate-200">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-black uppercase text-xs tracking-widest">Industry Allies</span>
                        <h2 className="text-3xl font-black text-slate-800 mt-2">Companies That Trust Us</h2>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-12 grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                        {partners?.length > 0 ? (
                            partners.map(partner => (
                                <img
                                    key={partner._id}
                                    src={`${UPLOAD_URL}/${partner.logo}`}
                                    alt={partner.name}
                                    className="h-12 md:h-16 w-auto object-contain hover:scale-110 transition-transform"
                                />
                            ))
                        ) : (
                            <p className="text-slate-400 font-bold italic">No partners to show yet.</p>
                        )}
                    </div>
                </div>
            </section>

            {/* TEAM SECTION (Dynamic Instructor Grid) */}
            <section className="py-24 bg-white relative">
                <div className="container mx-auto px-6">
                    <div className="text-center mb-16">
                        <span className="text-primary-600 font-black uppercase text-xs tracking-widest">Master Minds</span>
                        <h2 className="text-4xl font-black text-slate-800 mt-2 italic">Meet Our Elite Mentors</h2>
                        <div className="h-1.5 w-20 bg-primary-600 mx-auto rounded-full mt-4"></div>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {instructors.map(instructor => (
                            <div key={instructor._id} className="bg-slate-50 rounded-[3rem] p-10 border border-slate-100 hover:shadow-2xl transition-all group">
                                <div className="h-32 w-32 rounded-[2rem] overflow-hidden mb-6 border-4 border-white shadow-xl bg-slate-200">
                                    {instructor.avatar ? (
                                        <img src={`${UPLOAD_URL}/${instructor.avatar}`} alt={instructor.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center font-black text-3xl text-slate-400">
                                            {instructor.name?.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2 italic tracking-tight">{instructor.name}</h3>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {instructor.expertise?.slice(0, 3).map(skill => (
                                        <span key={skill} className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-xs font-bold text-primary-600 uppercase italic">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                                <p className="text-slate-500 font-medium leading-relaxed italic line-clamp-3">
                                    "{instructor.bio || 'Expert software professional dedicated to sharing industry-best practices with students.'}"
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-20 flex flex-col lg:flex-row gap-16 items-center bg-slate-900 rounded-[4rem] p-12 md:p-20 text-white shadow-2xl overflow-hidden relative">
                        <div className="absolute top-0 right-0 h-64 w-64 bg-primary-600 opacity-20 blur-[100px] rounded-full"></div>
                        <div className="lg:w-1/2 space-y-8 relative z-10">
                            <h2 className="text-4xl font-black italic">Industry-Standard Excellence</h2>
                            <p className="text-lg text-slate-300 font-light leading-relaxed">
                                Our instructors aren't just teachers; they are senior software engineers, project managers, and tech leads from top IT companies in Nepal and abroad.
                            </p>
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <div className="text-primary-400 font-black text-4xl italic">100+</div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Years Combined Exp</p>
                                </div>
                                <div className="space-y-2">
                                    <div className="text-primary-400 font-black text-4xl italic">50+</div>
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Industry Certs</p>
                                </div>
                            </div>
                            <Link to="/courses" className="inline-flex items-center gap-4 px-10 py-5 bg-white text-slate-900 rounded-2xl font-black hover:bg-primary-600 hover:text-white transition-all shadow-xl active:scale-95">
                                Explore Curriculum <FaArrowRight />
                            </Link>
                        </div>
                        <div className="lg:w-1/2 relative">
                            <img
                                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                                className="rounded-[3rem] shadow-2xl relative z-10 border-8 border-white/5"
                                alt="Our Team Collaboration"
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default About;
