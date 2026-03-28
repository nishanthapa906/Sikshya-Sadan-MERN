import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { instructorAPI, UPLOAD_URL } from '../../services/api';


const UploadResources = () => {
    const { user } = useAuth();
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'document',
        file: null
    });

    useEffect(() => {
        fetchCourses();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchResources();
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

    const fetchResources = async () => {
        try {
            const response = await instructorAPI.getCourseResources(selectedCourse);
            setResources(response.data.data || []);
        } catch (err) {
            console.error('Failed to load resources:', err);
        }
    };

    const handleFileChange = (e) => {
        setFormData({ ...formData, file: e.target.files[0] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedCourse) {
            alert('Please select a course');
            return;
        }

        if (!formData.file) {
            alert('Please select a file to upload');
            return;
        }

        try {
            setUploading(true);
            const data = new FormData();
            data.append('title', formData.title);
            data.append('description', formData.description);
            data.append('type', formData.type);
            data.append('file', formData.file);

            const response = await instructorAPI.uploadResource(selectedCourse, data);

            alert('Resource uploaded successfully!');
            setFormData({
                title: '',
                description: '',
                type: 'document',
                file: null
            });
            document.getElementById('file-input').value = '';
            fetchResources();
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to upload resource');
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (resourceId) => {
        if (!window.confirm('Are you sure you want to delete this resource?')) {
            return;
        }

        try {
            await instructorAPI.deleteResource(resourceId);
            alert('Resource deleted successfully!');
            fetchResources();
        } catch (err) {
            alert('Failed to delete resource');
        }
    };

    const getResourceIcon = (type) => {
        const icons = {
            document: '📄',
            video: '🎥',
            presentation: '📊',
            code: '💻',
            other: '📎'
        };
        return icons[type] || icons.other;
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="instructor-portal">
                <div className="portal-header">
                    <h1>Upload Resources</h1>
                </div>
                <div className="loading-container">
                    <div className="spinner"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="instructor-portal">
            <div className="portal-header">
                <h1>Upload Resources</h1>
                <p>Share learning materials with your students</p>
            </div>

            <div className="upload-container">
                {/* Course Selection */}
                <div className="card shadow-xl border-2 border-primary-50" style={{ marginBottom: '2.5rem', position: 'relative', zIndex: 60 }}>
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Choose Course to Manage Resources</label>
                    <select
                        className="form-input w-full p-4 border-2 rounded-2xl focus:ring-4 focus:ring-primary-100 transition-all font-bold text-slate-700"
                        style={{ cursor: 'pointer', appearance: 'auto' }}
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">-- Select a Course from the List --</option>
                        {courses.map((course) => (
                            <option key={course._id} value={course._id}>
                                {course.title}
                            </option>
                        ))}
                    </select>
                </div>

                {selectedCourse && (
                    <>
                        {/* Upload Form */}
                        <div className="card upload-form shadow-2xl border-2 border-slate-100">
                            <h3 className="text-2xl font-black mb-8 italic text-slate-900">Upload New Resource</h3>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="form-group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Resource Title</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="e.g. Course Syllabus PDF"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Description</label>
                                    <textarea
                                        className="form-input"
                                        rows="3"
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Brief description of the resource..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="form-group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Resource Type</label>
                                        <select
                                            className="form-input"
                                            value={formData.type}
                                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                            required
                                        >
                                            <option value="document">Document (PDF/DOC)</option>
                                            <option value="video">Video Lecture</option>
                                            <option value="presentation">Presentation</option>
                                            <option value="code">Source Code</option>
                                            <option value="other">Other Material</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4 mb-2 block">Choose File</label>
                                        <input
                                            id="file-input"
                                            type="file"
                                            className="form-input pt-3"
                                            onChange={handleFileChange}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black flex items-center justify-center gap-3 hover:bg-primary-600 transition-all shadow-xl active:scale-95"
                                        disabled={uploading}
                                    >
                                        {uploading ? 'Processing Upload...' : <><span className="text-xl">📤</span> Upload Resource Now</>}
                                    </button>
                                    <p className="text-[10px] text-center text-slate-400 font-bold uppercase mt-4 tracking-tighter">Maximum file size allowed: 50MB</p>
                                </div>
                            </form>
                        </div>

                        {/* Resources List */}
                        <div className="resources-section" style={{ marginTop: '2rem' }}>
                            <h3>Uploaded Resources</h3>
                            {resources.length === 0 ? (
                                <div className="card text-center">
                                    <p>No resources uploaded yet</p>
                                </div>
                            ) : (
                                <div className="resources-grid">
                                    {resources.map((resource) => (
                                        <div key={resource._id} className="card resource-card">
                                            <div className="resource-header">
                                                <div className="resource-icon">
                                                    {getResourceIcon(resource.type)}
                                                </div>
                                                <div className="resource-info">
                                                    <h4>{resource.title}</h4>
                                                    <p className="resource-meta">
                                                        {resource.type ? (resource.type.charAt(0).toUpperCase() + resource.type.slice(1)) : 'Resource'}
                                                        {resource.fileSize && ` • ${formatFileSize(resource.fileSize)}`}
                                                    </p>
                                                </div>
                                            </div>

                                            {resource.description && (
                                                <p className="resource-description">{resource.description}</p>
                                            )}

                                            <div className="resource-footer">
                                                <small>Uploaded: {formatDate(resource.uploadedAt || resource.createdAt)}</small>
                                                <div className="resource-actions">
                                                    <a
                                                        href={resource.fileUrl ? `${UPLOAD_URL}${resource.fileUrl}` : resource.url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="btn btn-sm btn-secondary"
                                                    >
                                                        View
                                                    </a>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(resource._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .upload-container {
                    padding: 2rem 0;
                }

                .upload-form {
                    max-width: 600px;
                }

                .resources-grid {
                    display: grid;
                    gap: 1.5rem;
                    margin-top: 1rem;
                }

                .resource-card {
                    transition: transform 0.2s ease, box-shadow 0.2s ease;
                }

                .resource-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
                }

                .resource-header {
                    display: flex;
                    gap: 1rem;
                    margin-bottom: 1rem;
                }

                .resource-icon {
                    font-size: 2.5rem;
                    display: flex;
                    align-items: center;
                }

                .resource-info {
                    flex: 1;
                }

                .resource-info h4 {
                    margin: 0 0 0.25rem 0;
                    color: var(--primary);
                }

                .resource-meta {
                    margin: 0;
                    font-size: 0.9rem;
                    color: var(--gray-600);
                }

                .resource-description {
                    color: var(--gray-700);
                    margin-bottom: 1rem;
                }

                .resource-footer {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 1rem;
                    border-top: 1px solid var(--gray-200);
                }

                .resource-actions {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-sm {
                    padding: 0.4rem 0.8rem;
                    font-size: 0.875rem;
                }

                .btn-danger {
                    background: #dc3545;
                    color: white;
                }

                .btn-danger:hover {
                    background: #c82333;
                }
            `}</style>
        </div>
    );
};

export default UploadResources;
