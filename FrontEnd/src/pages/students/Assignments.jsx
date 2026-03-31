import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { studentAPI, UPLOAD_URL } from '../../services/api';
import { FaBookOpen, FaCalendarAlt, FaStar, FaPaperPlane, FaFileUpload, FaHistory, FaCheckCircle, FaExclamationCircle, FaPaperclip, FaTimes } from 'react-icons/fa';


const Assignments = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [submissionFile, setSubmissionFile] = useState(null);
    const [submissionText, setSubmissionText] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchAssignments();
    }, []);

    const fetchAssignments = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getMyAssignments();
            setAssignments(response.data.data || []);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load assignments');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => {
        setSubmissionFile(e.target.files[0]);
    };

    const handleSubmit = async (assignmentId) => {
        if (!submissionText.trim() && !submissionFile) {
            alert('Please provide either text submission or upload a file');
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append('submissionText', submissionText);
            if (submissionFile) {
                formData.append('file', submissionFile);
            }

            await studentAPI.submitAssignment(assignmentId, formData);

            alert('Assignment submitted successfully!');
            setSelectedAssignment(null);
            setSubmissionText('');
            setSubmissionFile(null);
            fetchAssignments();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to submit assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusBadge = (assignment) => {
        if (assignment.submission?.grade !== null && assignment.submission?.grade !== undefined) {
            return <span className="px-4 py-1.5 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                <FaStar /> Graded: {assignment.submission.grade}%
            </span>;
        }
        if (assignment.submission) {
            return <span className="px-4 py-1.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 italic">Submitted</span>;
        }
        const dueDate = new Date(assignment.dueDate);
        const now = new Date();
        if (dueDate < now) {
            return <span className="px-4 py-1.5 rounded-full bg-red-50 text-red-600 text-[10px] font-black uppercase tracking-widest border border-red-100">Overdue</span>;
        }
        return <span className="px-4 py-1.5 rounded-full bg-primary-50 text-primary-600 text-[10px] font-black uppercase tracking-widest border border-primary-100">Pending</span>;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="student-portal min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="student-portal min-h-screen bg-slate-50 pt-32 pb-24">
            <div className="container mx-auto px-6">
                <div className="portal-header mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="text-primary-600 font-black uppercase text-xs tracking-[0.2em] bg-primary-50 px-5 py-2 rounded-full mb-4 inline-block italic">Academic Center</span>
                        <h1 className="text-5xl font-black text-slate-900 italic">My Assignments</h1>
                        <p className="text-slate-500 font-medium mt-2">Manage your coursework, track deadlines, and submit your projects.</p>
                    </div>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 p-5 rounded-3xl border border-red-100 font-bold mb-8 animate-fadeIn">
                        ⚠️ {error}
                    </div>
                )}

                <div className="assignments-container">
                    {assignments.length === 0 ? (
                        <div className="bg-white p-20 rounded-[4rem] shadow-2xl border border-slate-100 text-center">
                            <div className="text-6xl mb-6">📚</div>
                            <h2 className="text-3xl font-black text-slate-900 mb-2 italic">Clean Slate!</h2>
                            <p className="text-slate-500 font-medium">No active assignments found. Check back later or explore new courses.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            {assignments.map((assignment) => (
                                <div key={assignment._id} className="bg-white p-10 rounded-[3.5rem] shadow-xl border border-slate-100 hover:shadow-2xl transition-all group">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="h-14 w-14 bg-slate-50 rounded-2xl flex items-center justify-center text-primary-600 border border-slate-100 group-hover:bg-primary-50 transition-colors">
                                            <FaBookOpen size={24} />
                                        </div>
                                        {getStatusBadge(assignment)}
                                    </div>

                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-primary-600 transition-colors italic">{assignment.title}</h3>

                                    <div className="flex flex-wrap gap-6 mb-8 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <FaCalendarAlt className="text-primary-400" /> {formatDate(assignment.dueDate)}
                                        </span>
                                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                                            <FaStar className="text-amber-400" /> {assignment.maxMarks || 100} Points Max
                                        </span>
                                    </div>

                                    <p className="text-slate-500 font-medium mb-6 leading-relaxed line-clamp-2 italic">
                                        "{assignment.description}"
                                    </p>

                                    {assignment.attachments && assignment.attachments.length > 0 && (
                                        <div className="mb-8 space-y-2">
                                            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Study Materials</p>
                                            <div className="flex flex-wrap gap-2">
                                                {assignment.attachments.map((file, idx) => (
                                                    <a
                                                        key={idx}
                                                        href={file.url ? `${UPLOAD_URL}${file.url}` : '#'}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black uppercase text-primary-600 hover:bg-primary-600 hover:text-white transition-all flex items-center gap-2"
                                                    >
                                                        <FaPaperclip /> {file.filename}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {assignment.submission ? (
                                        <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 relative overflow-hidden">
                                            <div className="absolute top-0 right-0 p-4 opacity-5">
                                                <FaPaperPlane size={64} />
                                            </div>
                                            <h4 className="text-xs font-black uppercase text-slate-400 mb-4 tracking-tighter">Your Submission</h4>
                                            <p className="text-sm font-bold text-slate-700 mb-4">
                                                Submitted on {formatDate(assignment.submission.submittedAt)}
                                            </p>

                                            {assignment.submission.submissionText && (
                                                <div className="bg-white p-4 rounded-xl text-sm italic text-slate-500 border border-slate-100 mb-4">
                                                    "{assignment.submission.submissionText}"
                                                </div>
                                            )}

                                            {assignment.submission.grade !== null && assignment.submission.grade !== undefined && (
                                                <div className="pt-4 border-t border-slate-200 mt-4">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-xs font-black uppercase text-emerald-600">Final Grade</span>
                                                        <span className="text-xl font-black text-slate-900">{assignment.submission.grade}%</span>
                                                    </div>
                                                    {assignment.submission.feedback && (
                                                        <p className="text-xs font-medium text-slate-400 italic">"Feedback: {assignment.submission.feedback}"</p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <>
                                            {selectedAssignment === assignment._id ? (
                                                <div className="bg-primary-50 p-8 rounded-3xl border border-primary-100 mt-4 animate-fadeIn">
                                                    <div className="flex justify-between items-center mb-6">
                                                        <h4 className="font-black text-primary-900 italic">Push Your Submission</h4>
                                                        <button onClick={() => setSelectedAssignment(null)} className="text-primary-400 hover:text-red-500 transition-colors">
                                                            <FaTimes />
                                                        </button>
                                                    </div>
                                                    <div className="space-y-4">
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase text-primary-400 mb-2 block tracking-widest">Submission Text / Notes</label>
                                                            <textarea
                                                                className="w-full bg-white border-0 rounded-2xl p-5 text-sm font-medium focus:ring-4 ring-primary-100 transition-all outline-none italic"
                                                                rows="4"
                                                                value={submissionText}
                                                                onChange={(e) => setSubmissionText(e.target.value)}
                                                                placeholder="Paste GitHub link or explain your solution..."
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[10px] font-black uppercase text-primary-400 mb-2 block tracking-widest">Upload Documentation (PDF/ZIP)</label>
                                                            <div className="relative group/upload">
                                                                <input
                                                                    type="file"
                                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                                    onChange={handleFileChange}
                                                                />
                                                                <div className="bg-white border-2 border-dashed border-primary-200 rounded-2xl p-6 text-center group-hover/upload:bg-primary-600 group-hover/upload:text-white transition-all">
                                                                    <FaFileUpload className="mx-auto mb-2 opacity-50" size={24} />
                                                                    <span className="text-xs font-black uppercase">{submissionFile ? submissionFile.name : 'Drop File or Click'}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button
                                                            className="w-full py-4 bg-primary-600 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary-900 transition-all shadow-xl shadow-primary-100 active:scale-95"
                                                            onClick={() => handleSubmit(assignment._id)}
                                                            disabled={submitting}
                                                        >
                                                            {submitting ? 'Encrypting & Sending...' : <><FaPaperPlane /> Deploy Submission</>}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <button
                                                    className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl active:scale-95"
                                                    onClick={() => setSelectedAssignment(assignment._id)}
                                                >
                                                    Submit Project <FaPaperPlane />
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Assignments;
