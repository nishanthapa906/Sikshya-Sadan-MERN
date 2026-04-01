import React, { useState, useEffect } from 'react';
import { publicAPI, UPLOAD_URL } from '../services/api';

const About = () => {
    const [data, setData] = useState({ s: null, i: [], p: [] });
    const [load, setLoad] = useState(true);

    useEffect(() => {
        Promise.all([publicAPI.getSettings(), publicAPI.getInstructors()]).then(([sRes, iRes]) => {
            setData({ s: sRes.data.data.settings, p: sRes.data.data.partners, i: iRes.data.data });
        }).catch(() => alert('Failed to load')).finally(() => setLoad(false));
    }, []);

    if (load) return <div className="p-8 text-center text-slate-500 font-bold">Loading...</div>;

    return (
        <div className="font-sans pb-12">
            <div className="bg-slate-900 text-white py-20 px-6 text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4">Empowering Nepal's IT Ecosystem</h1>
                <p className="max-w-3xl mx-auto text-xl text-slate-300">Sikshya Sadan is dedicated to bridging the talent gap in Nepal's tech industry.</p>
            </div>

            <div className="max-w-6xl mx-auto my-16 px-6 flex flex-col md:flex-row gap-8">
                <div className="flex-1 bg-slate-50 p-8 md:p-12 rounded-2xl border border-slate-200">
                    <h2 className="text-2xl font-black text-slate-800 mb-4">Our Mission</h2>
                    <p className="italic text-slate-600 text-lg">"{data.s?.mission || 'To provide world-class IT education.'}"</p>
                </div>
                <div className="flex-1 bg-slate-900 text-white p-8 md:p-12 rounded-2xl">
                    <h2 className="text-2xl font-black mb-4">Our Vision</h2>
                    <p className="italic text-slate-300 text-lg">"{data.s?.vision || 'To become the benchmark for technical excellence.'}"</p>
                </div>
            </div>

            <h2 className="text-center text-3xl font-black text-slate-800 mt-20 mb-10">Our Instructors</h2>
            <div className="max-w-6xl mx-auto flex flex-wrap justify-center gap-8 px-6">
                {data.i.map(ins => (
                    <div key={ins._id} className="w-full sm:w-64 bg-white border border-slate-200 rounded-2xl p-6 text-center shadow-sm">
                        <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-indigo-100 flex items-center justify-center overflow-hidden text-3xl font-black text-indigo-500">
                            {ins.avatar ? <img src={`${UPLOAD_URL}/${ins.avatar}`} alt="" className="w-full h-full object-cover" /> : ins.name.charAt(0)}
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">{ins.name}</h3>
                        <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">{ins.expertise?.slice(0, 3).join(', ')}</p>
                    </div>
                ))}
            </div>

            <h2 className="text-center text-3xl font-black text-slate-800 mt-24 mb-10">Our Partners</h2>
            <div className="flex justify-center items-center flex-wrap gap-12 px-6 py-8">
                {data.p?.map(p => (
                    <img key={p._id} src={`${UPLOAD_URL}/${p.logo}`} alt={p.name} className="h-10 object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer" />
                ))}
            </div>
        </div>
    );
};

export default About;
