import crypto from 'crypto';
import mongoose from 'mongoose';
import Order from '../database/models/order';
import Product from '../database/models/product';
import User from '../database/models/user';
import Referral from '../database/models/referral';
import Batch from '../database/models/batch';
import razorpay from '../services/razorpay';
import BatchSlot from '../database/models/batch-slot';
import { sendPaymentConfirmationMail } from "../services/ses";

export const createOrder = async (productId, refId, currency, notes) => {
	refId = currency === 'INR' ? refId : null;
	const product = await Product
		.findById(productId)
		.populate('details')
		.lean();
	if (!product) throw new Error('Invalid Product Id');
	let amount = product.price;
	let referrer;
	if (refId) {
		referrer = await User.findOne({ referralId: refId });
		if (!referrer) throw new Error('Invalid Referral Id');
		amount -= product.discountOnReferral;
	}
	const orderId = mongoose.Types.ObjectId();
	console.log('price', currency === 'INR' ? amount: product.priceInUSD);
	const razorpayOrder = await razorpay.orders.create({
		amount: currency === 'INR' ? amount: product.priceInUSD,
		currency,
		receipt: orderId.toString(),
		notes: {
			productId: productId,
			name: product.name,
			batchId: String(product.details._id),
			batch: `${new Date(product.details.from).toDateString()} to ${new Date(product.details.to).toDateString()}`,
			refId: refId || 'NA',
			studentName: notes.studentName,
			studentWhatsapp: notes.studentWhatsapp,
			studentGmail: notes.studentGmail,
		}
	});
	const order = new Order({
		amount,
		products: [product._id],
		referralId: refId,
		razorpayOrderId: razorpayOrder.id,
	});
	if (referrer) order.referrer = referrer._id;
	await order.save();
	return order;
};

export const updateOrderStatus = async (razorpayPaymentId, razorpaySignature, options = { fromWebhook: Boolean }) => {
	const { status, order_id, email, contact, ...rest } = await razorpay.payments.fetch(razorpayPaymentId);
	console.log({order_id});
	const fromWebhook = options ? options.fromWebhook : false;
	const orderStatus = status === 'authorized' || status === 'captured' ? 'completed': status;
	let order = await Order.findOne({ razorpayOrderId: order_id }).populate('products')
	if (orderStatus === 'completed') {
		if (razorpaySignature) {
			const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
			hmac.update(order_id + "|" + razorpayPaymentId);
			let generatedSignature = hmac.digest("hex");
			let isSignatureValid = generatedSignature === razorpaySignature;
			if (!isSignatureValid) throw new Error("Unauthorised source");
		}
		let referrer;
		if (order.referralId) {
			referrer = await User.findOne({referralId: order.referralId});
		}
			if (!await BatchSlot.exists({ order: order._id })) {
				
				await BatchSlot.create({
					batch: order.products[0].details,
					order: order._id,
					referrer: referrer ? referrer._id : null,
					email,
					phone: contact,
				});
				await Batch.findByIdAndUpdate(order.products[0].details, {
					$inc: {
						bookedSlots: 1
					}
				})
				await sendPaymentConfirmationMail(email, razorpayPaymentId);
				
			}

		if (order.referralId) {
				if (!await Referral.exists({ razorpayPaymentId })) {
					const referral = await Referral.create({
						user: referrer._id,
						referredEmail: email,
						referrerPay: order.products[0].referrerCut,
						order: order._id,
						product: order.products[0]._id,
						razorpayPaymentId,
					});
					await User.findByIdAndUpdate(referrer._id, {
						$push: {
							referrals: referral._id,
						}
					});
				}
		}
	}
	return Order.findOneAndUpdate({razorpayOrderId: order_id}, {
		$set: {
			status: orderStatus,
			email,
			phone: contact,
			razorpayPaymentId,
			errorDetails: {
				code: rest.error_code,
				description: rest.error_description,
				step: rest.error_step,
				source: rest.error_source,
				reason: rest.error_reason
			}
		}
	}, {
		new: true,
		lean: true,
	});
};
