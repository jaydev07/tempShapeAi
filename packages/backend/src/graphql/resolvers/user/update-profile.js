import { ApolloError } from 'apollo-server-errors';
import User from '../../../database/models/user';

export default async (parent, { userUpdateInput }, { user }) => {
	try {
		if (userUpdateInput.name) {
			const { name } = userUpdateInput;
			if (!name.lastName) userUpdateInput.name.lastName = user.name.lastName;
			if (!name.firstName) userUpdateInput.name.firstName = user.name.firstName;
		}
		return await User.findByIdAndUpdate(user._id, userUpdateInput, {
			omitUndefined: true,
			new: true,
		});
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
};