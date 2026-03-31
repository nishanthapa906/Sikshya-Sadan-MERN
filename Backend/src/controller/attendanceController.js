import Attendance from '../models/attendanceModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';

export const markAttendance = async (req, res) => {
    try {
        const { enrollmentId } = req.params;
        const { date, status } = req.body;
        
        const enrollment = await Enrollment.findById(enrollmentId);
        if (!enrollment) return res.status(404).json({ status: 404, success: false, message: 'Enrollment not found' });
        
        const course = await Course.findById(enrollment.course);
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ status: 403, success: false, message: 'Not authorized for this course' });
        }

        // 1. Validate Date (Only Today is allowed)
        const inputDate = new Date(date);
        inputDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        if (inputDate.getTime() !== today.getTime()) {
            return res.status(400).json({ status: 400, success: false, message: 'You can only mark attendance for today' });
        }

        // 2. Prevent Duplicate Attendance for the same day
        const existingAttendance = await Attendance.findOne({
            student: enrollment.student,
            course: enrollment.course,
            date: {
                $gte: today,
                $lt: new Date(today.getTime() + 24 * 60 * 60 * 1000)
            }
        });

        if (existingAttendance) {
            return res.status(400).json({ status: 400, success: false, message: 'Attendance already marked for this student today' });
        }

        const attendance = await Attendance.create({
            course: enrollment.course,
            student: enrollment.student,
            date: new Date(date),
            status: status || 'present',
            markedBy: req.user.id
        });

        res.status(201).json({ status: 201, success: true, data: attendance });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        const { courseId } = req.params;
        const attendanceList = await Attendance.find({ student: req.user.id, course: courseId }).sort({ date: -1 });
        
        const summary = {
            present: 0,
            late: 0,
            absent: 0,
            total: attendanceList.length
        };

        attendanceList.forEach(record => {
            if (record.status === 'present') summary.present++;
            else if (record.status === 'late') summary.late++;
            else if (record.status === 'absent') summary.absent++;
        });

        res.status(200).json({ status: 200, success: true, data: attendanceList, summary });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
