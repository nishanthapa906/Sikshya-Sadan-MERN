import React, { useState, useEffect } from 'react';
import { courseAPI, UPLOAD_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const ManageCourses = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [syllabus, setSyllabus] = useState([{ week: 1, topic: '', description: '' }]);
    
    const initialCourse = { title: '', category: 'Programming', skillLevel: 'Beginner', duration: '', fee: '', description: '', startDate: '', installmentAvailable: false, prerequisites: '' };
    const [form, setForm] = useState(initialCourse);
    const [files, setFiles] = useState({ thumb: null, pdf: null });

    const categories = ['Programming', 'Web Development', 'Data Science', 'Graphic Design', 'Mobile Development', 'Cloud Computing', 'Cybersecurity', 'Other'];

    const load = async () => {
        setLoading(true);
        courseAPI.getInstructorCourses().then(res => setCourses(res.data.courses || [])).catch(() => alert('Failed to load courses')).finally(() => setLoading(false));
    };
    useEffect(() => { load(); }, []);

    const edit = (c) => {
        setEditing(c._id); setShowForm(true);
        setForm({ ...c, prerequisites: Array.isArray(c.prerequisites) ? c.prerequisites.join(', ') : c.prerequisites || '', startDate: c.startDate ? new Date(c.startDate).toISOString().split('T')[0] : '' });
        setSyllabus(c.syllabus?.length > 0 ? c.syllabus : [{ week: 1, topic: '', description: '' }]);
        setFiles({ thumb: null, pdf: null });
        window.scrollTo(0,0);
    };

    const submit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(form).forEach(k => {
                if(k === 'prerequisites') fd.append(k, JSON.stringify(form.prerequisites.split(',').map(i=>i.trim()).filter(Boolean)));
                else fd.append(k, form[k]);
            });
            fd.append('syllabus', JSON.stringify(syllabus));
            if (files.thumb) fd.append('thumbnail', files.thumb);
            if (files.pdf) fd.append('syllabusFile', files.pdf);

            if (editing) await courseAPI.updateCourse(editing, fd);
            else await courseAPI.createCourse(fd);
            
            setShowForm(false); setEditing(null); setForm(initialCourse); setSyllabus([{ week: 1, topic: '', description: '' }]); setFiles({ thumb: null, pdf: null });
            load();
        } catch (err) { alert(err.response?.data?.message || 'Failed'); }
    };

    const del = async (id) => {
        if(!confirm('Delete course?')) return;
        try { await courseAPI.deleteCourse(id); load(); } catch { alert('Failed'); }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-slate-800">Manage Courses</h1>
                <button onClick={() => { setShowForm(!showForm); setEditing(null); setForm(initialCourse); }} className="bg-slate-900 hover:bg-slate-800 text-white border-0 px-6 py-3 rounded-xl font-bold transition-colors">
                    {showForm ? 'Close Form' : 'New Course'}
                </button>
            </div>

            {showForm && (
                <form onSubmit={submit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Title</label><input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"/></div>
                        <div>
                            <label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Category</label>
                            <select 
                                required 
                                value={form.category} 
                                onChange={e=>setForm({...form, category:e.target.value})} 
                                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium cursor-pointer"
                            >
                                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                            </select>
                        </div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Skill Level</label><select value={form.skillLevel} onChange={e=>setForm({...form, skillLevel:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"><option>Beginner</option><option>Intermediate</option><option>Advanced</option></select></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Duration (Hrs)</label><input required type="number" value={form.duration} onChange={e=>setForm({...form, duration:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Fee (Rs)</label><input required type="number" value={form.fee} onChange={e=>setForm({...form, fee:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Start Date</label><input required type="date" value={form.startDate} onChange={e=>setForm({...form, startDate:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Prerequisites</label><input value={form.prerequisites} onChange={e=>setForm({...form, prerequisites:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium" placeholder="comma separated"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Thumbnail & PDF Syllabus</label><div className="flex gap-4"><input type="file" onChange={e=>setFiles({...files, thumb:e.target.files[0]})} accept="image/*" className="w-1/2 p-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" /><input type="file" onChange={e=>setFiles({...files, pdf:e.target.files[0]})} accept=".pdf" className="w-1/2 p-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" /></div></div>
                    </div>
                    <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Description</label><textarea required rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800 font-medium resize-none"/></div>
                    <div className="my-6 flex items-center gap-3"><input type="checkbox" id="inst" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" checked={form.installmentAvailable} onChange={e=>setForm({...form, installmentAvailable:e.target.checked})}/> <label htmlFor="inst" className="text-sm font-bold text-slate-700 cursor-pointer">Installments Available</label></div>
                    
                    <h4 className="text-xl font-black text-slate-800 mb-4 mt-8 pt-8 border-t border-slate-100">Syllabus</h4>
                    <div className="space-y-4">
                        {syllabus.map((s, i) => (
                            <div key={i} className="flex flex-col sm:flex-row gap-4">
                                <input value={s.topic} onChange={e => { const n = [...syllabus]; n[i].topic = e.target.value; setSyllabus(n); }} placeholder="Topic" className="flex-1 p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                                <input value={s.description} onChange={e => { const n = [...syllabus]; n[i].description = e.target.value; setSyllabus(n); }} placeholder="Description" className="flex-[2] p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium" required />
                                <button type="button" onClick={() => setSyllabus(syllabus.filter((_, idx) => idx !== i))} className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors shrink-0">X</button>
                            </div>
                        ))}
                    </div>
                    <button type="button" onClick={() => setSyllabus([...syllabus, { week: syllabus.length + 1, topic:'', description:'' }])} className="mt-4 mb-8 text-indigo-600 font-bold hover:text-indigo-800">+ Add Module</button>
                    <div className="flex justify-end pt-6 border-t border-slate-100">
                        <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors">Save Course</button>
                    </div>
                </form>
            )}

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                            <th className="p-4 font-black">Course</th>
                            <th className="p-4 font-black">Details</th>
                            <th className="p-4 font-black">Enrolled</th>
                            <th className="p-4 font-black text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map(c => (
                            <tr key={c._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors last:border-0">
                                <td className="p-4 font-bold text-slate-800">{c.title} <br/><span className="text-xs text-slate-400 font-medium uppercase tracking-widest">{c.category}</span></td>
                                <td className="p-4 text-sm text-slate-600 font-medium">Rs. {c.fee} <br/> {c.duration}hrs | {c.skillLevel}</td>
                                <td className="p-4 font-black text-indigo-600 text-lg">{c.enrolledStudents || 0}</td>
                                <td className="p-4 text-center whitespace-nowrap space-x-2">
                                    <button onClick={() => edit(c)} className="bg-amber-100 hover:bg-amber-200 text-amber-700 px-4 py-2 rounded-lg font-bold text-xs transition-colors">Edit</button>
                                    {user?.role === 'admin' && <button onClick={() => del(c._id)} className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors">Del</button>}
                                </td>
                            </tr>
                        ))}
                        {courses.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-bold">No courses found.</td></tr>}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageCourses;
