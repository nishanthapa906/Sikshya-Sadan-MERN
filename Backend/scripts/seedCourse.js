import mongoose from 'mongoose';
import Course from '../src/models/courseModel.js';
import User from '../src/models/userModel.js';
import { MONGODB_URI } from '../src/utils/constants.js';

const seedCourses = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected');

        // Ensure we have an instructor
        let instructor = await User.findOne({ role: 'instructor' });
        if (!instructor) {
            instructor = await User.create({
                name: 'Default Instructor',
                email: 'instructor@sikshyasadan.com',
                password: 'password123',
                phone: '9800000000',
                role: 'instructor'
            });
            console.log('Created default instructor');
        }

        const courses = [
            {
                title: 'Full Stack MERN Development',
                description: 'Master MongoDB, Express, React, and Node.js in this comprehensive course.',
                category: 'Web Development',
                skillLevel: 'Intermediate',
                duration: 120, // 12 weeks * 10 hours approx
                fee: 15000,
                instructor: instructor._id,
                thumbnail: 'mern-stack.jpg',
                syllabus: [
                    { week: 1, topic: 'Introduction to Web & React', description: 'Basics of web development and React intro' },
                    { week: 2, topic: 'React Hooks & State Management', description: 'Mastering hooks and redux' },
                    { week: 3, topic: 'Node.js & Express Basics', description: 'Building backend APIs' },
                    { week: 4, topic: 'MongoDB & Mongoose', description: 'Database management' }
                ],
                isActive: true,
                startDate: new Date()
            },
            {
                title: 'Data Science with Python',
                description: 'Learn data analysis, visualization, and machine learning using Python.',
                category: 'Data Science',
                skillLevel: 'Beginner',
                duration: 100,
                fee: 20000,
                instructor: instructor._id,
                thumbnail: 'data-science.jpg',
                syllabus: [
                    { week: 1, topic: 'Python Basics', description: 'Intro to Python syntax' },
                    { week: 2, topic: 'NumPy & Pandas', description: 'Data manipulation' },
                    { week: 3, topic: 'Matplotlib & Seaborn', description: 'Data visualization' }
                ],
                isActive: true,
                startDate: new Date()
            }
        ];

        await Course.deleteMany({}); // Clear existing courses
        await Course.insertMany(courses);
        console.log('Courses seeded successfully');

        process.exit();
    } catch (error) {
        console.error('Error seeding courses:', error);
        process.exit(1);
    }
};

seedCourses();
