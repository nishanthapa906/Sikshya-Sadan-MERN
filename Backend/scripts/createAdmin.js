import mongoose from 'mongoose';
import User from '../src/models/userModel.js';
import { MONGODB_URI } from '../src/utils/constants.js';

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB Connected successfully');

        const adminDetails = {
            name: 'Super Admin',
            email: 'admin@sikshyasadan.com',
            password: 'adminpassword123',
            phone: '9800000000',
            role: 'admin',
            isActive: true
        };

        // Check if admin exists
        const adminExists = await User.findOne({ email: adminDetails.email });

        if (adminExists) {
            console.log('Admin user already exists');
            process.exit();
        }

        // Create admin
        await User.create(adminDetails);
        console.log('Admin user created successfully');
        console.log('Email: admin@sikshyasadan.com');
        console.log('Password: adminpassword123');

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
