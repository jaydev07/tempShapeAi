import { ApolloError } from 'apollo-server-errors';
import User from '../../../database/models/user';

export default async (parent, { email, password, type }) => {
	try {
		return await User.create({
			email,
			password,
			name: {
				firstName: email,
				lastName: `-${type}`
			},
			phone: '0000000000',
			type,
		});
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}