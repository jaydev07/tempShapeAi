import { gql } from '@apollo/client';

export const ADD_CERTIFICATE_EMAIL_TEMPLATES_QUERY = gql`
    mutation addCertificateEmailTemplat($name: String! $body: String! $markdown: String!) {
        createCertificateEmailTemplate(name: $name body: $body markdown: $markdown) {
		        name
        }
    }
`;