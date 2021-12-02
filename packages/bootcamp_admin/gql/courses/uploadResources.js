import { gql } from "@apollo/client";

export const UPLOAD_RESOURCES_QUERY = gql`
  mutation updateModuleResources(
    $id: String!
    $action: resAction!
    $resources: [ImageInput]
    $resourceIds: [String]
    $newName: String
  ) {
    updateModuleResources(
      id: $id
      action: $action
      resources: $resources
      resourceIds: $resourceIds
      newName: $newName
    ) {
      _id
      resources {
        _id
        key
        location
        name
      }
    }
  }
`;
