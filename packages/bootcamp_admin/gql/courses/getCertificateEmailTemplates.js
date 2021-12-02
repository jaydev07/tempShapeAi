import { gql } from '@apollo/client';

export const GET_CERTIFICATE_EMAIL_TEMPLATES_QUERY = gql`
	query getCertificateEmailTemplates {
      getCertificateEmailTemplates {
		      body
		      name
		      markdown
			}
	}
`;