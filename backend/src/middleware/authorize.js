/**
 * authorize - Reusable middleware for role-based access control
 * 
 * @param {Array} roles - Allowed roles for this route (e.g. ['ADMIN'])
 */
const authorize = (roles = []) => {
    return (req, res, next) => {
        // Authentication should have happened already via authenticate middleware
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required'
            });
        }

        /**
         * AUTHORIZATION RATIONALE:
         * Separate from authentication. This checks if the authenticated user
         * has the required privileges to access the resource.
         */
        if (roles.length && !roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Access restricted to ${roles.join(', ')}`
            });
        }

        next();
    };
};

module.exports = authorize;
