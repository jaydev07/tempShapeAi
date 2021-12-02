import { ApolloError } from 'apollo-server-errors';
import UserVerification from '../../../database/models/user-verification';
import User from '../../../database/models/user';

export default async (parent, { token }) => {
	try {
	const ua = await UserVerification.verify(token);
	if (!ua) return false;
	await User.findByIdAndUpdate(ua.user, {
		isVerified: true,
	});
	await UserVerification.findByIdAndDelete(ua._id);
	return true;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}