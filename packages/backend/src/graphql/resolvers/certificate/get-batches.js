import { ApolloError } from 'apollo-server-errors';
import CertificateBatch from '../../../database/models/cert-batch';
export default async (parent, { user }) => {
	try {
		return await CertificateBatch
			.find()
			.sort({ _id: -1 })
			.populate('certificateTemplate')
			.lean()
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}