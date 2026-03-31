import React, { useState, useEffect } from 'react';
import { courseAPI, UPLOAD_URL } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { FaPlus, FaTrash, FaEdit, FaImage, FaClock, FaMoneyBillWave, FaLevelUpAlt, FaCalendarAlt, FaArrowRight, FaFileAlt } from 'react-icons/fa';


const ManageCourses = () => {
    const { user } = useAuth();
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [thumbnail, setThumbnail] = useState(null);
    const [syllabusFile, setSyllabusFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [newCourse, setNewCourse] = useState({
        title: '',
        category: 'Programming',
        skillLevel: 'Beginner',
        duration: '',
        fee: '',
        description: '',
        startDate: '',
        installmentAvailable: false,
        prerequisites: ''
    });

    const [syllabus, setSyllabus] = useState([
        { week: 1, topic: '', description: '' }
    ]);

    const toInputDate = (value) => {
        if (!value) return '';
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) return '';
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    useEffect(() => {
        fetchMyCourses();
    }, []);

    const fetchMyCourses = async () => {
        try {
            setLoading(true);
            const response = await courseAPI.getInstructorCourses();
            setCourses(response.data.courses || []);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching courses:', err);
            setError('Failed to load courses.');
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewCourse({
            ...newCourse,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSyllabusChange = (index, field, value) => {
        const updatedSyllabus = [...syllabus];
        updatedSyllabus[index][field] = value;
        setSyllabus(updatedSyllabus);
    };

    const addSyllabusModule = () => {
        setSyllabus([...syllabus, { week: syllabus.length + 1, topic: '', description: '' }]);
    };

    const removeSyllabusModule = (index) => {
        if (syllabus.length === 1) return;
        const updatedSyllabus = syllabus.filter((_, i) => i !== index);
        // Regulate week numbers
        const regulatedSyllabus = updatedSyllabus.map((s, i) => ({ ...s, week: i + 1 }));
        setSyllabus(regulatedSyllabus);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSyllabusFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSyllabusFile(file);
        }
    };

    const handleEditCourse = (course) => {
        setIsEditing(true);
        setEditingId(course._id);
        setNewCourse({
            title: course.title || '',
            category: course.category || 'Programming',
            skillLevel: course.skillLevel || 'Beginner',
            duration: course.duration || '',
            fee: course.fee || '',
            description: course.description || '',
            startDate: toInputDate(course.startDate),
            installmentAvailable: course.installmentAvailable || false,
            prerequisites: Array.isArray(course.prerequisites) ? course.prerequisites.join(', ') : (course.prerequisites || '')
        });
        setSyllabus(course.syllabus && course.syllabus.length > 0 ? course.syllabus : [{ week: 1, topic: '', description: '' }]);
        setPreviewUrl(course.thumbnail ? `${UPLOAD_URL}/${course.thumbnail}` : null);
        setShowCreateForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCreateCourse = async (e) => {
        e.preventDefault();

        if (!newCourse.startDate) {
            alert('Please select a start date');
            return;
        }

        const parsedStartDate = new Date(newCourse.startDate);
        if (Number.isNaN(parsedStartDate.getTime())) {
            alert('Please select a valid start date');
            return;
        }

        try {
            const formData = new FormData();
            // Append basic fields
            Object.keys(newCourse).forEach(key => {
                if (key === 'prerequisites') {
                    const prerequisites = newCourse.prerequisites
                        .split(',')
                        .map((item) => item.trim())
                        .filter(Boolean);
                    formData.append(key, JSON.stringify(prerequisites));
                    return;
                }
                formData.append(key, newCourse[key]);
            });

            // Append syllabus as JSON string
            formData.append('syllabus', JSON.stringify(syllabus));

            if (thumbnail) {
                formData.append('thumbnail', thumbnail);
            }

            if (syllabusFile) {
                formData.append('syllabusFile', syllabusFile);
            }

            let response;
            if (isEditing) {
                response = await courseAPI.updateCourse(editingId, formData);
            } else {
                response = await courseAPI.createCourse(formData);
            }

            if (response.data.success) {
                alert(`Course ${isEditing ? 'updated' : 'created'} successfully!`);
                setShowCreateForm(false);
                setIsEditing(false);
                setEditingId(null);
                setNewCourse({
                    title: '',
                    category: 'Programming',
                    skillLevel: 'Beginner',
                    duration: '',
                    fee: '',
                    description: '',
                    startDate: '',
                    installmentAvailable: false,
                    prerequisites: ''
                });
                setSyllabus([{ week: 1, topic: '', description: '' }]);
                setThumbnail(null);
                setSyllabusFile(null);
                setPreviewUrl(null);
                fetchMyCourses();
            }
        } catch (err) {
            console.error('Error with course:', err);
            const msg = err.response?.data?.errors
                ? err.response.data.errors.map(e => e.msg).join('\n')
                : (err.response?.data?.message || `Failed to ${isEditing ? 'update' : 'create'} course`);
            alert(msg);
        }
    };

    const handleDeleteCourse = async (id) => {
        if (!window.confirm('Are you sure you want to delete this course?')) return;
        try {
            await courseAPI.deleteCourse(id);
            alert('Course deleted successfully');
            fetchMyCourses();
        } catch (err) {
            alert('Failed to delete course');
        }
    };

    if (loading) return (
        <div className="instructor-portal min-h-screen bg-slate-50 flex items-center justify-center">
            <div className="loading-container flex flex-col items-center gap-4">
                <div className="spinner h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="font-black text-slate-400 uppercase tracking-widest text-xs">Syncing Your Ecosystem...</p>
            </div>
        </div>
    );

    return (
        <div className="instructor-portal min-h-screen bg-slate-50 pb-24">
            <div className="portal-header flex justify-between items-center mb-12 p-8 bg-white shadow-sm border-b border-slate-100">
                <div className="flex-1">
                    <h1 className="text-4xl font-black italic text-slate-900 leading-tight">Course Sovereignty</h1>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mt-2">Architect and deploy industrial training programs</p>
                </div>
                <button
                    className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all active:scale-95 shadow-xl ${showCreateForm ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-slate-900 text-white hover:bg-primary-600'}`}
                    onClick={() => setShowCreateForm(!showCreateForm)}
                >
                    {showCreateForm ? 'Abort Mission' : <><FaPlus /> Launch New Program</>}
                </button>
            </div>

            <div className="container mx-auto px-8">
                {showCreateForm && (
                    <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden mb-16 animate-fadeIn">
                        <div className="bg-slate-900 p-8 text-white flex items-center justify-between">
                            <h2 className="text-2xl font-black italic">Program Configuration</h2>
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-400">Step 01: Core Definition</span>
                        </div>

                        <form onSubmit={handleCreateCourse} className="p-12 space-y-12">
                            <div className="grid lg:grid-cols-2 gap-12">
                                {/* LEFT: BASIC INFO */}
                                <div className="space-y-8">
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Program Title</label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 transition-all"
                                            placeholder="e.g. MERN Stack Industrial Mastery"
                                            value={newCourse.title}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Category</label>
                                            <select
                                                name="category"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 appearance-none"
                                                value={newCourse.category}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Programming">Programming</option>
                                                <option value="Web Development">Web Development</option>
                                                <option value="Data Science">Data Science</option>
                                                <option value="Graphic Design">Graphic Design</option>
                                                <option value="Mobile Development">Mobile Development</option>
                                                <option value="Cloud Computing">Cloud Computing</option>
                                                <option value="Cybersecurity">Cybersecurity</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Skill Level</label>
                                            <select
                                                name="skillLevel"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 appearance-none"
                                                value={newCourse.skillLevel}
                                                onChange={handleInputChange}
                                            >
                                                <option value="Beginner">Beginner</option>
                                                <option value="Intermediate">Intermediate</option>
                                                <option value="Advanced">Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Duration (Hrs)</label>
                                            <input
                                                type="number"
                                                name="duration"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800"
                                                placeholder="60"
                                                value={newCourse.duration}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Total Fee (Rs.)</label>
                                            <input
                                                type="number"
                                                name="fee"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800"
                                                placeholder="25000"
                                                value={newCourse.fee}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div className="form-group space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Official Start Date</label>
                                            <input
                                                type="date"
                                                name="startDate"
                                                className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800"
                                                value={newCourse.startDate}
                                                onChange={handleInputChange}
                                                required
                                            />
                                        </div>
                                        <div className="form-group flex flex-col justify-end pb-4 pl-4">
                                            <label className="flex items-center gap-3 cursor-pointer group">
                                                <input
                                                    type="checkbox"
                                                    name="installmentAvailable"
                                                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500"
                                                    checked={newCourse.installmentAvailable}
                                                    onChange={handleInputChange}
                                                />
                                                <span className="text-xs font-black uppercase tracking-widest text-slate-600 group-hover:text-primary-600 transition-colors">Installment Plan Available</span>
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT: ASSETS & DESCRIPTION */}
                                <div className="space-y-8">
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Visual Identity (Thumbnail)</label>
                                        <div className="relative group border-4 border-dashed border-slate-100 rounded-[2.5rem] h-[16.5rem] flex flex-col items-center justify-center bg-slate-50 overflow-hidden cursor-pointer hover:border-primary-200 transition-all">
                                            {previewUrl ? (
                                                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="text-center">
                                                    <FaImage size={48} className="text-slate-200 mx-auto mb-4" />
                                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Click to deploy banner</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Mission Objectives (Description)</label>
                                        <textarea
                                            name="description"
                                            className="w-full bg-slate-50 border-0 rounded-3xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-medium text-slate-600 leading-relaxed italic"
                                            rows="5"
                                            placeholder="What will students master by the end of this journey?"
                                            value={newCourse.description}
                                            onChange={handleInputChange}
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Foundational Prerequisites</label>
                                        <input
                                            type="text"
                                            name="prerequisites"
                                            className="w-full bg-slate-50 border-0 rounded-2xl px-6 py-4 focus:ring-4 ring-primary-100 outline-none font-bold text-slate-800 transition-all"
                                            placeholder="basic javascript, react (comma separated)"
                                            value={newCourse.prerequisites || ''}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                    <div className="form-group space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-4">Curriculum Document (PDF)</label>
                                        <div className="relative group/syllabus border-2 border-dashed border-slate-100 rounded-2xl p-6 bg-slate-50 hover:border-primary-200 transition-all cursor-pointer">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary-600">
                                                    <FaFileAlt />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-black uppercase tracking-widest text-slate-700 truncate">
                                                        {syllabusFile ? syllabusFile.name : 'Upload Detailed Syllabus'}
                                                    </p>
                                                    <p className="text-[10px] text-slate-400 font-medium">Supporting documentation (PDF, DOCX)</p>
                                                </div>
                                            </div>
                                            <input
                                                type="file"
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                                onChange={handleSyllabusFileChange}
                                                accept=".pdf,.doc,.docx"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* SYLLABUS BUILDER */}
                            <div className="pt-12 border-t border-slate-100">
                                <div className="flex justify-between items-end mb-8">
                                    <div>
                                        <h3 className="text-xl font-black italic text-slate-900">Program Syllabus</h3>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Breakdown your curriculum into weekly modules</p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={addSyllabusModule}
                                        className="flex items-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all shadow-sm"
                                    >
                                        <FaPlus /> Add Module
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {syllabus.map((module, idx) => (
                                        <div key={idx} className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 relative group/module animate-fadeIn">
                                            <div className="absolute -top-3 -left-3 h-10 w-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg">
                                                {module.week}
                                            </div>
                                            {syllabus.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSyllabusModule(idx)}
                                                    className="absolute top-4 right-4 h-8 w-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover/module:opacity-100 transition-opacity hover:bg-red-500 hover:text-white"
                                                >
                                                    <FaTrash size={12} />
                                                </button>
                                            )}
                                            <div className="grid md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Topic</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white border-0 rounded-xl px-4 py-3 focus:ring-2 ring-primary-100 outline-none font-bold text-slate-800"
                                                        placeholder="e.g. Introduction to React Architecture"
                                                        value={module.topic}
                                                        onChange={(e) => handleSyllabusChange(idx, 'topic', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Brief Overview / Learnings</label>
                                                    <input
                                                        type="text"
                                                        className="w-full bg-white border-0 rounded-xl px-4 py-3 focus:ring-2 ring-primary-100 outline-none font-medium text-slate-500 italic"
                                                        placeholder="Components, Hooks, and Props management..."
                                                        value={module.description}
                                                        onChange={(e) => handleSyllabusChange(idx, 'description', e.target.value)}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button type="submit" className="w-full py-6 bg-primary-600 text-white rounded-[2.5rem] font-black text-xl shadow-2xl shadow-primary-200 hover:bg-slate-900 transition-all transform active:scale-[0.98] mt-8 flex items-center justify-center gap-4">
                                {isEditing ? 'Update & Relaunch Track' : 'Decipher & Launch Program'} <FaArrowRight />
                            </button>
                        </form>
                    </div>
                )}


                <div className="course-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                    {courses.length === 0 ? (
                        <div className="card text-center py-20 bg-slate-50 border-dashed border-2 border-slate-200" style={{ gridColumn: '1/-1' }}>
                            <p className="text-slate-400 font-bold">You haven't launched any courses yet.</p>
                        </div>
                    ) : (
                        courses.map(course => (
                            <div key={course._id} className="card course-card overflow-hidden hover:shadow-2xl transition-all group">
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={course.thumbnail ? `${UPLOAD_URL}/${course.thumbnail}` : 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                                        alt={course.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 left-4">
                                        <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-primary-600">
                                            {course.category}
                                        </span>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                                        <div className="flex justify-between items-end">
                                            <h3 className="text-white font-black text-xl italic leading-tight flex-grow">{course.title}</h3>
                                            {course.syllabusFile && (
                                                <a
                                                    href={`${UPLOAD_URL}/${course.syllabusFile}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="h-8 w-8 bg-white/20 hover:bg-white/40 backdrop-blur rounded-lg flex items-center justify-center text-white mb-1"
                                                    title="View Syllabus PDF"
                                                >
                                                    <FaFileAlt size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                            <FaClock className="text-primary-500" /> {course.duration} Hrs
                                        </div>
                                        <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase">
                                            <FaLevelUpAlt className="text-emerald-500" /> {course.skillLevel}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Enrolled</span>
                                            <span className="text-lg font-black text-slate-800">{course.enrolledStudents || 0} Students</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditCourse(course)}
                                                className="h-10 w-10 bg-slate-100 flex items-center justify-center rounded-xl text-slate-600 hover:bg-primary-50 hover:text-primary-600 transition-all"
                                            >
                                                <FaEdit />
                                            </button>
                                            {user?.role === 'admin' && (
                                                <button
                                                    onClick={() => handleDeleteCourse(course._id)}
                                                    className="h-10 w-10 bg-red-50 flex items-center justify-center rounded-xl text-red-400 hover:bg-red-500 hover:text-white transition-all"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManageCourses;
