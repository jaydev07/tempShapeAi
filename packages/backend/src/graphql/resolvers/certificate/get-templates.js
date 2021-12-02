import { ApolloError } from 'apollo-server-errors';
import CertificateTemplate from '../../../database/models/certificate-template';
export default async (parent, params, { user }) => {
	try {
		return await CertificateTemplate.find(params);
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}