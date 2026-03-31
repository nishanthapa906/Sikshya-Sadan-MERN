import axios from 'axios';

// Base URL - change this to your backend URL
export const BASE_URL = 'http://localhost:9000/api';
export const UPLOAD_URL = 'http://localhost:9000/uploads';

const api = axios.create({
    baseURL: BASE_URL
});

// Add token to requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => {
        // Automatically check the standardized status field if it exists
        if (response.data && response.data.status && response.data.status >= 400) {
            return Promise.reject({ response });
        }
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API calls
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getMe: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/update-profile', data)
};

// Course API calls
export const courseAPI = {
    getAllCourses: (params) => api.get('/courses', { params }),
    getCourseById: (id) => api.get(`/courses/${id}`),
    createCourse: (data) => api.post('/courses', data),
    updateCourse: (id, data) => api.put(`/courses/${id}`, data),
    deleteCourse: (id) => api.delete(`/courses/${id}`),
    addReview: (id, data) => api.post(`/courses/${id}/review`, data),
    getInstructorCourses: () => api.get('/courses/instructor/my-courses')
};

// Student API calls
export const studentAPI = {
    getDashboard: () => api.get('/student/dashboard'),
    getMyCourses: () => api.get('/student/my-courses'),
    getMyAssignments: () => api.get('/assignments/student/assignments'),
    submitAssignment: (assignmentId, data) => api.post(`/assignments/student/assignments/${assignmentId}/submit`, data),
    getMyCertificates: () => api.get('/assignments/student/certificates'),
    claimCertificate: (courseId) => api.post(`/assignments/student/${courseId}/claim-certificate`),
    isEnrolled: (courseId) => api.get(`/student/is-enrolled/${courseId}`),
    getEnrollmentDetails: (id) => api.get(`/enrollments/${id}`),
    updateProgress: (id, progress) => api.put(`/enrollments/${id}/progress`, { progress })
};

// Instructor API calls
export const instructorAPI = {
    getDashboard: () => api.get('/instructor/dashboard'),
    getMyStudents: (courseId) => api.get(`/instructor/students${courseId ? `/${courseId}` : ''}`),
    getMyCourses: () => api.get('/instructor/courses'),
    createAssignment: (courseId, data) => api.post(`/assignments/instructor/courses/${courseId}/assignments`, data),
    getCourseAssignments: (courseId) => api.get(`/assignments/instructor/courses/${courseId}/assignments`),
    getAssignmentSubmissions: (assignmentId) => api.get(`/assignments/instructor/assignments/${assignmentId}/submissions`),
    gradeSubmission: (submissionId, data) => api.put(`/assignments/instructor/submissions/${submissionId}/grade`, data),
    uploadResource: (courseId, data) => api.post(`/instructor/courses/${courseId}/resources`, data),
    getCourseResources: (courseId) => api.get(`/instructor/courses/${courseId}/resources`),
    deleteResource: (resourceId) => api.delete(`/instructor/resources/${resourceId}`),
    updateEnrollment: (enrollmentId, data) => api.put(`/instructor/enrollments/${enrollmentId}`, data),
    markAttendance: (enrollmentId, data) => api.post(`/instructor/enrollments/${enrollmentId}/attendance`, data)
};

// Admin API calls
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllUsers: (params) => api.get('/admin/users', { params }),
    updateUserStatus: (id, isActive) => api.put(`/admin/users/${id}/status`, { isActive }),
    getFinancialReports: () => api.get('/admin/financial-reports'),
    createUser: (data) => api.post('/admin/users', data),
    updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    updateEnrollmentStatus: (id, paymentStatus) => api.put(`/admin/enrollments/${id}/status`, { paymentStatus })
};

// Enrollment API calls
export const enrollmentAPI = {
    create: (data) => api.post('/enrollments', data),
    getMyEnrollments: () => api.get('/enrollments/my-enrollments'),
    getEnrollmentDetails: (id) => api.get(`/enrollments/${id}`)
};

// Payment API calls
export const paymentAPI = {
    initiateEsewa: (courseId) => api.post('/payment/esewa/initiate', { courseId }),
    verifyEsewa: (params) => api.get(`/payment/esewa/verify?${new URLSearchParams(params).toString()}`),
    initiateKhalti: (courseId) => api.post('/payment/khalti/initiate', { courseId }),
    verifyKhalti: (data) => api.post('/payment/khalti/verify', data),
    createStripeSession: (courseId) => api.post('/payment/stripe/create-session', { courseId }),
    verifyStripe: (data) => api.post('/payment/stripe/verify', data),
    getPaymentStatus: (enrollmentId) => api.get(`/payment/status/${enrollmentId}`)
};

// Demo Slots API calls
export const demoSlotAPI = {
    getAvailableSlots: (courseId) => api.get(`/demo-slots/${courseId}`),
    getSlotsByCourseId: (courseId) => api.get(`/demo-slots/${courseId}`),
    bookSlot: (slotId) => api.post('/demo-slots/book', { slotId })
};

// Blog API calls
export const blogAPI = {
    getAllBlogs: (params) => api.get('/blogs', { params }),
    getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
    getBlogMeta: () => api.get('/blogs/meta'),
    getMyBlogs: () => api.get('/blogs/my-blogs'),
    createBlog: (data) => api.post('/blogs', data),
    updateBlog: (id, data) => api.put(`/blogs/${id}`, data),
    deleteBlog: (id) => api.delete(`/blogs/${id}`)
};

// Contact API calls
export const contactAPI = {
    sendMessage: (data) => api.post('/contact', data),
    getMessages: () => api.get('/contact'),
    getMessageById: (id) => api.get(`/contact/${id}`),
    markAsRead: (id) => api.put(`/contact/${id}/read`),
    deleteMessage: (id) => api.delete(`/contact/${id}`)
};

// Banner API calls
export const bannerAPI = {
    getBanners: () => api.get('/banners'),
    createBanner: (data) => api.post('/banners', data),
    deleteBanner: (id) => api.delete(`/banners/${id}`)
};

// Stats API calls
export const statsAPI = {
    getStats: () => api.get('/stats')
};

// Public API calls (no auth required)
export const publicAPI = {
    getJobs: (params) => api.get('/public/jobs', { params }),
    getAllBlogs: (params) => api.get('/blogs', { params }),
    getBlogBySlug: (slug) => api.get(`/blogs/${slug}`),
    getBlogMeta: () => api.get('/blogs/meta'),
    getAlumni: () => api.get('/public/alumni'),
    getTestimonials: () => api.get('/public/testimonials'),
    getSettings: () => api.get('/public/settings'),
    getInstructors: () => api.get('/public/instructors')
};

// Job Admin API calls
export const jobAPI = {
    getAll: (params) => api.get('/public/jobs', { params }),
    create: (data) => api.post('/public/jobs', data),
    update: (id, data) => api.put(`/public/jobs/${id}`, data),
    delete: (id) => api.delete(`/public/jobs/${id}`)
};

export default api;
