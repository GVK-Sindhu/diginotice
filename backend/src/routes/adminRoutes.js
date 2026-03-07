const express = require('express');
const router = express.Router();
const AdminController = require('../controllers/AdminController');
const { protect, authorize } = require('../middleware/authMiddleware');

/**
 * ADMIN ROUTES
 * All routes here are protected and require the 'ADMIN' role.
 */

// POST /api/admin/create-admin - Only admins can create other admins
router.post('/create-admin',
    protect,
    authorize('ADMIN'),
    AdminController.createAdmin
);

// GET /api/admin/dashboard - Fetch secure system stats for management
router.get('/dashboard',
    protect,
    authorize('ADMIN'),
    AdminController.getDashboardStats
);

module.exports = router;
