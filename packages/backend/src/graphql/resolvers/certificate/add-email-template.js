import CertificateEmailTemplate from '../../../database/models/cert-email-templates';
import { ApolloError } from 'apollo-server-errors';

export default async (parent, params) => {
	try {
		return await CertificateEmailTemplate.create(params);
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}
