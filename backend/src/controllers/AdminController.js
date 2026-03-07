const User = require('../models/User');
const Notice = require('../models/Notice');
const DriveRegistration = require('../models/DriveRegistration');

/**
 * createAdmin - Allows an existing ADMIN to create a new ADMIN account
 */
const createAdmin = async (req, res, next) => {
    try {
        const { name, email, password, department } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const user = await User.create({
            name,
            email,
            password,
            role: 'ADMIN',
            department: department || 'Administration',
            year: '0'
        });

        res.status(201).json({
            success: true,
            message: 'Admin account created successfully',
            data: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * getDashboardStats - Aggregates system-wide metrics for the Admin Dashboard
 */
const getDashboardStats = async (req, res, next) => {
    try {
        const [totalNotices, totalUsers, totalRegistrations] = await Promise.all([
            Notice.countDocuments(),
            User.countDocuments({ role: 'STUDENT' }),
            DriveRegistration.countDocuments()
        ]);

        res.status(200).json({
            success: true,
            message: 'Dashboard statistics retrieved',
            data: {
                totalNotices,
                totalUsers,
                totalRegistrations,
                totalReads: 0,
                engagementRate: '0%'
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    createAdmin,
    getDashboardStats
};
