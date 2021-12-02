import { ApolloError } from 'apollo-server-errors';
import CertificateBatch from '../../../database/models/cert-batch';
export default async (parent, { id }) => {
	try {
		return await CertificateBatch
			.findById(id)
			.populate('certificateTemplate')
			.lean()
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}