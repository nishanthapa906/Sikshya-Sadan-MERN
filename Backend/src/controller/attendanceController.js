import Attendance from '../models/attendanceModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';

export const markAttendance = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId);
        if (!enrollment) return res.status(404).json({ success: false, message: 'Enrollment not found' });
        const course = await Course.findById(enrollment.course);
        if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin')
            return res.status(403).json({ success: false, message: 'Not authorized' });

        const inputDate = new Date(req.body.date);
        inputDate.setHours(0, 0, 0, 0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (inputDate.getTime() !== today.getTime())
            return res.status(400).json({ success: false, message: 'Only today attendance allowed' });

        const exists = await Attendance.findOne({ student: enrollment.student, course: enrollment.course, date: { $gte: today, $lt: new Date(today.getTime() + 86400000) } });
        if (exists) return res.status(400).json({ success: false, message: 'Attendance already marked today' });

        const attendance = await Attendance.create({ course: enrollment.course, student: enrollment.student, date: new Date(req.body.date), status: req.body.status || 'present', markedBy: req.user.id });
        res.status(201).json({ success: true, data: attendance });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getMyAttendance = async (req, res) => {
    try {
        const list = await Attendance.find({ student: req.user.id, course: req.params.courseId }).sort({ date: -1 });
        const summary = { present: 0, late: 0, absent: 0, total: list.length };
        list.forEach(r => { summary[r.status] = (summary[r.status] || 0) + 1; });
        res.json({ success: true, data: list, summary });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
