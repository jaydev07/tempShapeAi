import { ApolloError } from 'apollo-server-errors';
import UserStatus from '../../../database/models/user-status';

export default async (parent, params , { user }) => {
	try {
		return await UserStatus.findOneAndUpdate({
			user: user._id,
		}, {
			$set: params
		}, {
			upsert: true,
			new: true,
		});
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}