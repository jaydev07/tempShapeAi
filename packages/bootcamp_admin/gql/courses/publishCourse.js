import { gql } from "@apollo/client";

export const PUBLISH_COURSE_QUERY = gql`
  mutation publishCourse($id: String) {
    publishCourse(id: $id) {
      name
      Id
      _id
    }
  }
`;
