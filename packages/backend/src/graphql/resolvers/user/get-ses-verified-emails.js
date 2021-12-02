import { ApolloError } from 'apollo-server-errors';
import { getVerifiedEmails } from '../../../services/aws/ses';

export default async (parent, { email }, { user }) => {
	try {
		if (user.type !== 'superAdmin')
			throw new ApolloError("Insufficient Permissions", 'FORBIDDEN');
		return await getVerifiedEmails();
		
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}