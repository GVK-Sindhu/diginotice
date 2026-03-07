const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    category: {
        type: String,
        required: [true, 'Please add a category'],
        enum: ['Academic', 'Exams', 'Placements', 'Events', 'Circulars'],
        default: 'Academic'
    },
    eventLink: {
        type: String,
        required: false
    },
    attachments: [
        {
            url: {
                type: String,
                required: true
            },
            fileType: {
                type: String,
                enum: ['image', 'pdf'],
                required: true
            },
            publicId: {
                type: String,
                required: false // For Cloudinary
            }
        }
    ],
    isPinned: {
        type: Boolean,
        default: false
    },
    postedDate: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Notice', noticeSchema);
