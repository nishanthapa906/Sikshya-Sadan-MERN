import React, { useState, useEffect } from 'react';
import { jobAPI } from '../../services/api';

const JobsManagement = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [showForm, setShowForm] = useState(false);
    
    const initialForm = { title: '', company: '', location: '', type: 'Full-time', description: '', requirements: '', applyLink: '', deadline: '', isActive: true };
    const [form, setForm] = useState(initialForm);

    const load = async () => {
        setLoading(true);
        jobAPI.getAll().then(res => setJobs(res.data.data.jobs || [])).catch(() => alert('Failed to load')).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const edit = (j) => {
        setEditing(j._id);
        setForm({ ...j, requirements: Array.isArray(j.requirements) ? j.requirements.join(', ') : '', deadline: j.deadline ? new Date(j.deadline).toISOString().split('T')[0] : '' });
        setShowForm(true);
        window.scrollTo(0,0);
    };

    const submit = async (e) => {
        e.preventDefault();
        const payload = { ...form, requirements: form.requirements.split(',').map(r => r.trim()).filter(Boolean) };
        try {
            if (editing) await jobAPI.update(editing, payload);
            else await jobAPI.create(payload);
            setShowForm(false); setEditing(null); setForm(initialForm); load();
        } catch (err) { alert(err.response?.data?.message || 'Failed to save job'); }
    };

    const del = async (id) => {
        if (!confirm('Delete job?')) return;
        try { await jobAPI.delete(id); load(); } catch (err) { alert(err.response?.data?.message || 'Failed to delete'); }
    };

    if (loading) return <div className="p-12 text-center font-bold text-slate-500 min-h-[50vh] flex justify-center items-center">Loading...</div>;

    return (
        <div className="max-w-5xl mx-auto my-10 p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
                <h1 className="text-3xl font-black text-slate-800">Manage Jobs</h1>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(initialForm); }} className="bg-slate-900 hover:bg-slate-800 text-white border-0 px-6 py-3 rounded-xl font-bold transition-colors">
                    {showForm ? 'Close Form' : 'Post New Job'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-12">
                    <h3 className="text-xl font-black text-slate-800 mb-6 pb-4 border-b border-slate-100">{editing ? 'Edit Job' : 'Create New Job'}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Title</label><input required value={form.title} onChange={e=>setForm({...form, title: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                        <div><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Company</label><input required value={form.company} onChange={e=>setForm({...form, company: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                        <div><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Location</label><input required value={form.location} onChange={e=>setForm({...form, location: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                        <div><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Type</label><select value={form.type} onChange={e=>setForm({...form, type: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"><option>Full-time</option><option>Part-time</option><option>Internship</option></select></div>
                        <div><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Apply Link</label><input required type="url" value={form.applyLink} onChange={e=>setForm({...form, applyLink: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                        <div><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Deadline</label><input required type="date" value={form.deadline} onChange={e=>setForm({...form, deadline: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                    </div>
                    <div className="mb-6"><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Description</label><textarea required rows={4} value={form.description} onChange={e=>setForm({...form, description: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800 resize-none"/></div>
                    <div className="mb-6"><label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Requirements (comma sep)</label><input value={form.requirements} onChange={e=>setForm({...form, requirements: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                    
                    <div className="mb-8 flex items-center gap-3">
                        <input type="checkbox" id="isActive" checked={form.isActive} onChange={e=>setForm({...form, isActive: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"/> 
                        <label htmlFor="isActive" className="text-sm font-bold text-slate-700 cursor-pointer">Active Listing</label>
                    </div>
                    <div className="flex justify-end border-t border-slate-100 pt-6">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors">Save Job</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead><tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                        <th className="p-4 font-black">Job</th>
                        <th className="p-4 font-black">Company</th>
                        <th className="p-4 font-black">Status</th>
                        <th className="p-4 font-black text-center">Actions</th>
                    </tr></thead>
                    <tbody>
                        {jobs.map(j => (
                            <tr key={j._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                                <td className="p-4"><strong className="text-slate-800 block mb-1">{j.title}</strong><span className="text-xs uppercase tracking-widest font-bold text-slate-400">{j.type} | <span className={new Date(j.deadline) < new Date() ? 'text-red-500' : 'text-emerald-500'}>Due {new Date(j.deadline).toLocaleDateString()}</span></span></td>
                                <td className="p-4 text-slate-800 font-medium">{j.company}<br/><span className="text-xs text-slate-500">{j.location}</span></td>
                                <td className="p-4 font-black text-xs uppercase tracking-widest"><span className={`px-2 py-1 rounded ${j.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{j.isActive ? 'Active' : 'Inactive'}</span></td>
                                <td className="p-4 text-center whitespace-nowrap space-x-2">
                                    <button onClick={() => edit(j)} className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Edit</button>
                                    <button onClick={() => del(j._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Del</button>
                                </td>
                            </tr>
                        ))}
                        {jobs.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-bold">No jobs posted yet.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default JobsManagement;
