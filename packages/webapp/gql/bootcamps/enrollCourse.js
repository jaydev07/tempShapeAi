import { gql } from "@apollo/client";

export const ENROLL_COURSE_QUERY = gql`
  mutation enrollCourse($id: String) {
    enrollCourse(id: $id)
  }
`;
