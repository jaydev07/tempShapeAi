import mongoose from 'mongoose';
import crypto from 'crypto';

const verificationSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	token: {
		type: String,
		required: true,
	},
	expiresAt: {
		type: Date
	},
	sentAt: Date,
	retryAttempts: {
		type: Number,
		default: 0,
	}
}, {
	timestamps: true,
});

verificationSchema.statics.verify = async function (token) {
	return UserVerification.findOne({
		token,
		expiresAt: {
			$gt: new Date()
		}
	});
};

verificationSchema.statics.gen = async function (userId) {
	const date = new Date();
	date.setHours(date.getHours() + 12);
	return await UserVerification.create({
		user: userId,
		token: crypto.createHash('sha1').update(Date.now() + Math.random().toString()).digest('hex'),
		expiresAt: date,
		sentAt: new Date(),
	});
};

const UserVerification = mongoose.model('UserVerification', verificationSchema);
export default UserVerification;