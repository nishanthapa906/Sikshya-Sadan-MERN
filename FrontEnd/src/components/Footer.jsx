import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaChevronRight, FaGraduationCap } from 'react-icons/fa';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    const [settings, setSettings] = useState(null);

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

    return (
        <footer className="bg-slate-900 pt-16 pb-8 text-white border-t border-slate-800">

            <div className="container mx-auto px-4 sm:px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
                    {/* BRANDING */}
                    <div className="space-y-8">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="h-10 w-10 bg-primary-600 rounded-xl flex items-center justify-center">
                                <FaGraduationCap size={24} />
                            </div>
                            <span className="text-2xl font-black italic tracking-tighter">SIKSHYA SADAN</span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Leading IT training institute in Nepal, dedicated to providing industry-standard technical education and career guidance to help you reach your maximum potential.
                        </p>
                        <div className="flex gap-4">
                            {[FaFacebook, FaLinkedin, FaInstagram, FaTwitter].map((Icon, idx) => (
                                <button key={idx} className="h-10 w-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:bg-primary-600 hover:text-white transition-all transform hover:-translate-y-1">
                                    <Icon />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LINKS */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-primary-400">Quick Navigation</h4>
                        <ul className="space-y-3">
                            {[
                                { name: 'Expert Courses', path: '/courses' },
                                { name: 'About Mission', path: '/about' },
                                { name: 'Careers Portal', path: '/jobs' },
                                { name: 'Latest Insights', path: '/blog' },
                                { name: 'Contact Us', path: '/contact' }
                            ].map(link => (
                                <li key={link.path}>
                                    <Link to={link.path} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <FaChevronRight size={10} className="text-primary-600 group-hover:translate-x-1 transition-transform" /> {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CATEGORIES */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-indigo-400">Our Tracks</h4>
                        <ul className="space-y-3">
                            {['Web Development', 'Mobile App Dev', 'Data Science', 'Cybersecurity', 'Cloud & DevOps'].map(cat => (
                                <li key={cat}>
                                    <Link to={`/courses?category=${cat}`} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 group">
                                        <span className="h-1 w-1 bg-primary-600 rounded-full group-hover:w-3 transition-all"></span> {cat}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* CONTACT */}
                    <div>
                        <h4 className="text-sm font-black uppercase tracking-widest mb-4 text-emerald-400">Get In Touch</h4>
                        <ul className="space-y-4">
                            <li className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-primary-400">
                                    <FaMapMarkerAlt />
                                </div>
                                <div className="text-sm font-medium text-slate-400 leading-snug">
                                    {settings?.address || 'Mid-Baneshwor, Kathmandu, Nepal'}
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-indigo-400">
                                    <FaPhone />
                                </div>
                                <div className="text-sm font-medium text-slate-400 leading-snug">
                                    {settings?.phone || '+977-1-4400000'}
                                </div>
                            </li>
                            <li className="flex gap-4">
                                <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center flex-shrink-0 text-emerald-400">
                                    <FaEnvelope />
                                </div>
                                <div className="text-sm font-medium text-slate-400 leading-snug truncate">
                                    {settings?.email || 'hello@sikshyasadan.com'}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* BOTTOM BAR */}
                <div className="pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-xs sm:text-sm text-slate-500 font-medium text-center md:text-left">
                        &copy; {currentYear} <span className="text-white font-bold">Sikshya Sadan IT Training</span>. All Rights Reserved.
                    </p>
                    <div className="flex gap-4 sm:gap-8 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
                        <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
                        <Link to="/refund" className="hover:text-white transition-colors">Refund Policy</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
