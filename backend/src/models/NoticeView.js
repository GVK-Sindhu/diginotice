const mongoose = require('mongoose');

const noticeViewSchema = new mongoose.Schema({
    notice: {
        type: mongoose.Schema.ObjectId,
        ref: 'Notice',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    viewedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Ensure a user only has one view record per notice (or updates the last view)
noticeViewSchema.index({ notice: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('NoticeView', noticeViewSchema);
