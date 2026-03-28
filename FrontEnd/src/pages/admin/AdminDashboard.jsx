import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI } from '../../services/api';
import { FaUserGraduate, FaChalkboardTeacher, FaBook, FaClipboardList, FaWallet, FaUsersCog, FaChartLine, FaBriefcase, FaArrowRight } from 'react-icons/fa';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalInstructors: 0,
        totalCourses: 0,
        totalRevenue: 0,
        totalEnrollments: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await adminAPI.getStats();
            setStats(response.data.data);
        } catch (error) {
            console.error('Error fetching admin stats:', error);
            setError('Failed to load dashboard stats. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Background design element */}
            <div className="absolute top-0 left-0 w-full h-[350px] bg-slate-900 z-0"></div>

            {/* Main Content Wrapper */}
            <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-12">
                
                {/* Header Section */}
                <div className="mb-12">
                    <h1 className="text-4xl font-bold tracking-tight text-white mb-2">
                        Admin Dashboard
                    </h1>
                    <p className="text-slate-400 text-lg">
                        Platform overview and management tools.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-sm mb-8 font-medium shadow-sm">
                        {error}
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
                    
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <FaUserGraduate size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Students</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{stats.totalStudents}</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <FaChalkboardTeacher size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Teachers</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{stats.totalInstructors}</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                                <FaBook size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Courses</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{stats.totalCourses}</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <FaClipboardList size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enrolled</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{stats.totalEnrollments}</p>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-800 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center text-emerald-400">
                                <FaWallet size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Revenue</p>
                        </div>
                        <p className="text-2xl font-black text-white truncate" title={`Rs. ${(stats.totalRevenue || 0).toLocaleString()}`}>
                            Rs. {(stats.totalRevenue || 0).toLocaleString()}
                        </p>
                    </div>
                </div>

                {/* Management Links */}
                <div className="pt-4">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">Management Tools</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        
                        <Link to="/admin/users" className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                    <FaUsersCog size={24} />
                                </div>
                                <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-slate-300 group-hover:text-slate-900 transition-colors">
                                    <FaArrowRight size={14} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Users</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-auto">Manage students, instructors, and system admins.</p>
                        </Link>

                        <Link to="/admin/finance" className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                    <FaChartLine size={24} />
                                </div>
                                <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-emerald-300 group-hover:text-emerald-600 transition-colors">
                                    <FaArrowRight size={14} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Finance</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-auto">View payment history and revenue reports.</p>
                        </Link>

                        <Link to="/instructor/courses" className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-indigo-300 hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    <FaBook size={24} />
                                </div>
                                <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-indigo-300 group-hover:text-indigo-600 transition-colors">
                                    <FaArrowRight size={14} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Courses</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-auto">Review, create, and manage course content.</p>
                        </Link>

                        <Link to="/admin/jobs" className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-purple-300 hover:shadow-lg transition-all group flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                    <FaBriefcase size={24} />
                                </div>
                                <div className="h-10 w-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-300 group-hover:border-purple-300 group-hover:text-purple-600 transition-colors">
                                    <FaArrowRight size={14} />
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-2">Job Listings</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed mt-auto">Post and manage placement opportunities.</p>
                        </Link>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default AdminDashboard;
