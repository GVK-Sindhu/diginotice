/**
 * adminMiddleware - Restricts access to ADMIN users only
 */
const adminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== 'ADMIN') {
        return res.status(403).json({
            success: false,
            message: 'Access denied: Requires Admin privileges'
        });
    }
    next();
};

module.exports = adminMiddleware;
