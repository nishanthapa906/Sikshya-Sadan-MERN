import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';

const GradeAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selCourse, setSelCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [subs, setSubs] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({ grade: '', feedback: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => { instructorAPI.getMyCourses().then(res => setCourses(res.data.courses || [])).finally(() => setLoading(false)); }, []);
    useEffect(() => { 
        if (selCourse) instructorAPI.getCourseAssignments(selCourse).then(res => setAssignments(res.data.data || res.data.assignments || [])); 
        setSubs([]); setSelected(null);
    }, [selCourse]);

    const fetchSubs = async (id) => {
        try { const res = await instructorAPI.getAssignmentSubmissions(id); setSubs(res.data.data || res.data.submissions || []); } 
        catch { alert('Failed to load submissions'); }
    };

    const submitGrade = async (e) => {
        e.preventDefault();
        try {
            await instructorAPI.gradeSubmission(selected._id, { grade: Number(form.grade), feedback: form.feedback });
            alert('Graded!'); setSelected(null); setForm({ grade: '', feedback: '' }); fetchSubs(selected.assignment);
        } catch { alert('Failed to grade'); }
    };

    if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto my-10 p-6 font-sans">
            <h1 className="text-3xl font-black text-slate-800 mb-8">Grade Submissions</h1>
            
            <div className="mb-8">
                <select value={selCourse} onChange={e => setSelCourse(e.target.value)} className="w-full max-w-sm p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium">
                    <option value="">-- Select Course TO Grade --</option>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.title}</option>)}
                </select>
            </div>

            {selCourse && (
                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-800 mb-4">Assignments</h3>
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                                        <th className="p-4 font-black">Title</th>
                                        <th className="p-4 font-black">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {assignments.map(a => (
                                        <tr key={a._id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                                            <td className="p-4 font-bold text-slate-800">{a.title}</td>
                                            <td className="p-4"><button onClick={() => fetchSubs(a._id)} className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg text-xs font-bold transition-colors">View Subs</button></td>
                                        </tr>
                                    ))}
                                    {assignments.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-slate-400 font-bold">No assignments found.</td></tr>}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="flex-[2] flex flex-col gap-8">
                        {subs.length > 0 && (
                            <div>
                                <h3 className="text-xl font-black text-slate-800 mb-4">Submissions</h3>
                                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                                    <table className="w-full text-left">
                                        <thead>
                                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                                                <th className="p-4 font-black">Student</th>
                                                <th className="p-4 font-black">Status</th>
                                                <th className="p-4 font-black">Grade</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {subs.map(s => (
                                                <tr key={s._id} className="border-b border-slate-100 hover:bg-slate-50 last:border-0">
                                                    <td className="p-4 font-bold text-slate-800">{s.student?.name}</td>
                                                    <td className="p-4 text-xs font-black uppercase tracking-widest">
                                                        <span className={`px-2 py-1 rounded-md ${s.status === 'graded' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>{s.status}</span>
                                                    </td>
                                                    <td className="p-4 font-bold text-slate-800">
                                                        {s.status === 'graded' ? `${s.grade}` : <button onClick={() => setSelected(s)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors">Grade</button>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {selected && (
                            <form onSubmit={submitGrade} className="bg-slate-50 p-8 rounded-2xl border border-slate-200 shadow-sm">
                                <h4 className="text-xl font-black text-slate-800 mb-6 border-b border-slate-200 pb-4">Grading: {selected.student?.name}</h4>
                                <div className="mb-6"><a href={`${UPLOAD_URL}/${selected.fileUrl}`} target="_blank" rel="noreferrer" className="inline-block bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl text-sm font-bold transition-colors">View Submitted Document</a></div>
                                <div className="mb-6"><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Assign Grade (0-100)</label><input type="number" required min="0" max="100" value={form.grade} onChange={e=>setForm({...form, grade: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold" /></div>
                                <div className="mb-8"><label className="block text-xs font-black tracking-widest uppercase text-slate-500 mb-2">Teacher Feedback</label><textarea required rows={3} value={form.feedback} onChange={e=>setForm({...form, feedback: e.target.value})} className="w-full p-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none font-medium" /></div>
                                <div className="flex gap-4">
                                    <button type="submit" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl font-bold transition-colors">Submit Grade</button>
                                    <button type="button" onClick={() => setSelected(null)} className="flex-1 bg-slate-200 hover:bg-slate-300 text-slate-700 py-4 rounded-xl font-bold transition-colors">Cancel</button>
                                </div>
                            </form>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GradeAssignments;
