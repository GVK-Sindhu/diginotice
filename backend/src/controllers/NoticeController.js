const { Notice, NoticeView, User } = require('../models');
const mongoose = require('mongoose');

// @desc    Get all notices
// @route   GET /api/notices
// @access  Public
exports.getNotices = async (req, res, next) => {
    try {
        const { category, search, date, sort, limit: limitQuery } = req.query;
        let query = {};
        let sortOption = { isPinned: -1, postedDate: -1 }; // Default sort

        if (sort === 'recent') {
            sortOption = { postedDate: -1 };
        }

        // Filter by category
        if (category && category !== 'All') {
            query.category = category;
        }

        // Filter by search term
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        // Filter by date
        if (date) {
            query.postedDate = { $gte: new Date(date) };
        }

        const limit = parseInt(limitQuery) || 0;

        let queryBuilder = Notice.find(query)
            .sort(sortOption)
            .populate('createdBy', 'name');

        if (limit > 0) {
            queryBuilder = queryBuilder.limit(limit);
        }

        const notices = await queryBuilder.lean();

        // If user is logged in, attach isRead status
        if (req.user) {
            const views = await NoticeView.find({ user: req.user.id });
            const viewedIds = views.map(v => v.notice.toString());

            notices.forEach(notice => {
                notice.isRead = viewedIds.includes(notice._id.toString());
            });
        }

        res.status(200).json({
            success: true,
            count: notices.length,
            data: notices
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single notice
// @route   GET /api/notices/:id
// @access  Public
exports.getNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id).populate('createdBy', 'name');

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        // Mark as read if user is logged in
        if (req.user) {
            await NoticeView.findOneAndUpdate(
                { notice: notice._id, user: req.user.id },
                { viewedAt: new Date() },
                { upsert: true, new: true }
            );
        }

        res.status(200).json({
            success: true,
            data: notice
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create new notice
// @route   POST /api/notices
// @access  Private/Admin
exports.createNotice = async (req, res, next) => {
    try {
        // Add user to req.body
        req.body.createdBy = req.user.id;

        // Handle file attachments if any
        if (req.files) {
            const attachments = req.files.map(file => {
                let url = file.path;
                if (!url.startsWith('http')) {
                    // Ensure local paths start with a slash for absolute routing
                    const relativePath = file.path.replace(/\\/g, '/');
                    url = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
                }

                return {
                    url,
                    fileType: file.mimetype.startsWith('image') ? 'image' : 'pdf',
                    publicId: file.filename || file.public_id
                };
            });
            req.body.attachments = attachments;
        }

        const notice = await Notice.create(req.body);

        res.status(201).json({
            success: true,
            data: notice
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update notice
// @route   PUT /api/notices/:id
// @access  Private/Admin
exports.updateNotice = async (req, res, next) => {
    try {
        let notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        // Make sure user is notice owner or admin
        if (req.user.role !== 'ADMIN') {
            return res.status(401).json({ success: false, message: 'Not authorized to update this notice' });
        }

        notice = await Notice.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: notice
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notice
// @route   DELETE /api/notices/:id
// @access  Private/Admin
exports.deleteNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        // Make sure user is admin
        if (req.user.role !== 'ADMIN') {
            return res.status(401).json({ success: false, message: 'Not authorized to delete this notice' });
        }

        await notice.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Pin/Unpin notice
// @route   PATCH /api/notices/:id/pin
// @access  Private/Admin
exports.togglePinNotice = async (req, res, next) => {
    try {
        const notice = await Notice.findById(req.params.id);

        if (!notice) {
            return res.status(404).json({ success: false, message: 'Notice not found' });
        }

        notice.isPinned = !notice.isPinned;
        await notice.save();

        res.status(200).json({
            success: true,
            data: notice
        });
    } catch (error) {
        next(error);
    }
};
// @desc    Get dashboard stats
// @route   GET /api/notices/stats
// @access  Private
exports.getNoticeStats = async (req, res, next) => {
    try {
        const totalNotices = await Notice.countDocuments();

        if (req.user.role === 'ADMIN') {
            const totalStudents = await User.countDocuments({ role: 'STUDENT' });

            // For admins, we want to know total reads by STUDENTS only
            const studentIds = await User.find({ role: 'STUDENT' }).select('_id');
            const totalReads = await NoticeView.countDocuments({ user: { $in: studentIds } });

            return res.status(200).json({
                success: true,
                data: {
                    total: totalNotices,
                    read: totalReads,
                    unread: (totalNotices * totalStudents) - totalReads,
                    isGlobal: true,
                    totalStudents
                }
            });
        }

        const viewsCount = await NoticeView.countDocuments({ user: req.user.id });

        res.status(200).json({
            success: true,
            data: {
                total: totalNotices,
                read: viewsCount,
                unread: totalNotices - viewsCount,
                isGlobal: false
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get Admin Analytics
// @route   GET /api/notices/admin/analytics
// @access  Private/Admin
exports.getAdminAnalytics = async (req, res, next) => {
    try {
        const totalStudents = await User.countDocuments({ role: 'STUDENT' });

        const analytics = await Notice.aggregate([
            {
                $lookup: {
                    from: 'noticeviews',
                    localField: '_id',
                    foreignField: 'notice',
                    as: 'views'
                }
            },
            {
                $project: {
                    title: 1,
                    category: 1,
                    viewCount: { $size: '$views' },
                    postedDate: 1,
                    attachments: 1
                }
            },
            { $sort: { postedDate: -1 } }
        ]);

        // Map through to ensure absolute URLs and add unread count
        const enhancedAnalytics = analytics.map(notice => {
            // Fix existing attachment URLs if they are relative
            if (notice.attachments) {
                notice.attachments = notice.attachments.map(att => {
                    if (att.url && !att.url.startsWith('http') && !att.url.startsWith('/')) {
                        att.url = `/${att.url}`;
                    }
                    return att;
                });
            }

            return {
                ...notice,
                readCount: notice.viewCount,
                unreadCount: Math.max(0, totalStudents - notice.viewCount)
            };
        });

        res.status(200).json({
            success: true,
            data: enhancedAnalytics
        });
    } catch (error) {
        next(error);
    }
};
