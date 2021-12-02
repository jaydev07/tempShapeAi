import { gql } from "@apollo/client";

export const REGISTER_USER_QUERY = gql`
  mutation register($user: RegisterUserInput) {
    register(user: $user) {
      user {
        name {
          firstName
          lastName
        }
        _id
        email
        enrolledCourseId
        
        isVerified
        xp
      }
      token
    }
  }
`;
