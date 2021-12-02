import addCertificateTemplate from './add-certificate-template';
import getCertificateTemplates from './get-templates';
import generateModuleCertificate from './gen-cert';
import getCertificate from './get-certificate';
import getCertificates from './get-user-certificates';
import createCertificateBatch from './create-batch';
import getCertificateEmailTemplates from './get-email-templates';
import createCertificateEmailTemplate from './add-email-template'
import getCertificateBatches from './get-batches';
import getCertificateBatch from './get-batch';

export default {
	Mutation: {
		addCertificateTemplate,
		generateModuleCertificate,
		createCertificateBatch,
		createCertificateEmailTemplate
	},
	Query: {
		getCertificateTemplates,
		getCertificate,
		getCertificates,
		getCertificateEmailTemplates,
		getCertificateBatches,
		getCertificateBatch,
	}
}