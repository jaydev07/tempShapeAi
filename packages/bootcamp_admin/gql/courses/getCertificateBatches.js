import { gql } from '@apollo/client';

export const GET_CERTIFICATE_BATCHES_QUERY = gql`
	query getCertificateBatches{
			getCertificateBatches {
					_id
					certificateTemplate {
							name
							imageUrl
					}
					status
					completedCount
					createdAt
					status
					totalEntries
			}
	}
`;