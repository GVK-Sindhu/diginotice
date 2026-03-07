const bcrypt = require('bcrypt');
const { User } = require('../models');

/**
 * seedAdmin - Bootstraps the system with an initial ADMIN if none exist.
 * 
 * SECURITY BEST PRACTICE:
 * Automated bootstrapping ensures a secure first-run experience without 
 * requiring manual DB access or insecure registration endpoints.
 */
const seedAdmin = async () => {
    try {
        // Check if any ADMIN exists in the database
        const adminExists = await User.findOne({ where: { role: 'ADMIN' } });

        if (adminExists) {
            // If an admin already exists, we do nothing to prevent overwriting or duplicates
            return;
        }

        // Fetch credentials from environment variables for security
        const name = process.env.ADMIN_NAME || 'Super Admin';
        const email = process.env.ADMIN_EMAIL;
        const password = process.env.ADMIN_PASSWORD;

        if (!email || !password) {
            console.warn('[SEED] ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env for initialization.');
            return;
        }

        // Hash the admin password using bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the Super Admin user
        await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'ADMIN',
            department: 'Administration',
            year: 0
        });

        console.log(`[SEED] SUCCESS: Initial Admin account created (${email})`);
        console.log('[SEED] INFO: Default role for public registration is STUDENT.');

    } catch (error) {
        console.error('[SEED] ERROR: Failed to bootstrap initial admin:', error.message);
    }
};

module.exports = seedAdmin;
