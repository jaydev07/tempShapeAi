import { gql } from "@apollo/client";

export const LOGIN_USER_QUERY = gql`
    mutation login($email: String!, $password: String!) {
        login(email: $email, password: $password) {
            token
            user {
                name {
                    firstName
                    lastName
                }
                _id
                email
                enrolledCourseId
                type
                isVerified
                xp
            }
        }
    }
`;
