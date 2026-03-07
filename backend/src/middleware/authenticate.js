const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * authenticate - Verifies JWT and attaches user to the request
 * 
 * SECURITY RATIONALE:
 * The JWT signature ensures that the payload (including user ID and role) 
 * has not been modified by the client. Changing the role field in the 
 * base64-encoded token without the JWT_SECRET will cause verification to fail.
 */
const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token required (Bearer)'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify signature and decode payload
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user from DB to ensure they still exist and have correct current role
        const user = await User.findByPk(decoded.id);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User no longer exists or token is invalid'
            });
        }

        // Attach user object to request for downstream authorization
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = authenticate;
