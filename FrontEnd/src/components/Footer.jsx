import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaLinkedin, FaInstagram, FaTwitter, FaPhone, FaEnvelope, FaMapMarkerAlt, FaGraduationCap } from 'react-icons/fa';

const Footer = () => {
    const year = new Date().getFullYear();
    return (
        <footer className="bg-slate-900 text-slate-400 py-10 px-6 mt-10">
            <div className="max-w-6xl mx-auto flex flex-col gap-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    <div className="flex flex-col gap-3">
                        <Link to="/" className="flex items-center gap-2 text-white font-black text-lg">
                            <FaGraduationCap className="text-indigo-500 text-2xl" /> SIKSHYA SADAN
                        </Link>
                        <p className="text-sm leading-relaxed">Leading IT training institute in Nepal, dedicated to industry-standard technical education.</p>
                        <div className="flex gap-3 mt-2">
                            {[FaFacebook, FaLinkedin, FaInstagram, FaTwitter].map((Icon, i) => (
                                <button key={i} className="bg-white/10 hover:bg-white/20 p-2 rounded-lg text-slate-300 transition-colors"><Icon size={16} /></button>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <h4 className="text-indigo-300 text-xs font-black uppercase tracking-widest mb-2">Quick Links</h4>
                        {[['Courses', '/courses'], ['About', '/about'], ['Jobs', '/jobs'], ['Blog', '/blog'], ['Contact', '/contact']].map(([name, path]) => (
                            <Link key={path} to={path} className="text-sm hover:text-white transition-colors">{name}</Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-2">
                        <h4 className="text-emerald-300 text-xs font-black uppercase tracking-widest mb-2">Our Tracks</h4>
                        {['Web Development', 'Mobile App Dev', 'Data Science', 'Cybersecurity', 'Cloud & DevOps'].map(cat => (
                            <Link key={cat} to={`/courses?category=${cat}`} className="text-sm hover:text-white transition-colors">{cat}</Link>
                        ))}
                    </div>

                    <div className="flex flex-col gap-3">
                        <h4 className="text-teal-300 text-xs font-black uppercase tracking-widest mb-1">Contact</h4>
                        <p className="text-sm flex items-start gap-2"><FaMapMarkerAlt className="mt-1 flex-shrink-0" /> Mid-Baneshwor, Kathmandu</p>
                        <p className="text-sm flex items-center gap-2"><FaPhone /> +977-1-4400000</p>
                        <p className="text-sm flex items-center gap-2"><FaEnvelope /> hello@sikshyasadan.com</p>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
                    <p>&copy; {year} <span className="text-white font-bold">Sikshya Sadan IT Training</span>. All Rights Reserved.</p>
                    <div className="flex gap-4">
                        {[['Privacy', '/privacy'], ['Terms', '/terms'], ['Refund', '/refund']].map(([name, path]) => (
                            <Link key={path} to={path} className="hover:text-white transition-colors">{name}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
