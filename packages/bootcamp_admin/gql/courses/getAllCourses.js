import { gql } from "@apollo/client";

export const GET_ALL_COURSE_AND_CATEGORIES_QUERY = gql`
  query getCourses($page: Int, $query: CourseQuery) {
    getCategories {
      _id
      name
    }
    getCourses(page: $page, query: $query) {
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
