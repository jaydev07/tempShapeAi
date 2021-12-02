import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
	email: {
		type: String,
		trim: true,
		lowercase: true,
	},
	phone: String,
	products: [{
		type: mongoose.Types.ObjectId,
		ref: 'Product',
	}],
	referralId: String,
	referrer: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	razorpayOrderId: String,
	razorpayPaymentId: String,
	razorpayPaymentStatus: String,
	errorDetails: {
		code: String,
		description: String,
		reason: String,
		source: String,
		step: String,
	},
	status: {
		type: String,
		// set to attempted when payment status is created but not authorized
		enum: ['created', 'attempted', 'completed', 'failed', 'refunded'],
	},
	amount: Number,
}, {
	timestamps: true,
});

orderSchema.statics.updateStatusByPaymentId = async function(razorpayPaymentId, status) {
	return Order.findOneAndUpdate({
		razorpayPaymentId,
	}, {
		$set: {
			status
		}
	}, {
		new: true,
	});
}

const Order = mongoose.model('Order', orderSchema);
export default Order;

// 2021-05-06T11:51:52.588+00:00
// 2021-05-06T12:14:26.313+00:00