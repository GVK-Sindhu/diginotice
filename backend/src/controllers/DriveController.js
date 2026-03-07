const { Notice, User, DriveRegistration } = require('../models');

/**
 * registerForDrive - Students register for notices categorized as 'Placements' or 'Events'
 */
const registerForDrive = async (req, res, next) => {
    try {
        const { driveId } = req.body;

        // Verify notice exists
        const notice = await Notice.findById(driveId);

        if (!notice) {
            return res.status(404).json({
                success: false,
                message: 'Notice not found'
            });
        }

        // Create registration
        await DriveRegistration.create({
            notice: driveId,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: 'Successfully registered for event'
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: 'You are already registered' });
        }
        next(error);
    }
};

/**
 * getDriveMetrics - Admins view statistics for a specific drive
 */
const getDriveMetrics = async (req, res, next) => {
    try {
        const { driveId } = req.params;

        const notice = await Notice.findById(driveId);
        if (!notice) {
            return res.status(404).json({ success: false, message: 'Drive not found' });
        }

        // Calculate metrics
        const registeredCount = await DriveRegistration.countDocuments({ notice: driveId });

        res.status(200).json({
            success: true,
            data: {
                notice,
                metrics: {
                    registeredCount
                }
            }
        });
    } catch (error) {
        next(error);
    }
};

/**
 * getRegisteredStudents - List of students registered for a drive
 */
const getRegisteredStudents = async (req, res, next) => {
    try {
        const { driveId } = req.params;

        const registrations = await DriveRegistration.find({ notice: driveId })
            .populate('user', 'name email department year');

        res.status(200).json({
            success: true,
            data: registrations.map(r => r.user)
        });
    } catch (error) {
        next(error);
    }
};

/**
 * exportRegistrations - Export drive registration list as CSV
 */
const exportRegistrations = async (req, res, next) => {
    try {
        const { driveId } = req.params;

        const registrations = await DriveRegistration.find({ notice: driveId })
            .populate('user', 'name email department year')
            .populate('notice', 'title');

        if (registrations.length === 0) {
            return res.status(404).json({ success: false, message: 'No registrations found for this drive' });
        }

        const driveTitle = registrations[0].notice.title.replace(/[^a-z0-9]/gi, '_');

        const fastCsv = require('fast-csv');
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', `attachment; filename=registrations_${driveTitle}.csv`);

        const csvStream = fastCsv.format({ headers: true });
        csvStream.pipe(res);

        registrations.forEach(reg => {
            if (reg.user) {
                csvStream.write({
                    Name: reg.user.name,
                    Email: reg.user.email,
                    Department: reg.user.department,
                    Year: reg.user.year,
                    'Registration Date': reg.registeredAt
                });
            }
        });

        csvStream.end();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    registerForDrive,
    getDriveMetrics,
    getRegisteredStudents,
    exportRegistrations
};
