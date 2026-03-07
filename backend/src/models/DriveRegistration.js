const mongoose = require('mongoose');

const driveRegistrationSchema = new mongoose.Schema({
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
    registeredAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Create index for unique registration
driveRegistrationSchema.index({ notice: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('DriveRegistration', driveRegistrationSchema);
