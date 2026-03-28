import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Pages
import Home from '../pages/Home';
 import Login from '../pages/Login';
import Register from '../pages/Register';

// import CourseDetail from '../pages/CourseDetail';
 import Contact from '../pages/Contact';
// import Jobs from '../pages/Jobs';
// import Blog from '../pages/Blog';
// import BlogDetail from '../pages/BlogDetail';
// import Admission from '../pages/Admission';
// import PaymentSuccess from '../pages/PaymentSuccess';
// import PaymentFailure from '../pages/PaymentFailure';
 import Profile from '../pages/Profile';
import About from '../pages/About';

// Student Portal Pages
 
 import StudentCourseView from '../pages/students/StudentCourseView';
 import MyCourses from '../pages/students/MyCourses';
// import Assignments from '../pages/Assignments';
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
 import AdminDashboard from '../pages/Admin/AdminDashboard';
import Users from '../pages/Admin/Users';
import StudentDashboard from '../pages/students/StudentDashboard';
import CourseDetail from '../pages/courses/CourseDetail';
import Courses from '../pages/courses/Courses';
import ManageCourses from '../pages/Instrucutor/ManageCourses';
import InstructorDashboard from '../pages/Instrucutor/InstructorDashboard';
import InstructorAttendance from '../pages/Instrucutor/InstructorAttendance';
import InstructorAssignments from '../pages/Instrucutor/InstructorAssignments';

 //import AdminFinance from '../pages/AdminFinance';
// import JobsManagement from '../pages/JobsManagement';

// Protected Route
const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();
    if (loading) return (
        <div className="loading-container">
            <div className="spinner"></div>
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
            {/* 
            
            
            
            //routes for users

            
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogDetail />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/payment/success" element={<PaymentSuccess />} />
            <Route path="/payment/failure" element={<PaymentFailure />} />
             */}

            {/* Student Routes */}
            <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/my-courses" element={<ProtectedRoute allowedRoles={['student']}><MyCourses /></ProtectedRoute>} />
            <Route path="/student/course/:id" element={<ProtectedRoute allowedRoles={['student']}><StudentCourseView /></ProtectedRoute>} />
            {/* 
            
            <Route path="/student/assignments" element={<ProtectedRoute allowedRoles={['student']}><Assignments /></ProtectedRoute>} />
            <Route path="/student/certificates" element={<ProtectedRoute allowedRoles={['student']}><Certificates /></ProtectedRoute>} />
            <Route path="/student/finance" element={<ProtectedRoute allowedRoles={['student']}><StudentFinance /></ProtectedRoute>} />
             */}

            {/* Instructor Routes */}
            <Route path="/instructor/dashboard" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorDashboard /></ProtectedRoute>} />
            <Route path="/instructor/courses" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><ManageCourses /></ProtectedRoute>} />
            <Route path="/instructor/attendance" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorAttendance /></ProtectedRoute>} />
            <Route path="/instructor/assignments" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><InstructorAssignments /></ProtectedRoute>} />
            {/* 
            
            <Route path="/instructor/blogs" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><ManageBlogs /></ProtectedRoute>} />
            
            <Route path="/instructor/grade-assignments" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><GradeAssignments /></ProtectedRoute>} />
            
            <Route path="/instructor/resources" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><UploadResources /></ProtectedRoute>} />
            <Route path="/instructor/verify-completion" element={<ProtectedRoute allowedRoles={['instructor', 'admin']}><VerifyCompletion /></ProtectedRoute>} /> */}

            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><Users /></ProtectedRoute>} />
            {/* 
            
            <Route path="/admin/finance" element={<ProtectedRoute allowedRoles={['admin']}><AdminFinance /></ProtectedRoute>} />
            <Route path="/admin/jobs" element={<ProtectedRoute allowedRoles={['admin']}><JobsManagement /></ProtectedRoute>} /> */}

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default AppRouter;
