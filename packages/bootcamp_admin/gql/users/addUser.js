import { gql } from '@apollo/client';

export const ADD_USER_QUERY = gql`
	mutation createAdminUser($email: String! $password: String! $type: UserType!) {
      createAdminUser(email: $email password: $password type: $type) {
		      _id
      }
	}
`;