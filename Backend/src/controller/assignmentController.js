import Assignment from '../models/assignmentModel.js';
import Submission from '../models/submissionModel.js';
import Certificate from '../models/certificateModel.js';
import Enrollment from '../models/enrollmentModel.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';

// STUDENT FUNCTIONS

// Get student's assignments
export const getMyAssignments = async (req, res) => {
    try {
        const studentId = req.user.id;

        // Get all enrolled courses
        const enrollments = await Enrollment.find({
            student: studentId,
            paymentStatus: { $in: ['completed', 'installment'] }
        });

        const courseIds = enrollments.map(e => e.course);

        // Get all assignments for enrolled courses
        const assignments = await Assignment.find({
            course: { $in: courseIds },
            isActive: true
        })
            .populate('course', 'title category')
            .populate('instructor', 'name')
            .sort({ dueDate: 1 });

        // Get all submissions for this student
        const submissions = await Submission.find({
            student: studentId
        });

        // Combine assignment with submission data
        const data = assignments.map(assignment => {
            const submission = submissions.find(
                s => s.assignment.toString() === assignment._id.toString()
            );

            return {
                ...assignment.toObject(),
                submission: submission || null
            };
        });

        res.status(200).json({
            status: 200,
            success: true,
            count: data.length,
            data: data
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Submit assignment
export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const studentId = req.user.id;
        const { submissionText } = req.body;

        // Validate assignment exists
        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Assignment not found!'
            });
        }

        // Check if student is enrolled in the course
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: assignment.course,
            paymentStatus: { $in: ['completed', 'installment'] }
        });

        if (!enrollment) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'You are not enrolled in this course!'
            });
        }

        // Check for existing submission
        let submission = await Submission.findOne({
            assignment: assignmentId,
            student: studentId
        });

        const submittedAt = new Date();
        const isLate = submittedAt > assignment.dueDate;

        // Create or update submission
        if (submission) {
            submission.submissionText = submissionText || submission.submissionText;
            if (req.file) {
                submission.submissionFile = {
                    filename: req.file.filename,
                    url: `/uploads/${req.file.filename}`,
                    uploadedAt: new Date()
                };
            }
            submission.submittedAt = submittedAt;
            submission.isLate = isLate;
            submission.status = 'submitted';
        } else {
            submission = new Submission({
                assignment: assignmentId,
                student: studentId,
                course: assignment.course,
                submissionText: submissionText || '',
                submissionFile: req.file ? {
                    filename: req.file.filename,
                    url: `/uploads/${req.file.filename}`,
                    uploadedAt: new Date()
                } : null,
                submittedAt,
                isLate,
                status: 'submitted'
            });
        }

        await submission.save();

        // Update assignment total submissions
        assignment.totalSubmissions = await Submission.countDocuments({
            assignment: assignmentId
        });
        await assignment.save();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Assignment submitted successfully!',
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Get my certificates
export const getMyCertificates = async (req, res) => {
    try {
        const studentId = req.user.id;

        const certificates = await Certificate.find({
            student: studentId
        })
            .populate('student', 'name email avatar')
            .populate('course', 'title category instructor')
            .sort({ issuedDate: -1 });

        const stats = {
            total: certificates.length,
            claimed: certificates.filter(c => c.claimStatus === 'claimed').length,
            pending: certificates.filter(c => c.claimStatus === 'not-claimed').length,
            available: certificates.filter(c => c.status === 'available').length
        };

        res.status(200).json({
            status: 200,
            success: true,
            stats,
            data: certificates
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Claim certificate
export const claimCertificate = async (req, res) => {
    try {
        const studentId = req.user.id;
        const { courseId } = req.params;

        // Find enrollment
        const enrollment = await Enrollment.findOne({
            student: studentId,
            course: courseId,
            status: 'completed'
        })
            .populate('course', 'title')
            .populate('student', 'name');

        if (!enrollment) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'You have not completed this course yet!'
            });
        }

        if (enrollment.paymentStatus !== 'completed' && enrollment.paymentStatus !== 'installment') {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Your payment must be completed to claim a certificate.'
            });
        }

        // Check if certificate already exists
        let certificate = await Certificate.findOne({
            student: studentId,
            course: courseId
        });

        if (certificate) {
            if (certificate.claimStatus === 'claimed') {
                return res.status(400).json({
                    status: 400,
                    success: false,
                    message: 'Certificate already claimed. Please visit office to grab it.'
                });
            }
            // Update claim status
            certificate.claimStatus = 'pending-claim';
            certificate.claimDate = new Date();
        } else {
            // Create new certificate
            const course = await Course.findById(courseId).populate('instructor', 'name');

            // Calculate final grade from submissions
            const submissions = await Submission.find({
                student: studentId,
                course: courseId
            });

            const gradedSubmissions = submissions.filter(s => s.grade !== null && s.grade !== undefined);
            let finalGrade = 0;
            if (gradedSubmissions.length > 0) {
                finalGrade = Math.round(
                    gradedSubmissions.reduce((sum, s) => sum + s.grade, 0) / gradedSubmissions.length
                );
            }

            certificate = new Certificate({
                student: studentId,
                course: courseId,
                completionDate: new Date(),
                issuedDate: new Date(),
                status: 'available',
                claimStatus: 'pending-claim',
                claimDate: new Date(),
                finalGrade,
                totalScore: finalGrade,
                submissionDetails: {
                    totalAssignments: submissions.length,
                    completedAssignments: submissions.length,
                    assignmentScores: gradedSubmissions.map(s => s.grade)
                },
                courseDetails: {
                    duration: course?.duration || 'Self-paced',
                    instructor: course?.instructor?.name || 'Instructor'
                }
            });
        }

        await certificate.save();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Certificate claim request submitted. Visit office to grab your physical certificate.',
            data: certificate
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// INSTRUCTOR FUNCTIONS

// Create assignment
export const createAssignment = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;
        const { title, description, dueDate, maxMarks, instructions } = req.body;

        // Validate course exists and belongs to instructor
        const course = await Course.findOne({
            _id: courseId,
            instructor: instructorId
        });

        if (!course) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'You do not have permission to add assignment to this course!'
            });
        }

        // Validate date
        if (new Date(dueDate) <= new Date()) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Due date must be in the future!'
            });
        }

        const assignment = new Assignment({
            course: courseId,
            instructor: instructorId,
            title,
            description,
            dueDate,
            maxMarks: maxMarks || 100,
            instructions: instructions || ''
        });

        // Handle file attachments
        if (req.files && req.files.length > 0) {
            assignment.attachments = req.files.map(file => ({
                filename: file.filename,
                url: `/uploads/${file.filename}`,
                uploadedAt: new Date()
            }));
        }

        await assignment.save();
        await assignment.populate('course', 'title');
        await assignment.populate('instructor', 'name email');

        res.status(201).json({
            status: 201,
            success: true,
            message: 'Assignment created successfully!',
            data: assignment
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Get course assignments
export const getCourseAssignments = async (req, res) => {
    try {
        const { courseId } = req.params;
        const instructorId = req.user.id;

        // Verify instructor owns the course
        const course = await Course.findOne({
            _id: courseId,
            instructor: instructorId
        });

        if (!course) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'You do not have permission to view this course\'s assignments!'
            });
        }

        const assignments = await Assignment.find({
            course: courseId
        })
            .populate('instructor', 'name')
            .sort({ dueDate: -1 });

        // Add submission counts
        const assignmentsWithStats = await Promise.all(
            assignments.map(async (assignment) => {
                const total = await Submission.countDocuments({ assignment: assignment._id });
                const graded = await Submission.countDocuments({
                    assignment: assignment._id,
                    status: 'graded'
                });

                return {
                    ...assignment.toObject(),
                    stats: {
                        totalSubmissions: total,
                        gradedSubmissions: graded,
                        pendingSubmissions: total - graded
                    }
                };
            })
        );

        res.status(200).json({
            status: 200,
            success: true,
            count: assignmentsWithStats.length,
            data: assignmentsWithStats
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Get assignment submissions
export const getAssignmentSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;

        const assignment = await Assignment.findById(assignmentId).populate('instructor');

        if (!assignment) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Assignment not found!'
            });
        }

        // Verify instructor owns the assignment
        if (assignment.instructor._id.toString() !== req.user.id) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'You do not have permission to view these submissions!'
            });
        }

        const submissions = await Submission.find({
            assignment: assignmentId
        })
            .populate('student', 'name email avatar')
            .sort({ submittedAt: -1 });

        res.status(200).json({
            status: 200,
            success: true,
            count: submissions.length,
            data: submissions
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};

// Grade submission
export const gradeSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;
        const { grade, feedback } = req.body;

        // Validate grade
        if (grade < 0 || grade > 100) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: 'Grade must be between 0 and 100!'
            });
        }

        const submission = await Submission.findById(submissionId)
            .populate('assignment')
            .populate('student', 'name email');

        if (!submission) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: 'Submission not found!'
            });
        }

        // Verify instructor owns the assignment
        if (submission.assignment.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                status: 403,
                success: false,
                message: 'You do not have permission to grade this submission!'
            });
        }

        // Update submission
        submission.grade = grade;
        submission.feedback = feedback || '';
        submission.status = 'graded';
        submission.gradedAt = new Date();
        submission.gradedBy = req.user.id;

        await submission.save();

        res.status(200).json({
            status: 200,
            success: true,
            message: 'Submission graded successfully!',
            data: submission
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
    }
};
