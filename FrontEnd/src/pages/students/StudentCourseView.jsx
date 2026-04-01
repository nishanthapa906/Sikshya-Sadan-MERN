import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { courseAPI, studentAPI, UPLOAD_URL } from '../../services/api';

const StudentCourseView = () => {
  const { id } = useParams();
  const nav = useNavigate();
  const [course, setCourse] = useState(null);
  const [att, setAtt] = useState({ list: [], total: 0, present: 0, pct: 0 });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('syllabus');

  useEffect(() => {
    Promise.all([
      courseAPI.getCourseById(id),
      studentAPI.getMyAttendance(id).catch(() => ({ data: { data: [] } }))
    ]).then(([cr, ar]) => {
      setCourse(cr.data.course);
      const list = ar?.data?.data || [];
      const { total = list.length, present = 0 } = ar?.data?.summary || {};
      setAtt({ list, total, present, pct: total > 0 ? Math.round((present / total) * 100) : 0 });
    }).catch(() => { alert('Not enrolled'); nav(`/course/${id}`); }).finally(() => setLoading(false));
  }, [id, nav]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;
  if (!course) return <div className="p-8 text-center text-red-500 font-bold">Not found</div>;

  return (
    <div className="max-w-6xl mx-auto my-10 px-6 font-sans">
      <div className="bg-slate-900 text-white p-8 md:p-12 rounded-3xl mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-xl">
        <div>
          <span className="bg-emerald-500 px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase">Enrolled</span>
          <h1 className="text-3xl md:text-5xl font-black mt-4 mb-2">{course.title}</h1>
          <p className="text-slate-400 font-medium">Instructor: {course.instructor?.name || 'Admin'}</p>
        </div>
        <Link to="/student/dashboard" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl font-bold transition-colors">Back to Dashboard</Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {['syllabus', 'resources', 'attendance'].map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-6 py-3 rounded-xl font-bold capitalize transition-colors whitespace-nowrap ${tab === t ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>{t}</button>
        ))}
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        {tab === 'syllabus' && (
          <div>
            {course.syllabusFile && <a href={`${UPLOAD_URL}/${course.syllabusFile}`} target="_blank" rel="noreferrer" className="inline-block mb-6 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-bold transition-colors">Download Syllabus PDF</a>}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><th className="p-4 font-black">Week</th><th className="p-4 font-black">Topic</th></tr></thead>
                <tbody>
                  {course.syllabus?.map((s, i) => <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 last:border-0"><td className="p-4 font-black text-slate-400 w-20">{s.week}</td><td className="p-4"><strong className="text-slate-800 block mb-1">{s.topic}</strong><span className="text-slate-500 text-sm leading-relaxed">{s.description}</span></td></tr>)}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {tab === 'resources' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead><tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><th className="p-4 font-black">Title</th><th className="p-4 font-black">Type</th><th className="p-4 font-black">Link</th></tr></thead>
              <tbody>
                {course.resources?.map((r, i) => <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 last:border-0"><td className="p-4 font-bold text-slate-800">{r.title}</td><td className="p-4 text-slate-500 text-sm">{r.type}</td><td className="p-4"><a href={`${UPLOAD_URL}/${r.fileUrl}`} target="_blank" rel="noreferrer" className="text-indigo-600 font-bold hover:underline">View</a></td></tr>)}
                {(!course.resources || course.resources.length === 0) && <tr><td colSpan="3" className="p-8 text-center text-slate-400 font-bold">No resources uploaded.</td></tr>}
              </tbody>
            </table>
          </div>
        )}
        {tab === 'attendance' && (
          <div>
            <div className="flex flex-col sm:flex-row gap-6 mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div><span className="block text-2xl font-black text-slate-800">{att.present} / {att.total}</span> <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Classes Attended</span></div>
              <div className="sm:border-l border-slate-200 sm:pl-6"><span className="block text-2xl font-black text-indigo-600">{att.pct}%</span> <span className="text-xs uppercase tracking-widest text-slate-500 font-bold">Attendance Rate</span></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead><tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500"><th className="p-4 font-black">Date</th><th className="p-4 font-black">Status</th></tr></thead>
                <tbody>
                  {att.list.map((a, i) => <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 last:border-0"><td className="p-4 font-medium text-slate-800">{new Date(a.date).toLocaleDateString()}</td><td className="p-4"><span className={`px-2 py-1 rounded text-xs font-black uppercase tracking-widest ${a.status === 'present' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{a.status}</span></td></tr>)}
                  {att.list.length === 0 && <tr><td colSpan="2" className="p-8 text-center text-slate-400 font-bold">No attendance records.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentCourseView;