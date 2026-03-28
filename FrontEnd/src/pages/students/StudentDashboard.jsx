import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaBookOpen, FaCheckCircle, FaTasks, FaCertificate, FaArrowRight, FaClock } from 'react-icons/fa';

const StudentDashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getDashboard();
            if (response.data.success) {
                setDashboardData(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching dashboard:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-900 border-t-transparent"></div>
        </div>
    );

    const data = dashboardData || {
        enrollments: [],
        totalCourses: 0,
        activeCourses: 0,
        completedCourses: 0,
        pendingAssignments: 0
    };

    return (
        <div className="min-h-screen bg-slate-50 relative">
            {/* Background design element */}
            <div className="absolute top-0 left-0 w-full h-[350px] bg-slate-900 z-0"></div>

            {/* Main Content Wrapper */}
            <div className="relative z-10 pt-32 pb-24 max-w-7xl mx-auto px-6 lg:px-12">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                    <div className="text-white space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">
                            Welcome back, {user?.name?.split(' ')[0]}
                        </h1>
                        <p className="text-slate-400 text-lg">
                            Track your progress, assignments, and accomplishments.
                        </p>
                    </div>
                    <Link
                        to="/courses"
                        className="inline-flex items-center gap-2 px-6 py-3.5 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-lg"
                    >
                        Browse Courses <FaArrowRight size={12} />
                    </Link>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400">
                                <FaBookOpen size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Enrolled</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{data.totalCourses}</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Total registered courses</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                                <FaClock size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Active</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{data.activeCourses}</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Courses in progress</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                                <FaCheckCircle size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Finished</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{data.completedCourses}</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Completed programs</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="h-12 w-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-500">
                                <FaTasks size={20} />
                            </div>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Pending</p>
                        </div>
                        <p className="text-4xl font-black text-slate-900">{data.pendingAssignments}</p>
                        <p className="text-sm text-slate-500 mt-2 font-medium">Assignments to submit</p>
                    </div>
                </div>

                {/* Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    
                    {/* Main Feed: Courses */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="flex items-center justify-between">
                            <h2 className="text-2xl font-bold text-slate-900">Current Learning Path</h2>
                            <Link to="/student/my-courses" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-2">
                                View all <FaArrowRight size={10} />
                            </Link>
                        </div>

                        <div className="space-y-6">
                            {data.enrollments && data.enrollments.length > 0 ? (
                                data.enrollments.slice(0, 3).map(enrollment => (
                                    <div key={enrollment._id} className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 flex flex-col md:flex-row items-start md:items-center gap-8 hover:border-slate-300 transition-colors">
                                        <div className="h-32 w-48 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0">
                                            <img
                                                src={enrollment.course?.thumbnail
                                                    ? `${UPLOAD_URL}/${enrollment.course.thumbnail}`
                                                    : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80'}
                                                alt={enrollment.course?.title}
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-grow w-full">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-bold text-slate-900 mb-1">{enrollment.course?.title}</h3>
                                                    <p className="text-sm font-medium text-slate-500">Instructor: {enrollment.course?.instructor?.name}</p>
                                                </div>
                                            </div>
                                            
                                            <div className="space-y-3 mt-4">
                                                <div className="flex justify-between text-sm font-bold">
                                                    <span className="text-slate-700">Progress</span>
                                                    <span className="text-indigo-600">{enrollment.progress || 0}%</span>
                                                </div>
                                                <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-indigo-600 rounded-full transition-all duration-1000"
                                                        style={{ width: `${enrollment.progress || 0}%` }}
                                                    ></div>
                                                </div>
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-4">
                                                <Link
                                                    to={`/student/course/${enrollment.course?._id}`}
                                                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-colors"
                                                >
                                                    Resume Course
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="bg-white rounded-[2rem] p-16 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center">
                                    <div className="h-20 w-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
                                        <FaBookOpen size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-2">No active courses</h3>
                                    <p className="text-slate-500 font-medium mb-8 max-w-sm mx-auto">
                                        You are not enrolled in any programs yet. Browse our catalog to begin your journey.
                                    </p>
                                    <Link to="/courses" className="inline-flex px-8 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-indigo-600 transition-colors">
                                        Explore Programs
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar: Navigation Menu */}
                    <div className="space-y-8">
                        <h2 className="text-2xl font-bold text-slate-900">Platform Access</h2>
                        
                        <div className="bg-white rounded-[2rem] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-2">
                            <Link to="/student/my-courses" className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-md transition-all">
                                    <FaBookOpen size={18} />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-base font-bold text-slate-900">My Curriculum</h4>
                                    <p className="text-sm text-slate-500 font-medium">Access your enrolled courses</p>
                                </div>
                                <FaArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                            </Link>

                            <Link to="/student/assignments" className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-md transition-all">
                                    <FaTasks size={18} />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-base font-bold text-slate-900">Assignments</h4>
                                    <p className="text-sm text-slate-500 font-medium">Submit and review tasks</p>
                                </div>
                                <FaArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                            </Link>

                            <Link to="/student/certificates" className="flex items-center gap-5 p-4 rounded-2xl hover:bg-slate-50 transition-colors group">
                                <div className="h-12 w-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-white group-hover:shadow-md transition-all">
                                    <FaCertificate size={18} />
                                </div>
                                <div className="flex-grow">
                                    <h4 className="text-base font-bold text-slate-900">Certificates</h4>
                                    <p className="text-sm text-slate-500 font-medium">Download claimed awards</p>
                                </div>
                                <FaArrowRight size={14} className="text-slate-300 group-hover:text-slate-900 transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default StudentDashboard;
