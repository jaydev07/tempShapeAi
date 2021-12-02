import gql from 'graphql-tag';

export default gql`
		
		type CertificateBatch {
				_id: String
				certificateTemplate: CertificateTemplate
				csv: String
				createdAt: String
				status: String
				totalEntries: Int
        completedCount: Int
				
		}
		
		type CertificateEmailTemplate {
				name: String
				body: String
				markdown: String
		}
	extend type Query  {
      """
      Get all available certificate template
      """
      getCertificateTemplates(type: String): [CertificateTemplate]
			"""
			get certificate details by it's ObjectId or credentialId
			"""
			getCertificate(id: String credentialId: String): UserCertificate
			"""
			get all user certificates
			"""
			getCertificates: [UserCertificate]
			"""
			get all available Ceritifcate templates
			"""
      getCertificateEmailTemplates: [CertificateEmailTemplate]
			"""
			Get all created certificate batches
			"""
			getCertificateBatches: [CertificateBatch]
			"""
			Get a single certificate batch with id
			"""
			getCertificateBatch(id: String): CertificateBatch
	}
	
	extend type Mutation {
      """
      Add a certificate template
      """
      addCertificateTemplate(certificate: CertificateTemplateInput): CertificateTemplate
      """
      generate certificate for a module by it's id
      """
      generateModuleCertificate(moduleId: String): UserCertificate
			"""
			Create a batch for sending certificates
			"""
			createCertificateBatch(certificateTemplate: String! csv: String! emailBody: String! sourceName: String): CertificateTemplate
			"""
			Create an email template for certificate batches
			"""
			createCertificateEmailTemplate(name: String! body: String! markdown: String!): CertificateEmailTemplate
	}

`