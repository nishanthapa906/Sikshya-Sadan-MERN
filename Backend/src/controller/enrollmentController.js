import Course from "../models/courseModel.js";
import Enrollment from "../models/enrollmentModel.js";



//create Enrollment 
export const createEnrollement = async(req, res) =>{
    const { courseId, paymentMethod, transactionId}  = req.body;

    try {
        const course = await Course.findById(courseId);
        if(!course) {
            return res.status(404).json({
                status: 404, 
                success: false,
                message: 'Course not found!'
            });
        }
        const enrollment = await Enrollment.create({
            student: req.user.id, 
            course: courseId, 
            totalAmount: course.fee,
            paidAmount: course.fee,
            paymentMethod: paymentMethod || 'manual',
            paymentStatus: 'completed',
            transactionId: transactionId || `TXN-${Date.now()}`
        });

         res.status(201).json({
            status: 201,
            success: true,
            message: 'Enrolled successfully!',
            enrollment
        });

    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: 'Internal Server Error!',
            error: error.message
        });
    }
};


//Get my Enrollments 

export const getMyEnrollments = async(req, res)=>{
    try {
        const enrollments = await Enrollment.find({student: req.user.id}).populate('course');
        res.status(200).json({
           status: 200,
            success: true,
            count: enrollments.length,
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

//GEt details
export const getEnrollmentDetails = async (req, res) => {
    try {
        const enrollment = await Enrollment.findById(req.params.enrollmentId).populate('course').populate('student', 'name email');
        res.status(200).json({
            status: 200,
            success: true,
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

// Update Progress
export const updateProgress = async (req, res) => {
    try {
        const enrollment = await Enrollment.findByIdAndUpdate(req.params.enrollmentId, { progress: req.body.progress }, { new: true });
        res.status(200).json({
            status: 200,
            success: true,
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
// Is Enrolled
export const isEnrolled = async (req, res) => {
    try {
        const enrollment = await Enrollment.findOne({ student: req.user.id, course: req.params.courseId });
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



