import { gql } from "@apollo/client";

export const ADD_CERTIFICATE_QUERY = gql`
  mutation addCertificateTemplate($certificate: CertificateTemplateInput) {
    addCertificateTemplate(certificate: $certificate) {
      _id
      name
      type
    }
  }
`;
