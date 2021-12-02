import { gql } from "@apollo/client";

export const GET_CERTIFICATE_TEMPLATES_QUERY = gql`
  query getCertificateTemplates($type: String) {
    getCertificateTemplates(type: $type) {
      _id
      name
      dimensions {
        height
        width
      }
      tags {
        key
        value
      }
      imageUrl
      type
    }
  }
`;
