import { gql } from '@apollo/client';

export const GET_CERTIFICATE_BATCH_QUERY = gql`
    query getCertificateBatch($id: String) {
        getCertificateBatch(id: $id) {
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