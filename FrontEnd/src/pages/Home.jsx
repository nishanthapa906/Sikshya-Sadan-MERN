import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const base = "http://localhost:9000/api";
const imgUrl = "http://localhost:9000/uploads";

function Home() {
  const [data, setData] = useState({ banners: [], stats: null, courses: [], tests: [] });
  const [search, setSearch] = useState("");
  const [load, setLoad] = useState(true);
  const nav = useNavigate();

  const get = async () => {
    try {
      setLoad(true);
      const [b, s, c, t] = await Promise.all([
        fetch(`${base}/banners`).then(r=>r.json()).catch(()=>({})),
        fetch(`${base}/stats`).then(r=>r.json()).catch(()=>({})),
        fetch(`${base}/courses?featured=true&limit=6`).then(r=>r.json()).catch(()=>({})),
        fetch(`${base}/public/testimonials`).then(r=>r.json()).catch(()=>({}))
      ]);
      setData({ banners: b.data || [], stats: s.data || null, courses: c.courses || [], tests: t.data?.slice(0,3) || [] });
    } catch { alert("Failed to load"); } finally { setLoad(false); }
  };
  useEffect(() => { get(); }, []);

  const searchSubmit = (e) => { e.preventDefault(); if(search) nav(`/courses?search=${search}`); };
  if (load) return <div className="p-8 text-center text-slate-500 font-bold">Loading Sikshya Sadan...</div>;

  return (
    <div className="font-sans bg-slate-50 pb-12">
      <div className="bg-indigo-900 text-white pt-32 pb-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-black mb-4">Welcome to Sikshya Sadan</h1>
        <p className="text-xl md:text-2xl opacity-90 mb-8">Empowering IT learners in Nepal</p>
        <Link to="/courses" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-bold transition-colors inline-block">Explore Courses</Link>
      </div>

      <div className="max-w-3xl mx-auto -mt-8 relative z-10 bg-white p-6 rounded-xl shadow-lg border border-slate-100 mx-4 md:mx-auto">
        <form onSubmit={searchSubmit} className="flex flex-col sm:flex-row gap-4">
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Find a course..." className="flex-1 p-4 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-lg font-bold transition-colors">Search</button>
        </form>
      </div>

      <div className="flex flex-wrap justify-center gap-12 my-20 px-6 text-center">
        {[['Enrolled Students', data.stats?.totalStudents], ['Global Courses', data.stats?.totalCourses], ['Expert Instructors', data.stats?.totalInstructors], ['Total Enrollments', data.stats?.totalEnrollments]].map(([label, val]) => (
           <div key={label} className="w-1/2 md:w-auto">
             <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-2">{val || 'N/A'}</h2>
             <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">{label}</p>
           </div>
        ))}
      </div>

      <h2 className="text-center text-3xl font-black text-slate-800 mb-8">Top Rated Programs</h2>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
        {data.courses.map(c => (
           <div key={c._id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-xl transition-shadow flex flex-col">
             <img src={`${imgUrl}/${c.thumbnail}`} alt="" className="w-full h-48 object-cover" />
             <div className="p-6 flex flex-col flex-1">
               <h3 className="text-xl font-bold text-slate-800 mb-2">{c.title}</h3>
               <div className="text-slate-500 text-sm mb-4">By {c.instructor?.name} | {c.skillLevel}</div>
               <div className="flex justify-between items-center mt-auto pt-4 border-t border-slate-100">
                 <span className="font-black text-xl text-indigo-600">Rs. {c.fee}</span>
                 <Link to={`/courses/${c._id}`} className="bg-indigo-900 hover:bg-indigo-800 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors">Details</Link>
               </div>
             </div>
           </div>
        ))}
      </div>

      <h2 className="text-center text-3xl font-black text-slate-800 mt-24 mb-10">Alumni Stories</h2>
      <div className="max-w-5xl mx-auto flex flex-wrap gap-8 px-6 justify-center">
         {data.tests.map(t => (
            <div key={t._id} className="flex-1 min-w-[300px] bg-white p-8 rounded-xl border border-slate-200 shadow-sm relative flex flex-col items-center text-center">
               <span className="absolute top-4 right-4 text-4xl text-slate-200 font-serif">"</span>
               <div className="w-20 h-20 rounded-full bg-slate-100 overflow-hidden mb-4 border-4 border-white shadow-sm flex items-center justify-center text-indigo-300 font-black text-2xl">
                  {t.image || t.student?.avatar ? <img src={`${imgUrl}/${t.image || t.student?.avatar}`} alt="" className="w-full h-full object-cover" /> : t.name?.charAt(0)}
               </div>
               <p className="italic text-slate-600 mb-6 relative z-10 leading-relaxed">"{t.comment}"</p>
               <div className="font-bold text-slate-800 mt-auto">{t.name}</div>
               <div className="text-indigo-500 font-medium text-xs uppercase tracking-widest mt-1">{t.role}</div>
            </div>
         ))}
      </div>

      <div className="bg-indigo-900 text-white text-center py-20 px-6 mt-24">
         <h2 className="text-3xl md:text-4xl font-black mb-8">Your Future in Tech Begins Here.</h2>
         <Link to="/admission" className="bg-orange-500 hover:bg-orange-600 text-white px-10 py-4 rounded-xl font-bold text-lg transition-transform hover:scale-105 inline-block">Apply for Admission</Link>
      </div>
    </div>
  );
}

export default Home;