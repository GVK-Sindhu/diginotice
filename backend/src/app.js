const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const errorMiddleware = require('./middleware/errorMiddleware');
const authRoutes = require('./routes/authRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const adminRoutes = require('./routes/adminRoutes');
const driveRoutes = require('./routes/driveRoutes');

const path = require('path');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Static files
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/drives', driveRoutes);

// Base route
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Notice Hub API is running' });
});

// Error handling
app.use(errorMiddleware);

module.exports = app;
