import { ApolloError } from 'apollo-server-errors';
import { verifyEmail } from '../../../services/aws/ses';

export default async (parent, { email }, { user }) => {
	try {
		if (user.type !== 'superAdmin')
			throw new ApolloError("Insufficient Permissions", 'FORBIDDEN');
		await verifyEmail(email);
		return true;
		
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}