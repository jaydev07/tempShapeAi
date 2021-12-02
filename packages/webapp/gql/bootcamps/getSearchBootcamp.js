import { gql } from "@apollo/client";

export const GET_SEARCH_COURSES_DATA_QUERY = gql`
  query getCourses($query: CourseQuery) {
    getCourses(query: $query) {
      courses {
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
          description
          course
          units {
            type
          }
        }
        views
        skills
      }
      hasNextPage
      hasPrevPage
      page
      totalPages
      nextPage
      prevPage
    }
  }
`;
