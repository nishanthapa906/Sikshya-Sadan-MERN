

//get Courses 

import Course from "../models/courseModel.js";

const normalizeCoursePayload = (body) => {
    if (typeof body.syllabus === 'string') {
        try { body.syllabus = JSON.parse(body.syllabus); } catch (e) { }
    }

    if (typeof body.prerequisites === 'string') {
        try {
            body.prerequisites = JSON.parse(body.prerequisites);
        } catch (e) {
            body.prerequisites = body.prerequisites
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean);
        }
    }

    if (typeof body.installmentPlans === 'string') {
        try { body.installmentPlans = JSON.parse(body.installmentPlans); } catch (e) { }
    }

    if (body.installmentAvailable === 'true') body.installmentAvailable = true;
    if (body.installmentAvailable === 'false') body.installmentAvailable = false;

    if (typeof body.startDate === 'string' && body.startDate) {
        const date = new Date(body.startDate);
        if (!Number.isNaN(date.getTime())) {
            body.startDate = date;
        }
    }
};

export const getAllCourses = async (req, res) =>{
    try{
        const {search, category , skillLevel,sort, limit } = req.query ;
        let query  = {isActive: true};

        if (category) query.category = category;
        if (skillLevel) query.skillLevel = skillLevel;
        if ( search) query.title = {$regex: search, $options: 'i'};

        let coursesQuery = Course.find(query).populate('instructor', 'name avatar');
       // sorting 
       if ( sort === 'price-low') coursesQuery  = coursesQuery.sort('fee');
       if ( sort === 'price-high') coursesQuery  = coursesQuery.sort('-fee');
       if ( sort === 'rating') coursesQuery = coursesQuery.sort('-rating');
        else coursesQuery=  coursesQuery.sort('-createdAt');

        if (limit ) coursesQuery = coursesQuery.limit(parseInt(limit));

        const [courses, categories] = await Promise.all ([
            coursesQuery, 
            Course.distinct('category', {isActive: true})

        ]);

        res.status(200).json({
            status: 200, 
            success: true, 
            count: courses.length, 
            courses, 
            categories
        });
    }  catch (error) {
        res.status(500).json({
            status: 500, 
            success: false, 
            message: error.message
        });
    }
};

//Get single Courses

export const getCourseById = async (req, res) =>{
    try{
        const course = await Course.findById(req.params.id)
        .populate('instructor', 'name avatar bio expertise')
        .populate('reviews.student', 'name avatar');

        if(!course) return res.status(404).json({
            status: 404, 
            success: false, 
            message: 'Course not found!'
        });

        res.status(200).json 
        ({
            status: 200, 
            success: true, 
            course
        });
    }  catch (error){
        res.status(500).json ({
            status: 500, 
            success: false, 
            message: error.message
        });
    }
};


//Create Course
export const  createCourse = async (req, res) => {
    try{
        req.body.instructor = req.user.id;
        normalizeCoursePayload(req.body);

        if (req.files) {
            if (req.files.thumbnail) req.body.thumbnail = req.files.thumbnail[0].filename;
            if (req.files.syllabusFile) req.body.syllabusFile = req.files.syllabusFile[0].filename;
        }
        const course = await Course.create(req.body);
        res.status(201).json({
            status: 201, 
            success: true, 
            message: 'Course Created Successfully',
            course
        });
    } catch (error) {
        res.status(500).json({
            status:500, 
            success: false, 
            message: error.message
        });
    }
};

//update Course

export const updateCourse = async (req, res)=>{
     try {
        normalizeCoursePayload(req.body);

        if (req.files) {
            if (req.files.thumbnail) req.body.thumbnail = req.files.thumbnail[0].filename;
            if (req.files.syllabusFile) req.body.syllabusFile = req.files.syllabusFile[0].filename;
        }

        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
         res.status(200).json({
            status: 200, 
            success: true, 
            message: 'Course updated Successfully!',
            course
         })
}  catch (error) {
    res.status(500).json({
        status: 500, 
        success: false, 
        message: error.message
    });
}
};

//Delete Course

export const deleteCourse = async(req, res)=>{
    try{
        await Course.findByIdAndDelete(req.params.id);
        res.status(200).json ({
            status: 200, 
            success: true, 
            message: 'Course Deleted Successfully'
        });
    } catch ( error) {
        res.status(500).json ({
            status: 500, 
            success: false, 
            message: error.message
        });

    }
};


//ADd REveiew
export const addReview = async (req, res) =>{
    try{
        const course = await Course.findById(req.params.id);
        const { rating, comment} = req.body;
        course.reviews.push({student: req.user.id, rating, comment});

        //mannual Calculation 
        const sum = course.reviews.reduce((acc, review) => acc + review.rating, 0);
        course.rating = (sum / course.reviews.length).toFixed(1);
        await course.save();

        res.status(200).json({
            status: 200, 
            success: true, 
            message: 'Review Added Successfully!', 
            course
        });
    } catch (error){
        res.status(500).json({
            status:500, 
            success: false, 
            message: error.message
        });
    }
};

//Instructor's Courses

export const getInstructorCourses = async (req, res) =>{
    try{
        const courses = await Course.find({instructor: req.user.id});
        res.status(200).json({
            status: 200, 
            success:true, 
             courses
        });
    }  catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: error.message
        });
}
}
