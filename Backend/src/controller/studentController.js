import Enrollment from '../models/enrollmentModel.js';
import Assignment from '../models/assignmentModel.js';

//get student dashboard data
export const getDashboard = async (req, res) =>{
    try  {
        const enrollments = await Enrollment.find({
            student: req.user.id,
            paymetStatus: {$in: ['completed', 'installment']}

        })

        .populate('course', 'title thumbnail instructor duration')
            .populate('course.instructor', 'name');

            const totalCourses = enrollments.length;
            const activeCourses = enrollments.filter(e => e.status === 'active').length;
            const completeCourses = enrollments.filter(e => e.status ==='completed').length;


            //Get peding assingments
           const enrolledCourseIds = enrollments.map(e => e.course._id);
           const assingments = await Assignment.find({
            course: {$in: enrolledCourseIds}
           });


           const pendingAssignments = assingments.filter(assingment =>{
            const submission = assingment.submission.find(
                s=> s.student.toString() === req.user.id
            );

            return !submission && new Date(assingment.dueDate) > new Date();
           });

           res.status(200).json({
            success: true,
            data: {
                totalCourses,
                activeCourses,
                completeCourses,
                pendingAssignments: pendingAssignments.length,
                enrollments
            }
           });

        } catch (error) {
            res.status(500).json({
                success:false,
                message: 'Failed to fetch dashboard data',
                error: error.message
            });
        }

    }

export const getMyCourses = async (req, res) => {
    // TODO: implementation
}

export const getMyAssignments = async (req, res) => {
    // TODO: implementation
}

export const submitAssignment = async (req, res) => {
    // TODO: implementation
}

export const getMyCertificates = async (req, res) => {
    // TODO: implementation
}

export const getMyAttendance = async (req, res) => {
    // TODO: implementation
}

export const claimCertificate = async (req, res) => {
    // TODO: implementation
}
