import React, { useState, useEffect } from 'react';
import { publicAPI, contactAPI } from '../services/api';

const Contact = () => {
    const [info, setInfo] = useState(null);
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
    const [load, setLoad] = useState(false);

    useEffect(() => {
        publicAPI.getSettings().then(res => setInfo(res.data.data.settings)).catch(() => {});
    }, []);

    const submit = async (e) => {
        e.preventDefault(); setLoad(true);
        try {
            await contactAPI.sendMessage(form);
            alert('Message Sent!'); setForm({ name: '', email: '', subject: '', message: '' });
        } catch { alert('Failed to send message'); }
        finally { setLoad(false); }
    };

    return (
        <div className="max-w-5xl mx-auto my-16 px-6 font-sans">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-black text-slate-800 mb-4">Contact Us</h1>
                <p className="text-slate-500 text-lg">Have questions? Send us a message and we will get back to you soon.</p>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
                <div className="flex-1 bg-slate-50 p-8 rounded-2xl border border-slate-200 self-start">
                    <h3 className="text-xl font-black text-slate-800 mb-6">Contact Info</h3>
                    <div className="space-y-4 text-slate-700">
                        <p><strong className="text-slate-900 block text-xs uppercase tracking-widest mb-1">Phone</strong> {info?.phone || '+977-1-1234567'}</p>
                        <p><strong className="text-slate-900 block text-xs uppercase tracking-widest mb-1">Email</strong> {info?.email || 'info@sikshyasadan.com'}</p>
                        <p><strong className="text-slate-900 block text-xs uppercase tracking-widest mb-1">Address</strong> {info?.address || 'Kathmandu, Nepal'}</p>
                    </div>
                    <hr className="my-6 border-slate-200" />
                    <p className="text-slate-500 text-sm font-medium">Mon – Fri, <br/> 9:00 AM to 6:00 PM</p>
                </div>

                <div className="flex-[2] bg-white p-8 md:p-10 rounded-2xl border border-slate-200 shadow-sm">
                    <form onSubmit={submit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Name</label>
                                <input required value={form.name} onChange={e=>setForm({...form, name: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium" />
                            </div>
                            <div>
                                <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Email</label>
                                <input required type="email" value={form.email} onChange={e=>setForm({...form, email: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Subject</label>
                            <input required value={form.subject} onChange={e=>setForm({...form, subject: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium" />
                        </div>
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-500 mb-2">Message</label>
                            <textarea required rows={5} value={form.message} onChange={e=>setForm({...form, message: e.target.value})} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-slate-800 font-medium resize-none" />
                        </div>
                        <button type="submit" disabled={load} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl transition-colors">
                            {load ? 'Sending...' : 'Send Message'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
