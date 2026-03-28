import React, { useState, useEffect } from 'react';
import { instructorAPI } from '../../services/api';
import { FaPlus, FaTasks, FaCalendarAlt, FaEdit, FaTrash, FaCheckCircle } from 'react-icons/fa';


const InstructorAssignments = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [attachments, setAttachments] = useState([]);

    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        dueDate: '',
        maxMarks: 100
    });

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchAssignments();
        } else {
            setAssignments([]);
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
            setAssignments(response.data.assignments || []);
        } catch (err) {
            console.error('Failed to load assignments:', err);
        }
    };

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourse) return alert('Please select a course first');

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('dueDate', formData.dueDate);
            data.append('maxMarks', formData.maxMarks);

            if (attachments.length > 0) {
                attachments.forEach(file => {
                    data.append('attachments', file);
                });
            }

            const response = await instructorAPI.createAssignment(selectedCourse, data);
            if (response.data.success) {
                alert('Assignment created successfully!');
                setShowForm(false);
                setFormData({ title: '', description: '', dueDate: '', maxMarks: 100 });
                setAttachments([]);
                fetchAssignments();
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to create assignment');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) return (
        <div className="instructor-portal">
            <div className="loading-container">
                <div className="spinner"></div>
                <p>Loading assignments...</p>
            </div>
        </div>
    );

    return (
        <div className="instructor-portal">
            <div className="portal-header">
                <div className="flex justify-between items-center">
                    <div>
                        <h1>Manage Assignments</h1>
                        <p>Create and track tasks for your students</p>
                    </div>
                    {selectedCourse && (
                        <button
                            className={`btn ${showForm ? 'btn-secondary' : 'btn-primary'} flex items-center gap-2`}
                            onClick={() => setShowForm(!showForm)}
                        >
                            {showForm ? 'Cancel' : <><FaPlus /> Create Assignment</>}
                        </button>
                    )}
                </div>
            </div>

            <div className="stats-grid" style={{ gridTemplateColumns: '1fr', marginBottom: '2rem', position: 'relative', zIndex: 60 }}>
                <div className="card shadow-xl border-2 border-slate-100">
                    <label className="block text-sm font-black uppercase tracking-widest text-slate-400 mb-4 ml-2">Course Selection</label>
                    <select
                        className="form-input w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-700"
                        style={{ cursor: 'pointer', appearance: 'auto' }}
                        value={selectedCourse}
                        onChange={(e) => {
                            console.log("Picking Course:", e.target.value);
                            setSelectedCourse(e.target.value);
                        }}
                    >
                        <option value="">-- Click to Select a Course --</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.title}</option>
                        ))}
                    </select>
                </div>
            </div>

            {showForm && (
                <div className="card animate-fadeIn" style={{ marginBottom: '2rem', borderLeft: '4px solid var(--primary)' }}>
                    <h2 className="mb-6 flex items-center gap-2"><FaTasks className="text-primary" /> New Assignment</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="form-group">
                                <label className="block text-sm font-semibold mb-1">Assignment Title</label>
                                <input
                                    type="text"
                                    name="title"
                                    className="form-input w-full p-2 border rounded"
                                    placeholder="e.g. Build a Responsive Website"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Max Marks (Points)</label>
                                <input
                                    type="number"
                                    name="maxMarks"
                                    className="form-input"
                                    placeholder="100"
                                    value={formData.maxMarks}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Due Date & Time</label>
                            <input
                                type="datetime-local"
                                name="dueDate"
                                className="form-input"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Description / Instructions</label>
                            <textarea
                                name="description"
                                className="form-input"
                                rows="4"
                                placeholder="Explain the tasks, requirements, and submission guidelines..."
                                value={formData.description}
                                onChange={handleInputChange}
                                required
                            ></textarea>
                        </div>
                        <div className="form-group">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Task Assets / Attachments (Optional)</label>
                            <input
                                type="file"
                                className="form-input"
                                multiple
                                onChange={(e) => setAttachments(Array.from(e.target.files))}
                            />
                            {attachments.length > 0 && (
                                <div className="mt-2 text-xs font-bold text-slate-500">
                                    Selected: {attachments.map(f => f.name).join(', ')}
                                </div>
                            )}
                        </div>
                        <div className="flex gap-2 justify-end">
                            <button type="button" className="btn btn-secondary px-6" onClick={() => setShowForm(false)}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-10" disabled={submitting}>
                                {submitting ? 'Creating...' : 'Launch Assignment'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {!selectedCourse ? (
                <div className="card text-center py-20 bg-gray-50 border-dashed border-2" style={{ zIndex: 1 }}>
                    <FaTasks size={48} className="mx-auto text-gray-300 mb-4" />
                    <h3>Select a course to view assignments</h3>
                    <p className="text-gray-500">You must choose a course to create or view assignments.</p>
                </div>
            ) : (
                <div className="assignments-section">
                    <h2 className="mb-6">Course Assignments ({assignments.length})</h2>
                    {assignments.length === 0 ? (
                        <div className="card text-center py-10">
                            <p>No assignments created yet for this course.</p>
                            <button className="btn btn-primary mt-4" onClick={() => setShowForm(true)}>Create First Assignment</button>
                        </div>
                    ) : (
                        <div className="grid grid-1 gap-4">
                            {assignments.map(assignment => (
                                <div key={assignment._id} className="card hover:shadow-md transition bg-white border border-gray-100 flex justify-between items-center">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-primary-50 p-3 rounded-xl text-primary">
                                            <FaTasks size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold">{assignment.title}</h3>
                                            <div className="flex gap-4 text-xs text-gray-500 mt-1">
                                                <span className="flex items-center gap-1"><FaCalendarAlt /> Due: {formatDate(assignment.dueDate)}</span>
                                                <span className="flex items-center gap-1"><FaCheckCircle className="text-emerald-500" /> Max Marks: {assignment.maxMarks}</span>
                                            </div>
                                            <p className="text-sm text-gray-600 mt-2 line-clamp-1">{assignment.description}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-400 hover:text-primary transition-colors" title="Edit">
                                            <FaEdit size={18} />
                                        </button>
                                        <button className="p-2 text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                                            <FaTrash size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default InstructorAssignments;
