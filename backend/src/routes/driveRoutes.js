const express = require('express');
const router = express.Router();
const DriveController = require('../controllers/DriveController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * DRIVE REGISTRATION ROUTES
 */

// Student: Register for a drive
router.post('/register',
    protect,
    authorize('STUDENT'),
    DriveController.registerForDrive
);

// Admin: View metrics for a specific drive
router.get('/:driveId/metrics',
    protect,
    authorize('ADMIN'),
    DriveController.getDriveMetrics
);

// Admin: View list of registered students
router.get('/:driveId/students',
    protect,
    authorize('ADMIN'),
    DriveController.getRegisteredStudents
);

// Admin: Export registrations as CSV
router.get('/:driveId/export',
    protect,
    authorize('ADMIN'),
    DriveController.exportRegistrations
);

module.exports = router;
