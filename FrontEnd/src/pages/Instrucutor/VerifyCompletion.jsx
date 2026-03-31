import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaGraduationCap, FaSearch, FaCheckCircle, FaUserGraduate, FaClipboardList, FaSpinner, FaInfoCircle, FaCalendarCheck, FaChartLine } from 'react-icons/fa';


const VerifyCompletion = () => {
    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterCourse, setFilterCourse] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [courses, setCourses] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState(null);
    const [certificateFiles, setCertificateFiles] = useState({});

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [studentsRes, coursesRes] = await Promise.all([
                instructorAPI.getMyStudents(),
                instructorAPI.getMyCourses()
            ]);
            // Backend now returns { enrollments: [...] }
            setEnrollments(studentsRes.data.enrollments || []);
            setCourses(coursesRes.data.courses || []);
        } catch (error) {
            console.error('Error fetching students:', error);
            alert('Failed to load students data');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkComplete = async (enrollmentId) => {
        if (!window.confirm('Mark this student as COMPLETED? They will be able to claim their certificate immediately.')) return;

        try {
            setActionLoading(enrollmentId);
            await instructorAPI.updateEnrollment(enrollmentId, { status: 'completed' });

            // Update local state
            setEnrollments(prev => prev.map(e =>
                e._id === enrollmentId ? { ...e, status: 'completed' } : e
            ));

            alert('✅ Student marked as completed! They can now claim their certificate.');
        } catch (error) {
            console.error('Error updating enrollment:', error);
            alert(error.response?.data?.message || 'Failed to update enrollment');
        } finally {
            setActionLoading(null);
        }
    };

    const handleRevokeComplete = async (enrollmentId) => {
        if (!window.confirm('Revoke completion status? The student will no longer be able to claim a certificate.')) return;
        try {
            setActionLoading(enrollmentId);
            await instructorAPI.updateEnrollment(enrollmentId, { status: 'active' });
            setEnrollments(prev => prev.map(e =>
                e._id === enrollmentId ? { ...e, status: 'active' } : e
            ));
            alert('Completion revoked. Student status set back to Active.');
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to revoke completion');
        } finally {
            setActionLoading(null);
        }
    };

    const handleUploadCertificate = async (enrollmentId) => {
        const file = certificateFiles[enrollmentId];
        if (!file) {
            alert('Please choose a certificate image first.');
            return;
        }

        try {
            setActionLoading(`upload-${enrollmentId}`);
            const formData = new FormData();
            formData.append('certificateImage', file);
            await instructorAPI.uploadCertificate(enrollmentId, formData);

            alert('Certificate uploaded and issued successfully.');
            await fetchData();
            setCertificateFiles((prev) => {
                const next = { ...prev };
                delete next[enrollmentId];
                return next;
            });
        } catch (error) {
            alert(error.response?.data?.message || 'Failed to upload certificate.');
        } finally {
            setActionLoading(null);
        }
    };

    const getAttendancePercent = (enrollment) => {
        const total = enrollment.attendance?.length || 0;
        if (total === 0) return 0;
        const present = enrollment.attendance.filter(a => a.status === 'present').length;
        return Math.round((present / total) * 100);
    };

    const filteredEnrollments = enrollments.filter(e => {
        const matchesCourse = filterCourse === '' || e.course?._id === filterCourse;
        const matchesSearch = e.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.student?.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === '' || e.status === filterStatus;
        return matchesCourse && matchesSearch && matchesStatus;
    });

    const completedCount = enrollments.filter(e => e.status === 'completed').length;
    const pendingCount = enrollments.filter(e => e.status !== 'completed' && e.status !== 'dropped').length;

    if (loading) return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <FaSpinner className="animate-spin text-4xl text-primary-600" />
                <p className="font-black italic text-slate-400">Synchronizing Student Records...</p>
            </div>
        </div>
    );

    return (
        <div className="instructor-portal min-h-screen bg-slate-50 pt-24 pb-20">
            <div className="container mx-auto px-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <span className="text-emerald-600 font-black uppercase text-xs tracking-[0.2em] bg-emerald-50 px-5 py-2 rounded-full mb-4 inline-block italic">Academic Verification</span>
                        <h1 className="text-5xl font-black text-slate-900 italic tracking-tight">Certification Center</h1>
                        <p className="text-slate-500 font-medium mt-2">Verify student completion and authorize professional credentials.</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-emerald-50 border border-emerald-100 px-8 py-5 rounded-3xl text-center">
                            <p className="text-3xl font-black text-emerald-600">{completedCount}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Verified</p>
                        </div>
                        <div className="bg-amber-50 border border-amber-100 px-8 py-5 rounded-3xl text-center">
                            <p className="text-3xl font-black text-amber-600">{pendingCount}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Pending</p>
                        </div>
                    </div>
                </div>

                {/* INFO BANNER */}
                <div className="bg-blue-50 border border-blue-100 rounded-[2rem] p-6 mb-10 flex items-start gap-4">
                    <FaInfoCircle className="text-blue-400 text-xl flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-black text-blue-700 text-sm">How Certification Works</p>
                        <p className="text-blue-600 text-xs mt-1 font-medium leading-relaxed">
                            <strong>Step 1:</strong> Review student's attendance and progress below. &nbsp;|&nbsp;
                            <strong>Step 2:</strong> Click <em>"Verify Completion"</em> to mark them as finished. &nbsp;|&nbsp;
                            <strong>Step 3:</strong> The student will see a "Claim Certificate" button in their portal and can download a certificate PDF.
                            Students must have payment completed to be eligible.
                        </p>
                    </div>
                </div>

                {/* FILTERS */}
                <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 mb-12">
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <div className="flex-grow w-full relative">
                            <FaSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" />
                            <input
                                type="text"
                                placeholder="Search student name or email..."
                                className="w-full bg-slate-50 border-0 rounded-2xl pl-14 pr-6 py-4 focus:ring-4 ring-primary-50 outline-none font-bold text-slate-800 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="w-full md:w-64">
                            <select
                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-50 outline-none font-bold text-slate-800 appearance-none"
                                value={filterCourse}
                                onChange={(e) => setFilterCourse(e.target.value)}
                            >
                                <option value="">All Courses</option>
                                {courses.map(c => (
                                    <option key={c._id} value={c._id}>{c.title}</option>
                                ))}
                            </select>
                        </div>
                        <div className="w-full md:w-48">
                            <select
                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-50 outline-none font-bold text-slate-800 appearance-none"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">All Statuses</option>
                                <option value="active">Active</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* STUDENTS GRID */}
                <div className="grid grid-cols-1 gap-6">
                    {filteredEnrollments.length > 0 ? (
                        filteredEnrollments.map(enrollment => {
                            const isCompleted = enrollment.status === 'completed';
                            const isCertIssued = enrollment.certificateIssued;
                            const isPaid = enrollment.paymentStatus === 'completed' || enrollment.paymentStatus === 'installment';
                            const attendancePct = getAttendancePercent(enrollment);
                            const totalClasses = enrollment.attendance?.length || 0;
                            const isLoading = actionLoading === enrollment._id;
                            const isUploading = actionLoading === `upload-${enrollment._id}`;

                            return (
                                <div key={enrollment._id} className={`bg-white p-8 rounded-[3rem] shadow-lg border-2 transition-all flex flex-col md:flex-row items-center justify-between gap-8 ${isCompleted ? 'border-emerald-100 bg-emerald-50/20' : 'border-slate-50 hover:border-primary-100'}`}>
                                    {/* Student Info */}
                                    <div className="flex items-center gap-6 flex-grow min-w-0">
                                        <div className="h-20 w-20 rounded-3xl bg-slate-100 flex-shrink-0 overflow-hidden border-4 border-white shadow-md">
                                            {enrollment.student?.avatar ? (
                                                <img src={`${UPLOAD_URL}/${enrollment.student.avatar}`} alt="" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-slate-300 text-3xl font-black">
                                                    {enrollment.student?.name?.[0]?.toUpperCase()}
                                                </div>
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-xl font-black text-slate-900 truncate">{enrollment.student?.name}</h3>
                                            <p className="text-xs text-slate-400 font-bold mb-3">{enrollment.student?.email}</p>
                                            <div className="flex flex-wrap gap-2">
                                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[10px] font-black uppercase tracking-widest text-slate-500">
                                                    {enrollment.course?.title}
                                                </span>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${isPaid ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`}>
                                                    Payment: {enrollment.paymentStatus}
                                                </span>
                                                {isCertIssued && (
                                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                        🎓 Certificate Issued
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="flex items-center gap-8 flex-shrink-0">
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 justify-center">
                                                <FaChartLine className="text-primary-400 text-sm" />
                                                <p className="text-2xl font-black text-slate-900">{enrollment.progress || 0}%</p>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progress</p>
                                        </div>
                                        <div className="text-center">
                                            <div className="flex items-center gap-1 justify-center">
                                                <FaCalendarCheck className="text-emerald-400 text-sm" />
                                                <p className="text-2xl font-black text-slate-900">{attendancePct}%</p>
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{totalClasses} Classes</p>
                                        </div>

                                        {/* Action */}
                                        <div className="pl-8 border-l border-slate-100">
                                            {isCompleted ? (
                                                <div className="flex flex-col items-center gap-3">
                                                    <div className="flex items-center gap-3 text-emerald-600 font-black italic">
                                                        <FaCheckCircle size={24} />
                                                        <span>Verified</span>
                                                    </div>
                                                    {!isCertIssued && (
                                                        <button
                                                            onClick={() => handleRevokeComplete(enrollment._id)}
                                                            disabled={isLoading}
                                                            className="px-4 py-2 rounded-xl font-black text-xs uppercase tracking-widest bg-red-50 text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            {isLoading ? <FaSpinner className="animate-spin" /> : 'Revoke'}
                                                        </button>
                                                    )}

                                                    <div className="mt-2 flex flex-col items-center gap-2">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            onChange={(e) => {
                                                                const file = e.target.files?.[0] || null;
                                                                setCertificateFiles((prev) => ({ ...prev, [enrollment._id]: file }));
                                                            }}
                                                            className="text-[10px] font-bold w-56"
                                                        />
                                                        <button
                                                            onClick={() => handleUploadCertificate(enrollment._id)}
                                                            disabled={isUploading || !certificateFiles[enrollment._id]}
                                                            className="px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest bg-indigo-600 text-white hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                        >
                                                            {isUploading ? <FaSpinner className="animate-spin" /> : (isCertIssued ? 'Replace Certificate' : 'Upload Certificate')}
                                                        </button>
                                                        {enrollment.certificateUrl && (
                                                            <a
                                                                href={`${UPLOAD_URL}/${enrollment.certificateUrl}`}
                                                                target="_blank"
                                                                rel="noreferrer"
                                                                className="text-[10px] font-bold text-indigo-600 underline"
                                                            >
                                                                View Uploaded Certificate
                                                            </a>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    onClick={() => handleMarkComplete(enrollment._id)}
                                                    disabled={isLoading || !isPaid}
                                                    title={!isPaid ? 'Student payment must be completed first' : 'Mark student as course completed'}
                                                    className={`px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-3 transition-all active:scale-95 shadow-xl ${!isPaid ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-emerald-600'}`}
                                                >
                                                    {isLoading ? (
                                                        <FaSpinner className="animate-spin" />
                                                    ) : (
                                                        <><FaUserGraduate /> Verify Completion</>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="bg-white p-20 rounded-[3rem] border-4 border-dashed border-slate-100 text-center">
                            <FaClipboardList className="mx-auto text-slate-100 text-8xl mb-6" />
                            <h3 className="text-2xl font-black text-slate-300 italic">No scholars match your criteria.</h3>
                            <p className="text-slate-400 mt-2 font-medium">Try adjusting your filters or make sure students are enrolled in your courses.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyCompletion;
