const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Notice = require('./src/models/Notice');
const connectDB = require('./src/config/db');

dotenv.config();

const seedData = async () => {
    try {
        await connectDB();

        // Clear existing data
        await User.deleteMany();
        await Notice.deleteMany();

        console.log('Data Cleared...');

        // Create Admin User
        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@noticehub.com',
            password: 'password123',
            role: 'ADMIN'
        });

        console.log('Admin User Created...');

        // Dummy Notices
        const notices = [
            {
                title: 'Orientation Program 2026',
                description: 'Mandatory orientation for all first-year students in the main auditorium.',
                category: 'Academic',
                postedDate: new Date(),
                createdBy: admin._id,
                isPinned: true
            },
            {
                title: 'Placement Training - TCS',
                description: 'TCS Inframind training sessions starting next Monday. Register via the link.',
                category: 'Placements',
                eventLink: 'https://tcs.com/register',
                postedDate: new Date(),
                createdBy: admin._id
            },
            {
                title: 'Semester Exam Schedule',
                description: 'The final semester exam schedule is now available for download.',
                category: 'Exams',
                postedDate: new Date(),
                createdBy: admin._id
            },
            {
                title: 'Annual Cultural Fest - Revels',
                description: 'Participate in the biggest cultural event of the year. Registrations open now!',
                category: 'Events',
                eventLink: 'https://revels.college.edu',
                postedDate: new Date(),
                createdBy: admin._id
            }
        ];

        await Notice.insertMany(notices);
        console.log('Dummy Notices Seeded...');

        console.log('Seeding Complete!');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

seedData();
