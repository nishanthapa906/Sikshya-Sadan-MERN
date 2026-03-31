import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt, FaBuilding, FaArrowRight, FaCalendarAlt, FaFilter } from 'react-icons/fa';
import { publicAPI, UPLOAD_URL } from '../../services/api';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [types, setTypes] = useState([]);
    const [selType, setSelType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const res = await publicAPI.getJobs({ type: selType });
                setJobs(res.data.data?.jobs || []);
                setTypes(res.data.data?.types || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [selType]);

    if (loading) return <div className="h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div></div>;

    return (
        <div className="bg-slate-50 min-h-screen pt-32 pb-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16">
                    {/* LEFT: CONTENT */}
                    <div className="lg:w-2/3 space-y-12">
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-slate-900 mb-2">Job Listings</h1>
                            <p className="text-slate-500">
                                Job opportunities from our partner companies, available to Sikshya Sadan students and graduates.
                            </p>
                        </div>

                        {/* JOB LIST */}
                        <div className="space-y-6">
                            {jobs.length > 0 ? (
                                jobs.map(job => (
                                    <div key={job._id} className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col md:flex-row md:items-center gap-6 md:gap-10 hover:border-primary-100 transition-all group">
                                        <div className="h-24 w-24 bg-slate-50 rounded-3xl flex items-center justify-center p-4 border border-slate-50 shadow-inner group-hover:bg-primary-50 transition-colors">
                                            {job.companyLogo ? (
                                                <img src={`${UPLOAD_URL}/${job.companyLogo}`} alt={job.company} className="object-contain h-full w-full" />
                                            ) : <FaBuilding size={32} className="text-slate-300" />}
                                        </div>
                                        <div className="flex-grow space-y-3">
                                            <div className="flex flex-wrap gap-3">
                                                <span className="text-[10px] font-black uppercase tracking-tighter px-3 py-1 bg-primary-50 text-primary-600 rounded-full">{job.type}</span>

                                            </div>
                                            <h3 className="text-2xl font-black text-slate-900 group-hover:text-primary-600 transition-colors">{job.title}</h3>
                                            <div className="flex flex-wrap items-center gap-6 text-sm text-slate-500 font-bold">
                                                <span className="flex items-center gap-2"><FaBuilding className="text-slate-300" /> {job.company}</span>
                                                <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-300" /> {job.location}</span>
                                                <span className="flex items-center gap-2 text-red-500"><FaCalendarAlt /> Apply by: {new Date(job.deadline).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0">
                                            <a href={job.applyLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl active:scale-95">
                                                Apply Now <FaArrowRight />
                                            </a>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
                                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FaBuilding size={16} className="text-slate-300" />
                                    </div>
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">No job listings yet</h2>
                                    <p className="text-slate-500 text-sm">Check back later for new opportunities.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* RIGHT: FILTERS & BANNER */}
                    <div className="lg:w-1/3 space-y-8">
                        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100">
                            <h3 className="text-base font-bold text-slate-900 mb-5 flex items-center gap-2">
                                <FaFilter size={13} className="text-slate-400" /> Filter by Type
                            </h3>
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-400">Job Type</p>
                                    <div className="space-y-3">
                                        <button
                                            onClick={() => setSelType('')}
                                            className={`w-full text-left px-5 py-3 rounded-2xl font-bold transition-all ${selType === '' ? 'bg-primary-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                        >
                                            All Types
                                        </button>
                                        {types.map(type => (
                                            <button
                                                key={type}
                                                onClick={() => setSelType(type)}
                                                className={`w-full text-left px-5 py-3 rounded-2xl font-bold transition-all ${selType === type ? 'bg-primary-900 text-white shadow-lg' : 'bg-slate-50 text-slate-600 hover:bg-slate-100'}`}
                                            >
                                                {type}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-slate-900 p-7 rounded-2xl text-white">
                            <h3 className="text-base font-bold mb-2">Hire our graduates?</h3>
                            <p className="text-slate-400 text-sm leading-relaxed mb-5">
                                Partner with Sikshya Sadan to hire skilled IT graduates for your company.
                            </p>
                            <Link to="/contact" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-400 hover:text-white transition-colors">
                                Contact us <FaArrowRight size={11} />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Jobs;
