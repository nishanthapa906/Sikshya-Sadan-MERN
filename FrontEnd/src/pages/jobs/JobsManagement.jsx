import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';
import { FaPlus, FaTrash, FaEdit, FaBriefcase, FaBuilding, FaMapMarkerAlt, FaCalendarAlt, FaLink, FaTimes } from 'react-icons/fa';

const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [processing, setProcessing] = useState(false);

    const emptyForm = {
        title: '', company: '', location: '', type: 'Full-time',
        description: '', requirements: '', applyLink: '',
        deadline: '', isActive: true
    };
    const [form, setForm] = useState(emptyForm);

    useEffect(() => { fetchJobs(); }, []);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const res = await jobAPI.getAll();
            setJobs(res.data.data || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (job) => {
        setEditing(job._id);
        setForm({
            title: job.title, company: job.company, location: job.location,
            type: job.type, description: job.description,
            requirements: Array.isArray(job.requirements) ? job.requirements.join(', ') : '',
            applyLink: job.applyLink,
            deadline: job.deadline ? new Date(job.deadline).toISOString().split('T')[0] : '',
            isActive: job.isActive
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setProcessing(true);
            const payload = {
                ...form,
                requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean)
            };

            if (editing) {
                await jobAPI.update(editing, payload);
                alert('Job updated!');
            } else {
                await jobAPI.create(payload);
                alert('Job posted!');
            }
            setShowForm(false);
            setEditing(null);
            setForm(emptyForm);
            fetchJobs();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to save job');
        } finally {
            setProcessing(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this job listing?')) return;
        try {
            await jobAPI.delete(id);
            fetchJobs();
        } catch (err) {
            alert('Failed to delete job');
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center pt-24">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-slate-900"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-6">

                {/* HEADER */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div>
                        <span className="text-slate-500 font-black uppercase text-xs tracking-widest bg-slate-200 px-5 py-2 rounded-full mb-4 inline-block">Job Placement</span>
                        <h1 className="text-5xl font-black text-slate-900 italic">Manage Job Listings</h1>
                        <p className="text-slate-500 mt-2">Post and manage IT job opportunities for graduates.</p>
                    </div>
                    <button
                        onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
                        className="flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl active:scale-95"
                    >
                        <FaPlus /> Post New Job
                    </button>
                </div>

                {/* CREATE/EDIT FORM */}
                {showForm && (
                    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 mb-12 overflow-hidden">
                        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                            <h2 className="text-2xl font-black italic">{editing ? 'Edit Job Listing' : 'Post New Job'}</h2>
                            <button onClick={() => { setShowForm(false); setEditing(null); }} className="h-10 w-10 bg-white/10 rounded-xl flex items-center justify-center hover:bg-white/20 transition-all">
                                <FaTimes />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-10 space-y-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Job Title *</label>
                                    <input type="text" required value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 focus:ring-4 ring-blue-50"
                                        placeholder="e.g. Junior Web Developer" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name *</label>
                                    <input type="text" required value={form.company}
                                        onChange={e => setForm({ ...form, company: e.target.value })}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 focus:ring-4 ring-blue-50"
                                        placeholder="e.g. Leapfrog Technology" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Location *</label>
                                    <input type="text" required value={form.location}
                                        onChange={e => setForm({ ...form, location: e.target.value })}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 focus:ring-4 ring-blue-50"
                                        placeholder="e.g. Kathmandu, Nepal" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Job Type *</label>
                                    <select required value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 appearance-none focus:ring-4 ring-blue-50">
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Contract">Contract</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Apply Link *</label>
                                    <input type="url" required value={form.applyLink}
                                        onChange={e => setForm({ ...form, applyLink: e.target.value })}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 focus:ring-4 ring-blue-50"
                                        placeholder="https://company.com/apply" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Application Deadline *</label>
                                    <input type="date" required value={form.deadline}
                                        onChange={e => setForm({ ...form, deadline: e.target.value })}
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 focus:ring-4 ring-blue-50" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Job Description *</label>
                                <textarea required rows={4} value={form.description}
                                    onChange={e => setForm({ ...form, description: e.target.value })}
                                    className="w-full bg-slate-50 border-0 rounded-3xl px-6 py-4 outline-none font-medium text-slate-600 focus:ring-4 ring-blue-50"
                                    placeholder="Describe the role, responsibilities..." />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Requirements (comma separated)</label>
                                <input type="text" value={form.requirements}
                                    onChange={e => setForm({ ...form, requirements: e.target.value })}
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 outline-none font-bold text-slate-800 focus:ring-4 ring-blue-50"
                                    placeholder="React, Node.js, 1+ year experience" />
                            </div>

                            <div className="grid md:grid-cols-2 gap-8 items-end">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Company Name</label>
                                    <p className="text-sm text-slate-500 bg-slate-50 rounded-2xl px-6 py-4">Logo upload is optional and can be added later.</p>
                                </div>
                                <div className="flex items-center gap-4 pb-2">
                                    <label className="flex items-center gap-3 cursor-pointer">
                                        <input type="checkbox" checked={form.isActive}
                                            onChange={e => setForm({ ...form, isActive: e.target.checked })}
                                            className="w-5 h-5 rounded border-slate-300 text-indigo-600" />
                                        <span className="font-black text-xs uppercase tracking-widest text-slate-600">Active (visible to public)</span>
                                    </label>
                                </div>
                            </div>

                            <button type="submit" disabled={processing}
                                className="w-full py-5 bg-slate-900 text-white rounded-3xl font-black text-lg shadow-xl hover:bg-indigo-600 transition-all active:scale-95">
                                {processing ? 'Saving...' : (editing ? 'Update Job Listing' : 'Post Job Listing')}
                            </button>
                        </form>
                    </div>
                )}

                {/* JOB LIST */}
                <div className="space-y-6">
                    {jobs.length === 0 ? (
                        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                            <div className="text-6xl mb-4">🏢</div>
                            <h2 className="text-2xl font-black text-slate-900 mb-2">No job listings yet</h2>
                            <p className="text-slate-400">Click "Post New Job" to add one.</p>
                        </div>
                    ) : (
                        jobs.map(job => (
                            <div key={job._id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-lg p-8 flex flex-col md:flex-row md:items-center gap-8 group hover:shadow-xl transition-all">
                                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 flex-shrink-0">
                                    <FaBuilding size={24} className="text-slate-300" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${job.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-400'}`}>
                                            {job.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-primary-50 text-primary-600">{job.type}</span>
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900">{job.title}</h3>
                                    <div className="flex flex-wrap gap-6 text-sm text-slate-500 font-bold mt-2">
                                        <span className="flex items-center gap-2"><FaBuilding className="text-slate-300" /> {job.company}</span>
                                        <span className="flex items-center gap-2"><FaMapMarkerAlt className="text-slate-300" /> {job.location}</span>
                                        <span className="flex items-center gap-2 text-red-500"><FaCalendarAlt /> Deadline: {new Date(job.deadline).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="flex gap-3 flex-shrink-0">
                                    <button onClick={() => handleEdit(job)}
                                        className="h-11 w-11 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 hover:bg-blue-500 hover:text-white transition-all">
                                        <FaEdit />
                                    </button>
                                    <button onClick={() => handleDelete(job._id)}
                                        className="h-11 w-11 bg-red-50 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-500 hover:text-white transition-all">
                                        <FaTrash />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobsManagement;
