import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';
import Assignment from '../models/assignmentModel.js';
import Submission from '../models/submissionModel.js';


// Dashboard
export const getDashboard = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user.id,
            paymentStatus: { $in: ['completed', 'installment'] }
        }).populate('course');

        const totalCourses = enrollments.length;
        const activeCourses = enrollments.filter(e => e.status === 'active').length;
        const completedCourses = enrollments.filter(e => e.status === 'completed').length;

        // Count unique assignments for enrolled courses
        const courseIds = enrollments.map(e => e.course._id);
        const assignments = await Assignment.find({ course: { $in: courseIds } });
        const submissions = await Submission.find({ student: req.user.id });

        let pendingCount = 0;
        assignments.forEach(a => {
            const mySub = submissions.find(s => s.assignment.toString() === a._id.toString());
            if (!mySub) pendingCount++;
        });

        res.status(200).json({
            status: 200,
            success: true,
            data: {
                enrollments,
                totalCourses,
                activeCourses,
                completedCourses,
                pendingAssignments: pendingCount
            }
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// My Courses
export const getMyCourses = async (req, res) => {
    try {
        const enrollments = await Enrollment.find({
            student: req.user.id,
            paymentStatus: { $in: ['completed', 'installment'] }
        })
            .populate('course', 'title category thumbnail instructor')
            .populate('student', 'name email avatar');

        res.status(200).json({
            status: 200,
            success: true,
            enrollments
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Submit Assignment
// export const submitAssignment = async (req, res) => {
//     try {
//         const assignment = await Assignment.findById(req.params.assignmentId);
//         if (!assignment) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: 'Assignment not found!'
//             });
//         }

//         const submission = {
//             student: req.user.id,
//             submissionText: req.body.submissionText,
//             fileUrl: req.file ? `/uploads/${req.file.filename}` : null
//         };

//         assignment.submissions.push(submission);
//         await assignment.save();

//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: 'Assignment Submitted Successfully!',
//             data: assignment
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message
//         });
//     }
// };

// // My Assignments
// export const getMyAssignments = async (req, res) => {
//     try {
//         const enrollments = await Enrollment.find({
//             student: req.user.id,
//             paymentStatus: { $in: ['completed', 'installment'] }
//         });
//         const courseIds = enrollments.map(e => e.course);
//         const assignments = await Assignment.find({ course: { $in: courseIds } })
//             .populate('course', 'title')
//             .lean();

//         const data = assignments.map(a => {
//             const mySubmission = a.submissions?.find(s => s.student.toString() === req.user.id);
//             return {
//                 ...a,
//                 submission: mySubmission || null
//             };
//         });

//         res.status(200).json({
//             status: 200,
//             success: true,
//             count: data.length,
//             data: data
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message
//         });
//     }
// };

// // My Certificates
// export const getMyCertificates = async (req, res) => {
//     try {
//         const certificates = await Enrollment.find({ student: req.user.id, certificateIssued: true }).populate('course');
//         res.status(200).json({
//             status: 200,
//             success: true,
//             data: certificates
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message
//         });
//     }
// };

// // Claim Certificate
// export const claimCertificate = async (req, res) => {
//     try {
//         const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId })
//             .populate('course', 'title')
//             .populate('student', 'name');

//         if (!enrollment) {
//             return res.status(404).json({
//                 status: 404,
//                 success: false,
//                 message: 'Enrollment not found!'
//             });
//         }

//         if (enrollment.paymentStatus !== 'completed' && enrollment.paymentStatus !== 'installment') {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: 'Your payment must be completed to claim a certificate.'
//             });
//         }

//         if (enrollment.status !== 'completed') {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: 'Your instructor has not yet verified your course completion. Please wait for instructor verification.'
//             });
//         }

//         if (enrollment.certificateIssued) {
//             return res.status(400).json({
//                 status: 400,
//                 success: false,
//                 message: 'Certificate already issued!'
//             });
//         }

//         // Generate a unique certificate ID
//         const certId = `CERT-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

//         enrollment.certificateIssued = true;
//         enrollment.certificateId = certId;
//         enrollment.certificateIssuedDate = new Date();
//         await enrollment.save();

//         res.status(200).json({
//             status: 200,
//             success: true,
//             message: 'Certificate Claimed Successfully!',
//             data: enrollment
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message
//         });
//     }
// };

// My Attendance
// export const getMyAttendance = async (req, res) => {
//     try {
//         const enrollment = await Enrollment.findOne({
//             student: req.user.id,
//             course: req.params.courseId,
//             paymentStatus: { $in: ['completed', 'installment'] }
//         });

//         if (!enrollment) {
//             return res.status(401).json({
//                 status: 401,
//                 success: false,
//                 message: 'You are not enrolled in this course.'
//             });
//         }

//         res.status(200).json({
//             status: 200,
//             success: true,
//             data: enrollment.attendance || []
//         });
//     } catch (error) {
//         res.status(500).json({
//             status: 500,
//             success: false,
//             message: error.message
//         });
//     }
// };



// Is Enrolled
export const isEnrolled = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({
            student: req.user.id,
            course: req.params.courseId,
            paymentStatus: { $in: ['completed', 'installment'] }
        });
        res.status(200).json({
            status: 200,
            success: true,
            enrolled: !!enrollment,
            enrollment
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};




