import React, { useState, useEffect } from 'react';
import { publicAPI, contactAPI } from '../services/api';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaPaperPlane, FaClock, FaCommentDots } from 'react-icons/fa';

const Contact = () => {
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [status, setStatus] = useState({ type: '', msg: '' });

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await publicAPI.getSettings();
                setSettings(res.data.data.settings);
            } catch (err) {
                console.error(err);
            }
        };
        fetchSettings();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: '', msg: '' });

        try {
            await contactAPI.sendMessage(formData);
            setStatus({ type: 'success', msg: "Thank you! Your message has been sent successfully." });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (err) {
            setStatus({ type: 'error', msg: "Something went wrong. Please try again later." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-slate-50 min-h-screen pt-24 pb-24">
            <div className="container mx-auto px-6">
                <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
                    <span className="text-primary-600 font-black uppercase text-xs tracking-widest bg-primary-50 px-6 py-2 rounded-full">Get In Touch</span>
                    <h1 className="text-5xl font-black text-slate-900 italic">Let's Talk About Your Career</h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Have questions about our courses, placements, or admission process? Our team is here to help you choose the right path.
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
                    {/* CONTACT INFOCARDS */}
                    <div className="lg:col-span-1 space-y-8">
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-900 hover:text-white transition-all duration-300">
                            <div className="h-16 w-16 bg-blue-50 rounded-2xl flex items-center justify-center text-primary-600 mb-6 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                <FaPhone size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Call Us</h3>
                            <p className="text-slate-500 group-hover:text-slate-300 font-medium">{settings?.phone || '+977-1-1234567'}</p>
                            <p className="text-xs mt-4 text-primary-600 group-hover:text-primary-400 font-black uppercase tracking-widest">Available 9AM - 6PM</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-900 hover:text-white transition-all duration-300">
                            <div className="h-16 w-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                <FaEnvelope size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Email Us</h3>
                            <p className="text-slate-500 group-hover:text-slate-300 font-medium">{settings?.email || 'info@sikshyasadan.com'}</p>
                            <p className="text-xs mt-4 text-primary-600 group-hover:text-primary-400 font-black uppercase tracking-widest">24/7 Response Rate</p>
                        </div>
                        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl border border-slate-100 flex flex-col items-center text-center group cursor-pointer hover:bg-slate-900 hover:text-white transition-all duration-300">
                            <div className="h-16 w-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-6 group-hover:bg-white/10 group-hover:text-white transition-colors">
                                <FaMapMarkerAlt size={24} />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                            <p className="text-slate-500 group-hover:text-slate-300 font-medium">{settings?.address || 'Kathmandu, Nepal'}</p>
                            <p className="text-xs mt-4 text-primary-600 group-hover:text-primary-400 font-black uppercase tracking-widest">Corporate Head Office</p>
                        </div>
                    </div>

                    {/* CONTACT FORM */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-[3.5rem] shadow-2xl border border-slate-100 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 h-40 w-40 bg-primary-600/5 rounded-full -mr-20 -mt-20"></div>
                            <div className="relative z-10 flex items-center gap-4 text-primary-600 font-black text-2xl uppercase tracking-wider mb-2">
                                <FaCommentDots size={32} /> Send an Inquiry
                            </div>

                            {status.msg && (
                                <div className={`p-6 rounded-2xl text-sm font-bold animate-fadeIn ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                    {status.msg}
                                </div>
                            )}

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 ring-primary-100 transition-all outline-none font-bold text-slate-800"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 ring-primary-100 transition-all outline-none font-bold text-slate-800"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Subject</label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-2 ring-primary-100 transition-all outline-none font-bold text-slate-800"
                                    placeholder="Inquiry about MERN Stack course"
                                    value={formData.subject}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400 ml-4">Your Message</label>
                                <textarea
                                    rows="5"
                                    name="message"
                                    required
                                    className="w-full bg-slate-50 border-0 rounded-3xl px-6 py-4 focus:ring-2 ring-primary-100 transition-all outline-none font-bold text-slate-800 resize-none"
                                    placeholder="Write your message here..."
                                    value={formData.message}
                                    onChange={handleChange}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-5 bg-slate-900 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-4 hover:bg-primary-600 transition-all shadow-xl disabled:bg-slate-400"
                            >
                                {isSubmitting ? 'Sending Request...' : 'Submit Inquiry'} <FaPaperPlane />
                            </button>
                        </form>
                    </div>
                </div>

                {/* MAP SECTION */}
                <div className="mt-24 rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white h-[500px] relative">
                    <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3532.240403125232!2d85.3123333150619!3d27.70895598279093!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb1907b1e42b6d%3A0xe54d6f8303fdef5b!2sKathmandu%2044600!5e0!3m2!1sen!2snp!4v1676900000000!5m2!1sen!2snp"
                        width="100%"
                        height="100%"
                        style={{ border: 0 }}
                        allowFullScreen=""
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="location map"
                    ></iframe>
                    <div className="absolute bottom-10 left-10 bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-2xl border border-white/50 max-w-sm hidden md:block">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-10 w-10 bg-primary-600 text-white rounded-xl flex items-center justify-center">
                                <FaMapMarkerAlt />
                            </div>
                            <h4 className="font-bold text-slate-900">Our Location</h4>
                        </div>
                        <p className="text-slate-600 font-medium text-sm leading-relaxed">
                            Visit our training center anytime during office hours for a free consultation walk-through.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
