import { gql } from "@apollo/client";

export const UPDATE_MODULE_QUERY = gql`
  mutation updateModuleDetails(
    $id: String!
    $name: String
    $description: String
    $isCertificateAvailable: Boolean
    $certificateTemplate: String
  ) {
    updateModuleDetails(
      id: $id
      name: $name
      description: $description
      isCertificateAvailable: $isCertificateAvailable
      certificateTemplate: $certificateTemplate
    ) {
      _id
      name
      description
      isCertificateAvailable
      certificateTemplate
    }
  }
`;
