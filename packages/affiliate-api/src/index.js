import 'dotenv/config';
import conn from './database/conn';
import updateReferralStatusCron from './cron/update-referral-status'
import router from './routers/index';
import cron from 'node-cron';
import { sendPaymentConfirmationMail } from './services/ses';
import { logError } from './services/cloudwatchlogs';
router.listen(4000, () => {
	conn().then(() => {
		cron.schedule('0 1 * * *', () => {
			updateReferralStatusCron()
				.catch(async err => {
					await logError({
						logGroupName: 'updateReferralStatusCron',
						logStreamName: `URS-${new Date().getTime()}`,
						errMessage: err.message,
					})
			}).then(async () => {
				await sendPaymentConfirmationMail('devu.nm21@gmail.com', 'Update Referral Status Cron Ran')
			});
		}, {
			timezone: 'Asia/Kolkata',
		});
	})
})
