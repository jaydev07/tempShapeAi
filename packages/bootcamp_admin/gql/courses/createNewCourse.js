import { gql } from "@apollo/client";

export const CREATE_NEW_COURSE_QUERY = gql`
  mutation createCourse($course: CourseInput) {
    createCourse(course: $course) {
      Id
      _id
      name
      description
      prerequisites
      type
      tags
      image {
        key
        location
      }
      modules {
        name
        description
        course
      }
      views
      skills
      category
      _id
    }
  }
`;
