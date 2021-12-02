import Referral from '../database/models/referral';
import Payout from '../database/models/payout';
import User from '../database/models/user';
import { Types } from 'mongoose';
import cashfreePayouts from '../services/cashfree';

const getTransferCharges = async (amount, userId) => {
	let charges = 0;
	const isFirstPayout = !(await Payout.exists({ user: userId, status: 'processed' }));
	if (isFirstPayout) {
		// upi verification charges
		const user = await User.findById(userId).select('profileUpdateAttempts');
		charges += user.profileUpdateAttempts * 3;
	}
	// https://www.cashfree.com/payment-gateway-charges#payouts
	if (amount > 10000) charges += 10;
	else if (amount > 1000 && amount < 10000) charges += 6;
	else if (amount <= 1000) charges += 3;
	return charges;
}
export const initPayout = async (userId) => {
	try {
		
		if (await Payout.exists({ user: userId, status: { $nin: ['failed', 'processed'] } })) {
			throw new Error('You have a payout pending. Please try again later.')
		}
		
		const referrals = await Referral.find({
			user: userId,
			status: 'payable',
		})
			.limit(195)
			.select('_id referrerPay')
		// 195 as limit since cashfree cannot make a payout  more than 1Lac (1 referral = 500rs)
		const amountInSubUnit = referrals.reduce((a, b) => a + b.referrerPay ,0);
		if (amountInSubUnit < 100000) throw new Error('Minimum payout is 1000Rs.')
		
		const amountInRupees = amountInSubUnit / 100;
		const deductions = await getTransferCharges(amountInRupees, userId);
		const totalPayoutAmount = amountInRupees - deductions;
		const amountFormatted = String(totalPayoutAmount) + '.00';
		const payout = await Payout.create({
			user: userId,
			referrals: referrals.map(i => i._id),
			amount: amountInSubUnit,
		});
		
		try {
			const payoutRes = await cashfreePayouts.transfers.requestTransfer({
				beneId: userId.toString(),
				transferId: payout._id,
				transferMode: 'upi',
				amount: amountFormatted,
			});
			if (payoutRes.status === 'SUCCESS') {
				await Payout.findByIdAndUpdate(payout._id, {
					cashfreeReferenceId: payoutRes.data.referenceId,
					transferUtr: payoutRes.data.utr,
					status: 'processed'
				});
				await Referral.updateMany({
					_id: { $in: payout.referrals }
				}, {
					status: 'paid',
				});
				return payoutRes;
			}
			else if (payoutRes.status === 'PENDING') {
				await Payout.findByIdAndUpdate(payout._id, {
					cashfreeReferenceId: payoutRes.data.referenceId,
					transferUtr: payoutRes.data.utr,
					status: 'processing'
				});
				return payoutRes;
			}
			else if (payoutRes.subCode !== '200') {
				console.log(payoutRes)
				throw new Error(payoutRes.message);
			}
			
		} catch (e) {
			console.log(e)
			await Payout.findByIdAndUpdate(payout._id, {
				cashfreeFailureReason: 'FAILED. ' + e.message,
				status: 'failed'
			});
			throw e;
		}

	} catch (e) {
		throw e;
	}
}
//00
// initPayout(Types.ObjectId('609a7ca6bace3873b9d125e7'))