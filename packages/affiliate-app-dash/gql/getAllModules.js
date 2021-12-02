import { gql } from "@apollo/client";

export const GET_ALL_MODULES_QUERY = gql`
  query getModules($courseId: String, $ids: [String]) {
    getModules(courseId: $courseId, ids: $ids) {
      _id
      name
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
      isSub
      parentModule
      description
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
