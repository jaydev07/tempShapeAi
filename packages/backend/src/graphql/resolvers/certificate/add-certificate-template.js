import { ApolloError } from 'apollo-server-errors';
import CertificateTemplate from '../../../database/models/certificate-template';

export default async (parent, { certificate }) => {
	try {
		return await CertificateTemplate.create(certificate);
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}