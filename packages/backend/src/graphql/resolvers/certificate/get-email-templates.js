import CertificateEmailTemplate from '../../../database/models/cert-email-templates';
import { ApolloError } from 'apollo-server-errors';

export default async () => {
	try {
		return await CertificateEmailTemplate.find();
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}
