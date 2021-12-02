import { gql } from '@apollo/client';

export const CREATE_CERTIFICATE_BATCH_QUERY = gql`
	mutation createCertificateBatch($certificateTemplate: String! $csv: String! $emailBody: String!) {
			createCertificateBatch(certificateTemplate: $certificateTemplate csv: $csv emailBody: $emailBody) {
					name

			}
	}
`