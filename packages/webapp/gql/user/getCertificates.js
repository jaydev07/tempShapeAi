import { gql } from "@apollo/client";

export const GET_ALL_CERTIFICATE_QUERY = gql`
  query getCertificates {
    getCertificates {
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
    }
  }
`;
