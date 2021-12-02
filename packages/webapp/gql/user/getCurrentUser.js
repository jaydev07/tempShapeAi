import { gql } from "@apollo/client";

export const GET_CURRENT_USER_QUERY = gql`
  query getCurrentUser {
    getCurrentUser {
      name {
        firstName
        lastName
      }
      _id
      email
      enrolledCourseId
      profilePicture {
        key
        location
      }
      isVerified
      xp
    }
  }
`;
