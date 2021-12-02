import { gql } from "@apollo/client";

export const GET_INDIVIDUAL_COURSE_DATA_QUERY = gql`
  query getCourse($_id: String) {
    getCourse(_id: $_id) {
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
      views
      skills
      isArchived
      updatedAt
      createdAt
      publishedAt
    }
  }
`;
