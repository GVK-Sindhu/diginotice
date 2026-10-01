const express = require('express');
const {
    getNotices,
    getNotice,
    createNotice,
    updateNotice,
    deleteNotice,
    togglePinNotice,
    getNoticeStats,
    getAdminAnalytics
} = require('../controllers/NoticeController');

const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../services/uploadService');

const router = express.Router();

router
    .route('/')
    .get(getNotices)
    .post(protect, authorize('ADMIN'), upload.array('attachments', 5), createNotice);

router
    .route('/:id')
    .get(getNotice)
    .put(protect, authorize('ADMIN'), upload.array('attachments', 5), updateNotice)
    .delete(protect, authorize('ADMIN'), deleteNotice);

router.get('/stats', protect, getNoticeStats);
router.get('/admin/analytics', protect, authorize('ADMIN'), getAdminAnalytics);

router.patch('/:id/pin', protect, authorize('ADMIN'), togglePinNotice);

module.exports = router;
