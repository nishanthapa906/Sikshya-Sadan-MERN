import React, { useState, useEffect } from 'react';
import { instructorAPI } from '../../services/api';
import { MdDelete } from 'react-icons/md';

// Utility for strict correct local YYYY-MM-DD
const getLocalDateString = (dateObj = new Date()) => {
    const d = new Date(dateObj);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const InstructorAttendance = () => {
    const [courses, setCourses] = useState([]);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [studentList, setStudentList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [marking, setMarking] = useState(null); // track which enrollment is being marked
    const [attendanceDate, setAttendanceDate] = useState(getLocalDateString());
    const [markedToday, setMarkedToday] = useState({}); // { enrollmentId: 'present' | 'absent' | 'late' }

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        if (selectedCourse) {
            fetchStudents();
        } else {
            setStudentList([]);
            setMarkedToday({});
        }
    }, [selectedCourse]);

    // Re-compute already-marked state whenever date or student list changes
    useEffect(() => {
        if (studentList.length > 0) {
            computeMarkedState();
        }
    }, [attendanceDate, studentList]);

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

    const fetchStudents = async () => {
        try {
            const response = await instructorAPI.getMyStudents(selectedCourse);
            // This is strictly fetching live database data directly via API call
            setStudentList(response.data.enrollments || []);
        } catch (err) {
            console.error('Failed to load students:', err);
        }
    };

    const computeMarkedState = () => {
        const marked = {};
        studentList.forEach(enrollment => {
            const rec = enrollment.attendance?.find(a => {
                const d = getLocalDateString(a.date);
                return d === attendanceDate;
            });
            if (rec) {
                marked[enrollment._id] = rec.status;
            }
        });
        setMarkedToday(marked);
    };

    const handleMarkAttendance = async (enrollmentId, status) => {
        try {
            setMarking(enrollmentId + '_' + status);
            // Directly updating the back-end database with the correctly formatted local date string
            const response = await instructorAPI.markAttendance(enrollmentId, {
                date: attendanceDate, // e.g. "2026-03-27"
                status
            });
            
            if (response.data.success) {
                setMarkedToday(prev => ({ ...prev, [enrollmentId]: status }));
                setStudentList(prev => prev.map(e => {
                    if (e._id !== enrollmentId) return e;
                    const existingIdx = e.attendance?.findIndex(a =>
                        getLocalDateString(a.date) === attendanceDate
                    );
                    const updatedAttendance = [...(e.attendance || [])];
                    if (existingIdx >= 0) {
                        updatedAttendance[existingIdx] = { ...updatedAttendance[existingIdx], status };
                    } else {
                        updatedAttendance.push({ date: attendanceDate, status });
                    }
                    return { ...e, attendance: updatedAttendance };
                }));
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to record attendance');
        } finally {
            setMarking(null);
        }
    };

    const isToday = attendanceDate === getLocalDateString();

    if (loading) return (
        <div className="flex h-96 items-center justify-center">
            <h1 className="text-2xl font-semibold">Loading data...</h1>
        </div>
    );

    return (
        <main className="mt-10 mb-20 m-auto w-[65%] min-w-[320px]">
            <h1 className="text-3xl font-bold mb-5">Course Attendance</h1>
            
            <section className="bg-white p-6 shadow rounded-md mb-8 flex flex-wrap gap-4 items-center">
                <div className="flex flex-col gap-y-2 flex-grow">
                    <label className="text-lg font-semibold">Select Course</label>
                    <select
                        className="border p-3 rounded-sm outline-none w-full"
                        value={selectedCourse}
                        onChange={(e) => setSelectedCourse(e.target.value)}
                    >
                        <option value="">-- Choose a course --</option>
                        {courses.map(course => (
                            <option key={course._id} value={course._id}>{course.title}</option>
                        ))}
                    </select>
                </div>
                <div className="flex flex-col gap-y-2 flex-grow">
                    <label className="text-lg font-semibold">Attendance Date</label>
                    <input
                        type="date"
                        className="border p-3 rounded-sm outline-none w-full"
                        value={attendanceDate}
                        onChange={(e) => setAttendanceDate(e.target.value)}
                        max={getLocalDateString()}
                    />
                </div>
            </section>

            {!selectedCourse ? (
                <div className="text-center p-10 bg-white shadow rounded-md text-xl font-semibold">
                    Please select a course to begin marking attendance.
                </div>
            ) : (
                <section className="space-y-4">
                    <div className="flex justify-between items-center bg-gray-100 p-4 rounded-md">
                        <h2 className="text-xl font-bold">
                            Total Students: {studentList.length}
                        </h2>
                        <h2 className="text-xl font-semibold text-blue-600">
                            {isToday ? 'Showing Today' : `Showing: ${attendanceDate}`}
                        </h2>
                    </div>

                    {studentList.length === 0 ? (
                        <div className="text-center p-10 bg-white shadow rounded-md text-xl">
                            No students are enrolled in this course yet.
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {studentList.map(enrollment => {
                                const currentStatus = markedToday[enrollment._id];
                                const isMarkingThis = marking?.startsWith(enrollment._id);

                                return (
                                    <div
                                        key={enrollment._id}
                                        className="bg-white shadow-md flex justify-between px-6 py-4 items-center rounded-lg"
                                    >
                                        <div>
                                            <h1 className="text-xl font-bold w-64">{enrollment.student?.name}</h1>
                                            <p className="text-lg text-gray-500">{enrollment.student?.email}</p>
                                        </div>

                                        <div className="flex text-lg items-center gap-x-4">
                                            {currentStatus && (
                                                <span className="font-semibold text-gray-500 mr-5">
                                                    Marked: {currentStatus.toUpperCase()}
                                                </span>
                                            )}

                                            <button
                                                onClick={() => handleMarkAttendance(enrollment._id, 'present')}
                                                disabled={!!isMarkingThis}
                                                className={`p-2 w-28 text-white rounded-sm font-semibold transition hover:opacity-80 ${currentStatus === 'present' ? 'bg-green-700' : 'bg-green-500'}`}
                                            >
                                                Present
                                            </button>
                                            <button
                                                onClick={() => handleMarkAttendance(enrollment._id, 'late')}
                                                disabled={!!isMarkingThis}
                                                className={`p-2 w-28 text-white rounded-sm font-semibold transition hover:opacity-80 ${currentStatus === 'late' ? 'bg-yellow-600' : 'bg-yellow-500'}`}
                                            >
                                                Late
                                            </button>
                                            <button
                                                onClick={() => handleMarkAttendance(enrollment._id, 'absent')}
                                                disabled={!!isMarkingThis}
                                                className={`p-2 w-28 text-white rounded-sm font-semibold transition hover:opacity-80 ${currentStatus === 'absent' ? 'bg-red-700' : 'bg-red-500'}`}
                                            >
                                                Absent
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            )}
        </main>
    );
};

export default InstructorAttendance;
