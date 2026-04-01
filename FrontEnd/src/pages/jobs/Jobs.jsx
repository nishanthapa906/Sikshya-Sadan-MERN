import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../../services/api';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [types, setTypes] = useState([]);
    const [selType, setSelType] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        publicAPI.getJobs({ type: selType })
            .then(res => { setJobs(res.data.data?.jobs || []); setTypes(res.data.data?.types || []); })
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [selType]);

    if (loading) return <div className="p-12 text-center font-bold text-slate-500 min-h-[50vh] flex justify-center items-center">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto my-10 p-6 font-sans">
            <h1 className="text-4xl font-black text-slate-800 text-center mb-8">Job Openings</h1>
            
            <div className="flex flex-wrap justify-center gap-2 mb-10">
                <button onClick={() => setSelType('')} className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${selType==='' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>All Types</button>
                {types.map(t => (
                    <button key={t} onClick={() => setSelType(t)} className={`px-6 py-2 rounded-full font-bold text-sm transition-colors ${selType===t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>
                ))}
            </div>

            {jobs.length === 0 ? <p className="text-center p-10 bg-white border border-slate-200 rounded-2xl text-slate-500 font-bold">No jobs found matching your criteria.</p> : (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                                <th className="p-4 md:p-6 font-black">Job Title & Company</th>
                                <th className="p-4 md:p-6 font-black hidden sm:table-cell">Location & Type</th>
                                <th className="p-4 md:p-6 font-black hidden md:table-cell">Deadline</th>
                                <th className="p-4 md:p-6 font-black text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {jobs.map(j => (
                                <tr key={j._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                                    <td className="p-4 md:p-6">
                                        <div className="font-bold text-slate-800 text-lg mb-1">{j.title}</div>
                                        <div className="text-indigo-600 font-medium text-sm">{j.company}</div>
                                        <div className="sm:hidden mt-2 text-xs text-slate-500">
                                            {j.location} • {j.type} • Due {new Date(j.deadline).toLocaleDateString()}
                                        </div>
                                    </td>
                                    <td className="p-4 md:p-6 hidden sm:table-cell">
                                        <div className="font-medium text-slate-700">{j.location}</div>
                                        <div className="text-slate-500 text-xs mt-1 bg-slate-100 px-2 py-1 rounded inline-block font-bold uppercase tracking-widest">{j.type}</div>
                                    </td>
                                    <td className="p-4 md:p-6 hidden md:table-cell font-medium text-slate-600">
                                        {new Date(j.deadline).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 md:p-6 text-center">
                                        <a href={j.applyLink} target="_blank" rel="noreferrer" className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-colors whitespace-nowrap shadow-sm">Apply</a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Jobs;
