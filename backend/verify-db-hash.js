const bcrypt = require('bcrypt');
const { User } = require('./src/models');
const sequelize = require('./src/config/db');

async function verify() {
    try {
        await sequelize.authenticate();
        const user = await User.findOne({ where: { email: 'admin@noticehub.com' } });
        if (!user) {
            console.log('User admin@noticehub.com not found');
            return;
        }

        console.log('Found user with hash:', user.password);
        const isMatch = await bcrypt.compare('password123', user.password);
        console.log('Does "password123" match the DB hash?', isMatch);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

verify();
