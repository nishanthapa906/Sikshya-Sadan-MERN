import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Home from '../pages/Home';
 import Login from '../pages/Login';
import Register from '../pages/Register';
 import Contact from '../pages/Contact';


 import Profile from '../pages/Profile';
import About from '../pages/About';

// Student Portal Pages
 
 import StudentCourseView from '../pages/students/StudentCourseView';
 import MyCourses from '../pages/students/MyCourses';

// import Certificates from '../pages/Certificates';
// import StudentFinance from '../pages/StudentFinance';

// Instructor Portal Pages
// import InstructorDashboard from '../pages/InstructorDashboard';
// import ManageCourses from '../pages/ManageCourses';
// import ManageBlogs from '../pages/ManageBlogs';
// import InstructorAssignments from '../pages/InstructorAssignments';
// import GradeAssignments from '../pages/GradeAssignments';
// import InstructorAttendance from '../pages/InstructorAttendance';
// import UploadResources from '../pages/UploadResources';
// import VerifyCompletion from '../pages/VerifyCompletion';

// Admin Portal Pages
 import AdminDashboard from '../pages/admin/AdminDashboard';
import Users from '../pages/admin/Users';
import StudentDashboard from '../pages/students/StudentDashboard';
import CourseDetail from '../pages/courses/CourseDetail';
import Courses from '../pages/courses/Courses';
import ManageCourses from '../pages/Instrucutor/ManageCourses';
import InstructorDashboard from '../pages/Instrucutor/InstructorDashboard';
import InstructorAttendance from '../pages/Instrucutor/InstructorAttendance';
import InstructorAssignments from '../pages/Instrucutor/InstructorAssignments';

 import AdminFinance from '../pages/admin/AdminFinance';
import Admission from '../pages/admin/Admission';
import Assignments from '../pages/students/Assignments';
import PaymentSuccess from '../pages/PaymentSuccess';
import PaymentFailure from '../pages/PaymentFailure';
import UploadResources from '../pages/Instrucutor/UploadResources';
import Blog from '../pages/blog/Blog';
import BlogDetail from '../pages/blog/BlogDetails';
import Certificates from '../pages/students/Certificate';
import GradeAssignments from '../pages/students/GradeAssignments';
import ManageBlogs from '../pages/blog/ManageBlogs';
import JobsManagement from '../pages/jobs/JobsManagement';
import Jobs from '../pages/jobs/Jobs';
import VerifyCompletion from '../pages/Instrucutor/VerifyCompletion';
import TestimonialsManagement from '../pages/admin/TestimonialsManagement';
// import JobsManagement from '../pages/JobsManagement';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        </div>
    );
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
    return children;
};

function AppRouter() {
    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']}><Profile /></ProtectedRoute>} />
            
            
            <Route path="/courses" element={<Courses />} />
            <Route path="/courses/:id" element={<CourseDetail />} />

            <Route path="/admission" element={<Admission />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
             <Route path="/jobs" element={<Jobs />} />
            
            {/* 
            
            
            
            //routes for users

            
           
            
            
             */}

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/my-courses" element={<ProtectedRoute allowedRoles={['student']}><MyCourses /></ProtectedRoute>} />
            <Route path="/student/course/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentCourseView /></ProtectedRoute>} />
             <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><Assignments /></ProtectedRoute>} />
             <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['student']}><Certificates /></ProtectedRoute>} />
            {/* 
            
           
            
            <Route path="/student/finance" element={<ProtectedRoute allowedRoles={['student']}><StudentFinance /></ProtectedRoute>} />
             */}

            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>} />
            <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><ManageCourses /></ProtectedRoute>} />
            <Route path="/instructor/attendance" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorAttendance /></ProtectedRoute>} />
            <Route path="/instructor/assignments" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorAssignments /></ProtectedRoute>} />
            <Route path="/instructor/resources" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><UploadResources /></ProtectedRoute>} />
            <Route path="/instructor/grade-assignments" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><GradeAssignments /></ProtectedRoute>} />
            <Route path="/instructor/blogs" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><ManageBlogs /></ProtectedRoute>} />
             <Route path="/instructor/verify-completion" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><VerifyCompletion /></ProtectedRoute>} />
            {/* 
            
            
            
            
            
            
            */}

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
            <Route path="/admin/finance" element={<ProtectedRoute allowedRoles={['admin']}><AdminFinance /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><JobsManagement /></ProtectedRoute>} /> 
            <Route path="/admin/testimonials" element={<ProtectedRoute allowedRoles={['admin']}><TestimonialsManagement /></ProtectedRoute>} /> 
            {/* 
            
            
            */}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRouter;
