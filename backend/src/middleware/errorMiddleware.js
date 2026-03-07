const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack);

    let statusCode = err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    // Sequelize Unique Constraint Error
    if (err.name === 'SequelizeUniqueConstraintError') {
        statusCode = 400;
        message = 'Email already exists';
    }

    res.status(statusCode).json({
        success: false,
        message,
        data: process.env.NODE_ENV === 'development' ? err.stack : {}
    });
};

module.exports = errorMiddleware;
