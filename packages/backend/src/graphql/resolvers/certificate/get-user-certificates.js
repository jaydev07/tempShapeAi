import { ApolloError } from 'apollo-server-errors';
import UserCertificate from '../../../database/models/user-certificate';

export default async (parent, {}, { user }) => {
	try {
		return await UserCertificate.find({ user: user._id });
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}