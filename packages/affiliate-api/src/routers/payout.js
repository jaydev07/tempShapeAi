import express from 'express';
const router = express();
import { user } from "../middlewares/user";
import { initPayout } from '../controllers/payout';
import Payout from '../database/models/payout';
import cashfreePayouts from '../services/cashfree';
import Referral from '../database/models/referral';

router.post('/init', user,  async (req, res) => {
	try {
		const payoutRes = await initPayout(req.userId);
		res.json(payoutRes);
	} catch (e) {
	 res.status(500).send(e.message);
	}
});

router.get('/', user,  async (req, res) => {
	try {
		// fetch payouts from db
		const payouts = await Payout.find({ user: req.userId });
		// filter which are 'processing'
		if (payouts.length === 0) return res.json([]);
		const processingPayouts = payouts.filter(payout => payout.status === 'processing');
		// check cashfree transaction status of the processing payouts
		if (processingPayouts.length > 0) {
			
			for (const payout of processingPayouts) {
				let statusRes;
				try {
					statusRes = await cashfreePayouts.transfers.getTransferStatus({
						transferId: payout._id,
					});
				} catch (e) {
					console.log(e)
				}
				if (statusRes.status === 'ERROR') {
					await Payout.findByIdAndUpdate(payout._id, {
						$set: {
							status: 'failed',
							cashfreeFailureReason: 'FAILED. Could not process the payout',
						}
					});
				}
				else {
					const {transfer} = statusRes.data;
					// if success -> update the payout status to 'processed' and update all the referrals to 'paid'
					if (transfer.status === 'SUCCESS') {
						console.log('success update', payout._id)
						await Payout.findByIdAndUpdate(payout._id, {
							$set: {
								status: 'processed',
								transferUtr: transfer.utr,
							}
						});
						
						await Referral.updateMany({
							_id: {$in: payout.referrals}
						}, {
							status: 'paid',
						});
					}
					
					// if failed -> update the payout status to 'failed'
					else if (transfer.status === 'REVERSED' || transfer.status === 'FAILED') {
						await Payout.findByIdAndUpdate(payout._id, {
							$set: {
								status: 'failed',
								cashfreeFailureReason: transfer.status + '. ' + transfer?.reason,
							}
						});
					}
				}
			}
		}
		// return all the payouts
		res.json(await Payout
			.find({ user: req.userId })
			.select('amount createdAt _id status cashfreeFailureReason')
			.sort({ _id: -1 })
		);
	} catch (e) {
		console.log(e)
		res.status(500).send(e.message);
	}
});

export default router;