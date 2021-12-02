import { ApolloError } from 'apollo-server-errors';
import Users from '../../../database/models/user';
export default async (parent, { user }) => {
	try {
		return await Users.find({ type: {$ne: 'student'} }).lean();
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}