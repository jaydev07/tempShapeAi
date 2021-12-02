import { ApolloError } from 'apollo-server-errors';
import UserStatus from '../../../database/models/user-status';
export default async (parent, {}, { user }) => {
	try {
		const userStatus =  await UserStatus.findOne({ user: user._id });
		if (!userStatus) return await UserStatus.create({ user: user._id });
		return userStatus;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}