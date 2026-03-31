import React, { useState, useEffect } from 'react';
import { instructorAPI, UPLOAD_URL } from '../../services/api';
import { FaGraduationCap, FaCheckCircle, FaUser, FaClock, FaStar, FaChevronRight, FaFileAlt } from 'react-icons/fa';


const GradeAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [submissions, setSubmissions] = useState([]);
    const [selectedSubmission, setSelectedSubmission] = useState(null);
    const [grade, setGrade] = useState('');
    const [feedback, setFeedback] = useState('');
    const [loading, setLoading] = useState(true);
    const [grading, setGrading] = useState(false);

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAssignments();
        }
    }, [selectedCourse]);

    const fetchCourses = async () => {
        try {
            setLoading(true);
            const response = await instructorAPI.getMyCourses();
            setCourses(response.data.courses || []);
        } catch (err) {
            console.error('Failed to load courses:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAssignments = async () => {
        try {
            const response = await instructorAPI.getCourseAssignments(selectedCourse);
            setAssignments(response.data.data || response.data.assignments || []);
        } catch (err) {
            console.error('Failed to load assignments:', err);
        }
    };

    const fetchSubmissions = async (assignmentId) => {
        try {
            const response = await instructorAPI.getAssignmentSubmissions(assignmentId);
            setSubmissions(response.data.data || response.data.submissions || []);
        } catch (err) {
            console.error('Failed to load submissions:', err);
        }
    };

    const handleGradeSubmission = async () => {
        if (grade === '' || Number(grade) < 0 || Number(grade) > 100) {
            alert('Please enter a valid grade (0-100)');
            return;
        }

        try {
            setGrading(true);
            await instructorAPI.gradeSubmission(selectedSubmission._id, {
                grade: parseFloat(grade),
                feedback: feedback.trim()
            });

            alert('Assignment graded successfully!');
            setSelectedSubmission(null);
            setGrade('');
            setFeedback('');
            fetchSubmissions(selectedSubmission.assignment);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to grade assignment');
        } finally {
            setGrading(false);
        }
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
            <div className="instructor-portal min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
            </div>
        );
    }

    return (
        <div className="instructor-portal min-h-screen bg-slate-50 pt-24 pb-16">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="portal-header mb-12">
                    <span className="text-primary-600 font-black uppercase text-xs tracking-widest bg-primary-50 px-5 py-2 rounded-full mb-4 inline-block italic">Evaluation Center</span>
                    <h1 className="text-3xl sm:text-5xl font-black text-slate-900 italic">Grade Submissions</h1>
                    <p className="text-slate-500 font-medium text-sm sm:text-base">Evaluate student performance and provide constructive feedback.</p>
                </div>

                <div className="grading-container">
                    {/* Course Selection */}
                    <div className="card shadow-xl border-2 border-primary-50 bg-white mb-10 rounded-3xl p-5 sm:p-8">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Choose Track to Evaluate</label>
                        <select
                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 transition-all appearance-none italic"
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                        >
                            <option value="">-- Select an Active Course --</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedCourse && (
                        <div className="assignments-list animate-fadeIn">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <FaGraduationCap className="text-primary-600" /> Active Assignments
                            </h3>
                            {assignments.length === 0 ? (
                                <div className="bg-white p-12 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
                                    <p className="text-slate-400 font-bold italic">No assignments launched yet for this course.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                                    {assignments.map((assignment) => (
                                        <div key={assignment._id} className="bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-100 hover:border-primary-100 transition-all">
                                            <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-2 italic tracking-tight">{assignment.title}</h4>
                                            <p className="text-sm font-bold text-slate-400 mb-4">{assignment.description}</p>
                                            <div className="flex flex-wrap items-center gap-4 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-6 bg-slate-50 px-5 py-3 rounded-2xl">
                                                <span className="flex items-center gap-2"><FaClock className="text-primary-500" /> {formatDate(assignment.dueDate)}</span>
                                                <span className="flex items-center gap-2"><FaStar className="text-amber-500" /> {assignment.maxMarks || 100} Pts</span>
                                            </div>
                                            <button
                                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-primary-600 transition-all active:scale-95 shadow-lg"
                                                onClick={() => fetchSubmissions(assignment._id)}
                                            >
                                                Inspect Submissions ({assignment.stats?.totalSubmissions || 0}) <FaChevronRight />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {submissions.length > 0 && (
                        <div className="submissions-section animate-fadeIn">
                            <h3 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <FaCheckCircle className="text-emerald-500" /> Student Deliverables
                            </h3>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                {submissions.map((submission) => (
                                    <div key={submission._id} className="bg-white p-6 sm:p-10 rounded-3xl shadow-2xl border border-slate-100 relative group overflow-hidden">
                                        <div className="absolute top-0 right-0 p-8 opacity-5 -mr-4 -mt-4">
                                            <FaUser size={80} />
                                        </div>
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <h4 className="text-xl font-black text-slate-900 italic tracking-tight">{submission.student?.name || 'Candidate'}</h4>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Submitted {formatDate(submission.submittedAt)}</p>
                                            </div>
                                            {submission.grade !== null && submission.grade !== undefined ? (
                                                <span className="px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-2">
                                                    <FaCheckCircle /> Scored: {submission.grade}%
                                                </span>
                                            ) : (
                                                <span className="px-5 py-2 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-widest border border-amber-100 italic">Pending Evaluation</span>
                                            )}
                                        </div>

                                        {submission.submissionText && (
                                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 mb-6 relative italic text-slate-600 text-sm leading-relaxed">
                                                "{submission.submissionText}"
                                            </div>
                                        )}

                                        {submission.submissionFile?.url && (
                                            <a
                                                href={`${UPLOAD_URL}${submission.submissionFile.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-3 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all mb-6 active:scale-95"
                                            >
                                                <FaFileAlt /> Open Submission (New Tab)
                                            </a>
                                        )}

                                        {submission.grade !== null && submission.grade !== undefined && submission.feedback && (
                                            <div className="pt-6 border-t border-slate-100 mt-4 mb-6">
                                                <h5 className="text-[10px] font-black uppercase tracking-widest text-primary-600 mb-2">Previous Feedback</h5>
                                                <p className="text-sm font-medium text-slate-500 italic">"{submission.feedback}"</p>
                                            </div>
                                        )}

                                        {selectedSubmission?._id === submission._id ? (
                                            <div className="bg-primary-50 p-5 sm:p-8 rounded-3xl border border-primary-100 space-y-6 animate-fadeIn">
                                                <div className="grid grid-cols-1 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 ml-4">Evaluation Score (0-100)</label>
                                                        <input
                                                            type="number"
                                                            className="w-full bg-white border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 transition-all outline-none font-bold text-slate-800"
                                                            min="0"
                                                            max="100"
                                                            value={grade}
                                                            onChange={(e) => setGrade(e.target.value)}
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-primary-400 ml-4">Constructive Feedback</label>
                                                        <textarea
                                                            className="w-full bg-white border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 transition-all outline-none font-bold text-slate-800 resize-none italic"
                                                            rows="4"
                                                            value={feedback}
                                                            onChange={(e) => setFeedback(e.target.value)}
                                                            placeholder="Highlight strengths and suggest improvements..."
                                                        />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                    <button
                                                        className="flex-grow py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary-600 transition-all shadow-xl"
                                                        onClick={handleGradeSubmission}
                                                        disabled={grading}
                                                    >
                                                        {grading ? 'Publishing...' : 'Publish Evaluation'}
                                                    </button>
                                                    <button
                                                        className="px-6 py-4 bg-white text-slate-400 rounded-2xl font-black text-xs uppercase hover:text-red-500 transition-all"
                                                        onClick={() => {
                                                            setSelectedSubmission(null);
                                                            setGrade('');
                                                            setFeedback('');
                                                        }}
                                                    >
                                                        Discard
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <button
                                                className="w-full py-5 bg-primary-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-primary-200 hover:bg-primary-900 transition-all active:scale-95"
                                                onClick={() => {
                                                    setSelectedSubmission(submission);
                                                    setGrade(submission.grade !== null && submission.grade !== undefined ? submission.grade.toString() : '');
                                                    setFeedback(submission.feedback || '');
                                                }}
                                            >
                                                {submission.grade !== null && submission.grade !== undefined ? 'Update Scorecard' : 'Start Evaluation'}
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GradeAssignments;
