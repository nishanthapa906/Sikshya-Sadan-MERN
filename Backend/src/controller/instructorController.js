import Course from '../models/courseModel.js';
// import Assignment from '../models/assignmentModel.js';
import Enrollment from '../models/enrollmentModel.js';

// Dashboard
export const getDashboard = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        const courseIds = courses.map(c => c._id);

        const totalStudents = await Enrollment.countDocuments({ course: { $in: courseIds } });

        res.status(200).json({
            status: 200,
            success: true,
            data: {
                totalCourses: courses.length,
                totalStudents,
                courses
            }
        });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// My Courses
export const getMyCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        res.status(200).json({ status: 200, success: true, courses });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// My Students (scoped to instructor's own courses)
export const getMyStudents = async (req, res) => {
    try {
        // Get all courses belonging to this instructor
        const myCourses = await Course.find({ instructor: req.user.id }).select('_id');
        const myCourseIds = myCourses.map(c => c._id);

        // Build query: if a specific courseId is given, confirm it's the instructor's
        let query;
        if (req.params.courseId) {
            const isOwned = myCourseIds.some(id => id.toString() === req.params.courseId);
            if (!isOwned) {
                return res.status(403).json({ status: 403, success: false, message: 'Access denied' });
            }
            query = { course: req.params.courseId };
        } else {
            query = { course: { $in: myCourseIds } };
        }

        const enrollments = await Enrollment.find(query)
            .populate('student', 'name email phone avatar lastActive')
            .populate('course', 'title');

        res.status(200).json({ status: 200, success: true, count: enrollments.length, enrollments });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Create Assignment
export const createAssignment = async (req, res) => {
    try {
        req.body.createdBy = req.user.id;
        req.body.course = req.params.courseId;

        if (req.files && req.files.length > 0) {
            req.body.attachments = req.files.map(file => ({
                filename: file.originalname,
                url: `/uploads/${file.filename}`
            }));
        }

        const assignment = await Assignment.create(req.body);
        res.status(201).json({ status: 201, success: true, message: 'Assignment Created Successfully!', assignment });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Get Course Assignments
export const getCourseAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ course: req.params.courseId });
        res.status(200).json({ status: 200, success: true, assignments });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Grade Submission
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { marks, feedback } = req.body;

        const assignment = await Assignment.findOne({ "submissions._id": submissionId });
        const submission = assignment.submissions.id(submissionId);

        submission.marksObtained = marks;
        submission.feedback = feedback;
        submission.status = 'graded';
        submission.gradedBy = req.user.id;
        submission.gradedAt = new Date();

        await assignment.save();
        res.status(200).json({ status: 200, success: true, message: 'Submission Graded Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Upload Resource
export const uploadResource = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        const resource = {
            title: req.body.title,
            description: req.body.description,
            type: req.body.type,
            fileUrl: req.file ? `/uploads/${req.file.filename}` : req.body.url
        };
        course.resources.push(resource);
        await course.save();
        res.status(200).json({ status: 200, success: true, message: 'Resource Added Successfully!', course });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Delete Resource
export const deleteResource = async (req, res) => {
    try {
        const course = await Course.findOne({ "resources._id": req.params.resourceId });
        course.resources.pull(req.params.resourceId);
        await course.save();
        res.status(200).json({ status: 200, success: true, message: 'Resource Deleted Successfully!' });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Attendance - prevents double marking on same calendar date
export const markAttendance = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId);
        if (!enrollment) {
            return res.status(404).json({ status: 404, success: false, message: 'Enrollment not found' });
        }

        // Normalize the date to just YYYY-MM-DD for comparison
        const today = new Date();
        const targetDate = req.body.date ? new Date(req.body.date) : today;
        const targetDateStr = targetDate.toISOString().split('T')[0];
        const todayStr = today.toISOString().split('T')[0];

        // 🚨 LOGIC: Prevent marking for future dates
        if (targetDate > today && targetDateStr !== todayStr) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Attendance cannot be marked for future dates.'
            });
        }

        // Check if attendance already recorded for that date
        const alreadyMarked = enrollment.attendance.find(a => {
            const existingDateStr = new Date(a.date).toISOString().split('T')[0];
            return existingDateStr === targetDateStr;
        });

        if (alreadyMarked) {
            // Allow UPDATE if it's the same date (e.g., change from present to late)
            alreadyMarked.status = req.body.status;
            await enrollment.save();
            return res.status(200).json({
                status: 200,
                success: true,
                message: `Attendance updated to "${req.body.status}" for ${targetDateStr}`,
                updated: true
            });
        }

        enrollment.attendance.push({
            date: new Date(targetDateStr + 'T12:00:00Z'),
            status: req.body.status
        });
        await enrollment.save();
        res.status(200).json({ status: 200, success: true, message: 'Attendance Marked Successfully!', updated: false });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Get Course Resources
export const getCourseResources = async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        res.status(200).json({ status: 200, success: true, resources: course.resources });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};

// Update Enrollment
export const updateEnrollment = async (req, res) => {
    try {
        const updateData = { ...req.body };
        // Auto-stamp completionDate when instructor marks as completed
        if (updateData.status === 'completed') {
            updateData.completionDate = new Date();
        }
        const enrollment = await Enrollment.findByIdAndUpdate(req.params.id, updateData, { new: true });
        res.status(200).json({ status: 200, success: true, message: 'Enrollment Updated Successfully!', enrollment });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
// Get Assignment Submissions
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.assignmentId).populate('submissions.student', 'name email avatar');
        res.status(200).json({ status: 200, success: true, submissions: assignment.submissions });
    } catch (error) {
        res.status(500).json({ status: 500, success: false, message: error.message });
    }
};
