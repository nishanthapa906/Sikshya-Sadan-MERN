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

        // Remove old admin if exists to ensure password hashing works
        await User.findOneAndDelete({ email: adminDetails.email });

        // Hash the password properly
        const bcrypt = await import('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminDetails.password, salt);
        
        adminDetails.password = hashedPassword;

        // Create admin
        await User.create(adminDetails);
        console.log('Admin user created successfully ');
        console.log('Email: admin@sikshyasadan.com');
        console.log('Password: adminpassword123');

        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
