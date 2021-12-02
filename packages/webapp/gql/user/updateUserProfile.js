import { gql } from "@apollo/client";

export const UPDATE_USER_PROFILE_QUERY = gql`
  mutation updateUserProfile($userUpdateInput: userUpdateInput) {
    updateUserProfile(userUpdateInput: $userUpdateInput) {
      name {
        firstName
        lastName
      }
      email
      enrolledCourseId
    }
  }
`;
