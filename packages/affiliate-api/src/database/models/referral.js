import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		refL: 'User',
		required: true,
	},
	referredEmail: {
		type: String,
		required: true,
	},
	referrerPay: Number,
	status: {
		type: String,
		enum: ['created', 'payable', 'paid', 'refunded'],
		default: 'created',
		index: true,
	},
	order: {
		type: mongoose.Types.ObjectId,
		ref: 'Order',
		unique: true,
	},
	razorpayPaymentId: {
		type: String,
		index: true,
		unique: true,
	},
}, {
	timestamps: true,
});

referralSchema.index({'createdAt': 1});

referralSchema.statics.getTotalAmountForUserByStatus = async (userId, status) => {
	const res = (await Referral.aggregate([
		{
			$match: {
				user: mongoose.Types.ObjectId(userId),
				status: status,
			}
		},
		{ $group: {
			_id: "user", amount: { $sum: "$referrerPay" }
			}
		},
	]));
	return res[0]?.amount || 0;
}
const Referral = mongoose.model('Referral', referralSchema);
export default Referral;

