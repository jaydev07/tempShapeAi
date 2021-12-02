import User from '../database/models/user';
import BatchSlot from '../database/models/batch-slot';
import Batch from '../database/models/batch';
import Referral from '../database/models/referral';

export const referralIdExists = async (referralId) => {
	return User.exists({ referralId })
};

export const getReferralCountsByBatches = async (referralId) => {
	const user = await User.findOne({ referralId });
	const res = await BatchSlot.aggregate([
		{
			$match: {
				referrer: user._id,
				isCancelled: {$in: [null, false]},
			}
		},
		{
			$group: { _id: '$batch', count: { $sum: 1 } },
		},{
		$lookup: {
			from: 'batches',
			localField: '_id',
			foreignField: '_id',
			as: 'batch'
		},
		}, {
			$project: {
				'batch.availableSlots': 0,
				'batch.bookedSlots': 0,
				'batch.acceptSlotsAfterLimit': 0
			}
		}, {
		$lookup: {
			from: 'bootcamps',
			localField: 'batch.bootcamp',
			foreignField: '_id',
			as: 'bootcamp'
		}
		}
	]);
	return {
		sales: res.map(r => ({
			bootcamp: r.bootcamp[0].name,
			batchId: r.batch[0]._id,
			batchPeriod: `${new Date(r.batch[0].from).toDateString().slice(4)} to ${new Date(r.batch[0].to).toDateString().slice(4)}`,
			count: r.count,
		})),
		totalCount: await BatchSlot.countDocuments({ referrer: user._id, isCancelled: {$in: [null, false]} })
	};
};

export const getInfluencerSalesCountUnderManager = async (managerId) => {
	const influencers = await User.find({ manager: managerId }).select('email');
	const res = [];
	for (const i of influencers) {
		const count = await Referral.countDocuments({ user: i._id });
		res.push({
			count,
			email: i.email,
		})
	}
	return res;
};
