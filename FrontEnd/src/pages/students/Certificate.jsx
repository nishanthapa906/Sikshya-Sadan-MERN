import React, { useEffect, useState } from 'react';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaAward, FaDownload, FaImage } from 'react-icons/fa';

const Certificates = () => {
    const [certs, setCerts] = useState([]);
    const [waiting, setWaiting] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        const load = async () => {
            try {
                const res = await studentAPI.getMyCertificates();
                // Rely directly on the returned certs now that we bypassed the old complex model
                setCerts(res.data?.data || []);
                const cRes = await studentAPI.getMyCourses();
                setWaiting((cRes.data?.enrollments || []).filter(e => e.status === 'completed' && !e.certificateIssued));
            } catch (e) { 
                setErr('Failed to load certificates'); 
            } finally { 
                setLoading(false); 
            }
        };
        load();
    }, []);

    if (loading) return <div className="p-12 text-center font-bold text-slate-500 flex justify-center items-center">Loading Certificates...</div>;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-black text-slate-800 mb-8">My Certificates</h1>
            
            {err && <div className="p-4 bg-red-50 text-red-600 rounded-xl mb-6 font-bold">{err}</div>}
            
            {waiting.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-8 shadow-sm">
                    <strong className="text-amber-800 font-black block mb-3 uppercase text-xs tracking-widest">Awaiting Instructor Upload:</strong>
                    <ul className="space-y-2">
                        {waiting.map(e => (
                            <li key={e._id} className="text-amber-700 font-medium flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                                {e.course?.title}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {certs.length === 0 ? (
                <div className="text-center p-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
                    <FaAward className="text-6xl text-slate-200 mx-auto mb-4" />
                    <h2 className="text-xl font-black text-slate-800 mb-2">No certificates yet</h2>
                    <p className="text-slate-500 font-medium">Complete your course and ask your instructor to upload your certificate.</p>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-widest text-slate-500">
                                <th className="p-4 font-black">Preview</th>
                                <th className="p-4 font-black">Course</th>
                                <th className="p-4 font-black hidden sm:table-cell">Issued Date</th>
                                <th className="p-4 font-black text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {certs.map(c => {
                                // Since certificateUrl in backend is already prepended with /uploads/ or absolute, we can use it directly depending on string format.
                                const url = c.certificateImage?.startsWith('http') ? c.certificateImage : `${UPLOAD_URL.replace('/uploads', '')}${c.certificateImage}`;
                                
                                return (
                                    <tr key={c._id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="p-4">
                                            <div className="w-24 h-16 bg-slate-100 rounded-lg overflow-hidden border border-slate-200 shadow-sm">
                                                <img src={url} alt={c.course?.title} className="w-full h-full object-cover" />
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="font-bold text-slate-800 text-lg">{c.course?.title}</div>
                                            <div className="text-indigo-600 text-xs font-bold uppercase tracking-widest mt-1">Certified</div>
                                        </td>
                                        <td className="p-4 hidden sm:table-cell text-slate-500 font-medium text-sm">
                                            {new Date(c.issuedDate).toLocaleDateString()}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex justify-end gap-2">
                                                <a href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors">
                                                    <FaImage /> View
                                                </a>
                                                <a href={url} download className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors">
                                                    <FaDownload /> Download
                                                </a>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Certificates;
