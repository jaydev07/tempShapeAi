import { gql } from "@apollo/client";

export const GET_CERTIFICATE_QUERY = gql`
    query getCertificate($id: String, $credentialId: String) {
        getCertificate(id: $id, credentialId: $credentialId) {
            _id
            user
            credentialId
            template
            course
            module
            accomplishmentType
            status
            pdfUrl
            imgUrl
            createdAt
            purposeName
            userFullName
        }
    }
`;
