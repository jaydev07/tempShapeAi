import { gql } from "@apollo/client";

export const GENERATE_MODULE_CERTIFICATE_QUERY = gql`
  mutation generateModuleCertificate($moduleId: String) {
    generateModuleCertificate(moduleId: $moduleId) {
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
