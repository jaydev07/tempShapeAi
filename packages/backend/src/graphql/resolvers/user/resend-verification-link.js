import { ApolloError } from 'apollo-server-errors';
import UserVerification from '../../../database/models/user-verification';
import { addVerifyEmailJob } from '../../../bus/producers/email';

export default async (parent, {}, { user }) => {
	try {
		if (user.isVerifified) return { sent: false, code: 'Already_Verified' };
		const uv = await UserVerification.findOne({ user: user._id });
		if (new Date() - new Date(uv.sentAt) < 45000)
			throw new ApolloError('Cannot send mail within 45 seconds of previous attempt', 'TIME_ERR');
		addVerifyEmailJob(uv.token, user.name, user.email);
		await UserVerification.updateOne({_id: uv._id }, {
			$set: {
				sentAt: new Date(),
			},
			$inc: {
				retryAttempts: 1,
			},
		})
		return { sent: true, code: 'SUCCESS' };
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
};
