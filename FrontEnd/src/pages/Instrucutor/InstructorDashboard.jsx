import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { instructorAPI } from '../../services/api';
import { FaChalkboardTeacher, FaUsers, FaClipboardList, FaPlus, FaFileUpload, FaCheckSquare, FaBook, FaArrowRight } from 'react-icons/fa';

const InstructorDashboard = () => {
    const [stats, setStats] = useState({
        totalCourses: 0,
        totalStudents: 0,
        pendingSubmissions: 0
    });
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchDashboard();
    }, []);

    const fetchDashboard = async () => {
        try {
            const response = await instructorAPI.getDashboard();
            const data = response.data.data;
            setStats({
                totalCourses: data.totalCourses || 0,
                totalStudents: data.totalStudents || 0,
                pendingSubmissions: data.pendingGrading || 0
            });
            setCourses(data.courses || []);
        } catch (error) {
            console.error('Error fetching instructor dashboard:', error);
            setError('Failed to load dashboard data.');
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
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="text-white space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">Instructor Dashboard</h1>
                        <p className="text-slate-400 text-lg">Manage your courses, students, and grading.</p>
                    </div>
                    <Link
                        to="/instructor/courses"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
                    >
                        <FaPlus size={12} /> Add Course
                    </Link>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-200 text-sm mb-8 font-medium shadow-sm">
                        {error}
                    </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                                <FaBook size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Courses</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{stats.totalCourses}</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Active courses</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <FaUsers size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Students</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{stats.totalStudents}</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Enrolled students</p>
                    </div>

                    <div className="bg-slate-900 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.1)] border border-slate-800 text-white">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-amber-500/20 rounded-2xl flex items-center justify-center text-amber-400">
                                <FaClipboardList size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pending</p>
                        </div>
                        <p className="text-4xl font-black text-white">{stats.pendingSubmissions}</p>
                        <p className="text-sm text-slate-400 mt-2 font-medium">Assignments to grade</p>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Feed: Instructor Actions */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-6">Quick Actions</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <Link to="/instructor/assignments" className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-slate-900 group-hover:text-white transition-colors">
                                            <FaPlus size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Create Assignment</h3>
                                    <p className="text-sm text-slate-500 font-medium">Add new tasks for your students.</p>
                                </Link>

                                <Link to="/instructor/grade-assignments" className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-emerald-300 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                                            <FaCheckSquare size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Grade Assignments</h3>
                                    <p className="text-sm text-slate-500 font-medium">Review and mark student submissions.</p>
                                </Link>

                                <Link to="/instructor/attendance" className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-blue-300 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                            <FaUsers size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Attendance</h3>
                                    <p className="text-sm text-slate-500 font-medium">Mark daily student attendance.</p>
                                </Link>

                                <Link to="/instructor/resources" className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-purple-300 hover:shadow-lg transition-all group">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="h-14 w-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                                            <FaFileUpload size={20} />
                                        </div>
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Upload Resources</h3>
                                    <p className="text-sm text-slate-500 font-medium">Share files and study materials.</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: Course List */}
                    <div className="space-y-8">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-slate-900">Your Courses</h2>
                            <Link to="/instructor/courses" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                                Manage all →
                            </Link>
                        </div>
                        
                        {courses.length > 0 ? (
                            <div className="space-y-4">
                                {courses.slice(0, 4).map(course => (
                                    <Link key={course._id} to="/instructor/courses" className="block bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 hover:border-slate-300 hover:shadow-md transition-all group">
                                        <h4 className="text-base font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">{course.title}</h4>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1.5">
                                                <FaUsers size={12} className="text-slate-400" />
                                                <span className="text-sm font-bold text-slate-700">{course.enrolledStudents || 0}</span>
                                                <span className="text-xs text-slate-500 font-medium">students</span>
                                            </div>
                                            <span className="text-xs font-bold uppercase tracking-widest text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg">{course.category}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mx-auto mb-4">
                                    <FaBook size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 mb-1">No courses yet</h3>
                                <p className="text-sm text-slate-500 font-medium mb-6">
                                    You haven't created any courses.
                                </p>
                                <Link to="/instructor/courses" className="inline-flex px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors">
                                    Create Course
                                </Link>
                            </div>
                        )}
                    </div>

                </div>

            </div>
        </div>
    );
};

export default InstructorDashboard;
