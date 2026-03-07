const cron = require('node-cron');
const { Notice } = require('../models');
const { Op } = require('sequelize');

/**
 * ARCHIVE_JOB
 * Runs daily at midnight (00:00)
 * Archives notices where publish_date is older than current day
 */
const startArchivingJob = () => {
    // '0 0 * * *' = Every day at midnight
    cron.schedule('0 0 * * *', async () => {
        console.log('[CRON] Running notice archival job...');
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const [updatedCount] = await Notice.update(
                { status: 'ARCHIVED' },
                {
                    where: {
                        status: 'ACTIVE',
                        publish_date: {
                            [Op.lt]: today
                        }
                    }
                }
            );

            console.log(`[CRON] SUCCESS: Archived ${updatedCount} expired notices.`);
        } catch (error) {
            console.error('[CRON] ERROR: Failed to archive notices:', error.message);
        }
    });

    console.log('[CRON] Notice archival scheduler initialized (Daily at 00:00)');
};

module.exports = startArchivingJob;
