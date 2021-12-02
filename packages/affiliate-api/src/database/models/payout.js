import mongoose from 'mongoose';

const payoutSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	status: {
		type: String,
		enum: ['created', 'processing', 'processed', 'failed'],
		default: 'processing',
	},
	referrals: [{
		type: mongoose.Types.ObjectId,
		ref: 'Referral',
	}],
	cashfreeReferenceId: String,
	cashfreeFailureReason: String,
	transferUtr: String,
	amount: String,
}, {
	timestamps: true,
});

const Payout = mongoose.model('Payout', payoutSchema);
export default Payout;