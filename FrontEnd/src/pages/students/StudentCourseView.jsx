import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { courseAPI, studentAPI, UPLOAD_URL } from "../../services/api";
import { FaBook, FaFileAlt, FaUserCheck, FaChevronRight } from "react-icons/fa";

const StudentCourseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State for course data, attendance data, loading, and active tab
  const [course, setCourse] = useState(null);
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("syllabus");

  // Fetch course and attendance data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [courseRes, attendanceRes] = await Promise.all([
          courseAPI.getCourseById(id),
          studentAPI.getMyAttendance(id).catch(() => ({ data: { data: null } })),
        ]);

        setCourse(courseRes.data.course);
        setAttendanceData(attendanceRes?.data?.data || null);
        setLoading(false);
      } catch (error) {
        alert(error.response?.data?.message || "Unauthorized access. Please enroll first.");
        navigate(`/course/${id}`);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Show loading while fetching
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // Show if course not found
  if (!course) return <div className="text-center py-20">Course not found</div>;

  return (
    <div className="course-view-page bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">

        {/* Course Header */}
        <div className="course-header bg-white p-8 rounded-[2rem] shadow-sm mb-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-black uppercase">
                Enrolled
              </span>
              <span className="text-slate-400 text-sm font-bold">
                Course ID: {course._id.slice(-6)}
              </span>
            </div>
            <h1 className="text-3xl font-black text-slate-900">{course.title}</h1>
            <p className="text-slate-500 font-medium mt-1">
              Instructor: <span className="text-slate-900 font-bold">{course.instructor?.name || 'Sipalaya Tech'}</span>
            </p>
          </div>
          <Link to="/student/dashboard" className="text-sm font-black text-primary-600 flex items-center gap-2 hover:gap-3 transition-all">
            Back to Dashboard <FaChevronRight />
          </Link>
        </div>

        {/* Main Content */}
        <div className="course-content-grid lg:grid lg:grid-cols-3 gap-8">

          {/* Left Content */}
          <div className="main-content lg:col-span-2">

            {/* Tabs */}
            <div className="tabs flex gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
              <button
                onClick={() => setActiveTab("syllabus")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                  activeTab === "syllabus" ? "bg-primary-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <FaBook /> Syllabus
              </button>
              <button
                onClick={() => setActiveTab("resources")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                  activeTab === "resources" ? "bg-primary-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <FaFileAlt /> Resources
              </button>
              <button
                onClick={() => setActiveTab("attendance")}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-sm transition-all ${
                  activeTab === "attendance" ? "bg-primary-600 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                <FaUserCheck /> Attendance
              </button>
            </div>

            {/* Tab Content */}
            <div className="tab-content bg-white p-8 rounded-[2rem] shadow-sm">

              {/* Syllabus Tab */}
              {activeTab === "syllabus" && (
                <div className="space-y-6">
                  {course.syllabusFile && (
                    <div className="mb-10 p-6 bg-slate-900 rounded-[2rem] text-white flex items-center justify-between shadow-xl">
                      <div>
                        <h4 className="font-black italic">Detailed Curriculum</h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Download full program documentation</p>
                      </div>
                      <a
                        href={`${UPLOAD_URL}/${course.syllabusFile}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-6 py-3 bg-primary-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-primary-600 transition-all shadow-lg active:scale-95"
                      >
                        Download PDF
                      </a>
                    </div>
                  )}
                  {course.syllabus?.map((item, index) => (
                    <div key={index} className="flex gap-6 group">
                      <div className="flex flex-col items-center">
                        <div className="w-10 h-10 rounded-full border-2 border-primary-100 flex items-center justify-center font-black text-primary-500 group-hover:bg-primary-600 group-hover:text-white group-hover:border-primary-600 transition-all">
                          {index + 1}
                        </div>
                        {index !== course.syllabus.length - 1 && <div className="w-0.5 h-full bg-slate-100"></div>}
                      </div>
                      <div className="pb-8">
                        <h3 className="text-xl font-black text-slate-900 mb-2">{item.topic}</h3>
                        <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                        <div className="mt-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Est. Week {item.week}</div>
                      </div>
                    </div>
                  )) || <div className="text-center py-10 text-slate-400 italic">No syllabus content available.</div>}
                </div>
              )}

              {/* Resources Tab */}
              {activeTab === "resources" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {course.resources?.map((res, index) => (
                    <div key={index} className="resource-item p-6 rounded-2xl border border-slate-100 hover:border-primary-100 hover:shadow-md transition-all flex items-center gap-4">
                      <div className="h-12 w-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl">
                        {res.type === "video" ? "📺" : res.type === "document" ? "📄" : "🔗"}
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-bold text-slate-900">{res.title}</h3>
                        {res.description && <p className="text-xs text-slate-500 mb-2">{res.description}</p>}
                        <a
                          href={res.fileUrl ? `${UPLOAD_URL}${res.fileUrl}` : res.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary-600 text-xs font-black uppercase mt-1 inline-block hover:underline"
                        >
                          {res.type === "link" ? "Visit Link" : "Open Material"}
                        </a>
                      </div>
                    </div>
                  )) || <div className="col-span-full text-center py-10 text-slate-400 italic">No resources uploaded yet.</div>}
                </div>
              )}

              {/* Attendance Tab */}
              {activeTab === "attendance" && (
                <div className="attendance-view">
                  <div className="grid grid-cols-3 gap-4 mb-10 text-center">
                    <div className="p-4 bg-slate-50 rounded-2xl">
                      <div className="text-2xl font-black text-slate-900">{attendanceData?.totalClasses || 0}</div>
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Classes</div>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-2xl">
                      <div className="text-2xl font-black text-emerald-600">{attendanceData?.presentClasses || 0}</div>
                      <div className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Present</div>
                    </div>
                    <div className="p-4 bg-primary-50 rounded-2xl">
                      <div className="text-2xl font-black text-primary-600">{attendanceData?.attendancePercentage || 0}%</div>
                      <div className="text-[10px] font-black text-primary-400 uppercase tracking-widest">Attendance</div>
                    </div>
                  </div>

                  {attendanceData?.attendance?.map((rec, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 mb-2">
                      <div className="flex items-center gap-4">
                        <div className={`h-2 w-2 rounded-full ${rec.status === "present" ? "bg-emerald-500" : "bg-red-500"}`}></div>
                        <span className="font-bold text-slate-700">{new Date(rec.date).toLocaleDateString()}</span>
                      </div>
                      <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${rec.status === "present" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"}`}>
                        {rec.status}
                      </span>
                    </div>
                  )) || <div className="text-center py-10 text-slate-400 italic">No attendance records found.</div>}
                </div>
              )}

            </div>

          </div>

          {/* Right Sidebar */}
          <div className="sidebar space-y-8">
            <div className="progress-card bg-indigo-900 p-8 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
              <h3 className="text-xl font-black italic mb-6">Learning Pulse</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div><span className="text-xs font-black inline-block py-1 px-2 uppercase rounded-full text-indigo-100 bg-white/10">Course Progress</span></div>
                  <div className="text-right"><span className="text-lg font-black inline-block text-white">{attendanceData?.progress || 0}%</span></div>
                </div>
                <div className="overflow-hidden h-3 mb-4 text-xs flex rounded-full bg-white/10">
                  <div style={{ width: `${attendanceData?.progress || 0}%` }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-primary-500 transition-all duration-500"></div>
                </div>
              </div>
              <p className="text-xs text-indigo-300 font-bold italic opacity-70 mt-2">Finish all assignments and maintain 75% attendance for certification.</p>
            </div>

            <div className="card bg-white p-8 rounded-[2rem] shadow-sm space-y-6">
              <h3 className="text-xl font-black text-slate-900 italic">Next Steps</h3>
              <Link to="/student/assignments" className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:bg-slate-800 transition-all active:scale-95">
                <FaFileAlt /> Open Assignments
              </Link>
              <Link to="/contact" className="w-full py-4 border-2 border-slate-900 text-slate-900 rounded-2xl font-black text-center flex items-center justify-center gap-3 hover:bg-slate-900 hover:text-white transition-all">
                Get Support
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default StudentCourseView;