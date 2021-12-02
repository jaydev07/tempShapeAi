import { gql } from "@apollo/client";

export const UPDATE_COURSE_QUERY = gql`
  mutation updateCourseDetails(
    $id: String!
    $name: String
    $prerequisites: String
    $tags: [String]
    $category: String
    $image: ImageInput
    $skills: [String]
  ) {
    updateCourseDetails(
      id: $id
      name: $name
      prerequisites: $prerequisites
      tags: $tags
      category: $category
      image: $image
      skills: $skills
    ) {
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
