import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';

const InstructorAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selCourse, setSelCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ title: '', description: '', dueDate: '', maxMarks: 100 });
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { instructorAPI.getMyCourses().then(res => setCourses(res.data.courses || [])).finally(() => setLoading(false)); }, []);
    useEffect(() => { 
        if (selCourse) instructorAPI.getCourseAssignments(selCourse).then(res => setAssignments(res.data.data || res.data.assignments || [])); 
    }, [selCourse]);

    const submit = async (e) => {
        e.preventDefault();
        try {
            const fd = new FormData();
            Object.keys(form).forEach(k => fd.append(k, k === 'dueDate' ? new Date(form[k]).toISOString() : form[k]));
            files.forEach(f => fd.append('attachments', f));
            await instructorAPI.createAssignment(selCourse, fd);
            alert('Created!'); setShowForm(false); setForm({ title: '', description: '', dueDate: '', maxMarks: 100 }); setFiles([]);
            instructorAPI.getCourseAssignments(selCourse).then(res => setAssignments(res.data.data || res.data.assignments || []));
        } catch { alert('Failed to create'); }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 p-6 font-sans">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
                <h1 className="text-3xl font-black text-slate-800">Manage Assignments</h1>
                {selCourse && <button onClick={() => setShowForm(!showForm)} className="bg-slate-900 hover:bg-slate-800 text-white border-0 px-6 py-3 rounded-xl font-bold transition-colors">{showForm ? 'Cancel Form' : 'New Assignment'}</button>}
            </div>

            <select value={selCourse} onChange={e => setSelCourse(e.target.value)} className="w-full max-w-sm mb-8 p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800">
                <option value="">-- Select Course --</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
            </select>

            {showForm && (
                <form onSubmit={submit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Title</label><input required value={form.title} onChange={e=>setForm({...form, title:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Max Marks</label><input required type="number" value={form.maxMarks} onChange={e=>setForm({...form, maxMarks:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Due Date</label><input required type="datetime-local" value={form.dueDate} onChange={e=>setForm({...form, dueDate:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium text-slate-800"/></div>
                        <div><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Attachments</label><input type="file" multiple onChange={e=>setFiles(Array.from(e.target.files))} className="w-full p-2 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/></div>
                    </div>
                    <div className="mb-8"><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Description</label><textarea required rows={3} value={form.description} onChange={e=>setForm({...form, description:e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium resize-none"/></div>
                    <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold transition-colors">Create Assignment</button>
                </form>
            )}

            {selCourse && (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead><tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><th className="p-4 font-black">Title & Details</th><th className="p-4 font-black">Due Date</th><th className="p-4 font-black">Marks</th><th className="p-4 font-black">Attachments</th></tr></thead>
                        <tbody>
                            {assignments.length===0 ? <tr><td colSpan="4" className="p-8 text-center text-slate-400 font-bold">No assignments yet.</td></tr> : assignments.map(a => (
                                <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                                    <td className="p-4"><div className="font-bold text-slate-800">{a.title}</div><div className="text-sm text-slate-500 mt-1 line-clamp-2">{a.description}</div></td>
                                    <td className="p-4 text-sm font-bold"><span className={new Date(a.dueDate) < new Date() ? 'text-red-500' : 'text-emerald-500'}>{new Date(a.dueDate).toLocaleString()}</span></td>
                                    <td className="p-4 font-black text-slate-800">{a.maxMarks}</td>
                                    <td className="p-4 text-sm space-y-1">{a.attachments?.map((f, i) => <a key={i} href={`${UPLOAD_URL}/${f}`} target="_blank" rel="noreferrer" className="block text-indigo-600 hover:underline">File {i+1}</a>)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default InstructorAssignments;
