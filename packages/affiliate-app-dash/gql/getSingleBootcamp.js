import { gql } from "@apollo/client";

export const GET_SINGAL_BOOTCAMPS_QUERY = gql`
  query getCourse($Id: String, $_id: String, $isDraft: Boolean) {
    getCourse(Id: $Id, _id: $_id, isDraft: $isDraft) {
      Id
      _id
      name
      description
      prerequisites
      type
      tags
      category
      image {
        key
        location
      }
      modules {
        name
      }
      views
      skills
    }
  }
`;
