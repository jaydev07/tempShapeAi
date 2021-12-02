import { ApolloError } from 'apollo-server-errors';
import UserCertificate from '../../../database/models/user-certificate';

export default async (parent, { id, credentialId }) => {
	try {
		if (id) return await UserCertificate.findById(id);
		return await UserCertificate.findOne({ credentialId });
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}