import { gql } from "@apollo/client";

export const CREATE_MODULE_QUERY = gql`
  mutation createModule($module: ModuleInput) {
    createModule(module: $module) {
      _id
      name
      description
      course
      isSub
      units {
        type
        unit {
          _id
          name
          description
          course
          units {
            type
            unit {
              _id
              name
              description
              course
              module
              type
              details
              points
            }
          }
          module
          type
          details
          points
        }
      }
      parentModule
      isProjectModule
      isOptionModule
      isCertificateAvailable
      certificateTemplate
      resources {
        _id
        key
        location
      }
    }
  }
`;
