import { gql } from "@apollo/client";

export const UPDATE_MODULE_RESOURCES_QUERY = gql`
    mutation updateModuleResources($id: String!  $action: resAction! $resources: [ImageInput] $resourcesIds: [String]) {
        updateModuleResources(id: $id action:$action  resources: $resources resourceIds: $resourcesIds ) {
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
