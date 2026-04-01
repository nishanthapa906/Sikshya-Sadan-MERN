import Course from "../models/courseModel.js";

const normalize = (body) => {
    if (typeof body.syllabus === 'string') try { body.syllabus = JSON.parse(body.syllabus); } catch (e) {}
    if (typeof body.prerequisites === 'string') try { body.prerequisites = JSON.parse(body.prerequisites); } catch { body.prerequisites = body.prerequisites.split(',').map(s => s.trim()).filter(Boolean); }
    if (typeof body.installmentPlans === 'string') try { body.installmentPlans = JSON.parse(body.installmentPlans); } catch (e) {}
    if (body.installmentAvailable === 'true') body.installmentAvailable = true;
    if (body.installmentAvailable === 'false') body.installmentAvailable = false;
    if (typeof body.startDate === 'string' && body.startDate) { const d = new Date(body.startDate); if (!isNaN(d)) body.startDate = d; }
};

export const getAllCourses = async (req, res) => {
    try {
        const { search, category, skillLevel, sort, limit } = req.query;
        const query = { isActive: true };
        if (category) query.category = category;
        if (skillLevel) query.skillLevel = skillLevel;
        if (search) query.title = { $regex: search, $options: 'i' };
        let q = Course.find(query).populate('instructor', 'name avatar');
        if (sort === 'price-low') q = q.sort('fee');
        else if (sort === 'price-high') q = q.sort('-fee');
        else if (sort === 'rating') q = q.sort('-rating');
        else q = q.sort('-createdAt');
        if (limit) q = q.limit(parseInt(limit));
        const [courses, categories] = await Promise.all([q, Course.distinct('category', { isActive: true })]);
        res.json({ success: true, courses, categories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor', 'name avatar bio expertise').populate('reviews.student', 'name avatar');
        if (!course) return res.status(404).json({ success: false, message: 'Course not found' });
        res.json({ success: true, course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const createCourse = async (req, res) => {
    try {
        req.body.instructor = req.user.id;
        normalize(req.body);
        if (req.files?.thumbnail) req.body.thumbnail = req.files.thumbnail[0].filename;
        if (req.files?.syllabusFile) req.body.syllabusFile = req.files.syllabusFile[0].filename;
        const course = await Course.create(req.body);
        res.status(201).json({ success: true, course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateCourse = async (req, res) => {
    try {
        normalize(req.body);
        if (req.files?.thumbnail) req.body.thumbnail = req.files.thumbnail[0].filename;
        if (req.files?.syllabusFile) req.body.syllabusFile = req.files.syllabusFile[0].filename;
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json({ success: true, course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const deleteCourse = async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'Course deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const addReview = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        const { rating, comment } = req.body;
        course.reviews.push({ student: req.user.id, rating, comment });
        const sum = course.reviews.reduce((acc, r) => acc + r.rating, 0);
        course.rating = (sum / course.reviews.length).toFixed(1);
        await course.save();
        res.json({ success: true, course });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const getInstructorCourses = async (req, res) => {
    try {
        const courses = await Course.find({ instructor: req.user.id });
        res.json({ success: true, courses });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
