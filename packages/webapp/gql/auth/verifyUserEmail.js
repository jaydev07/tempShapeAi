import { gql } from '@apollo/client';

export const  VERIFY_USER_EMAIL = gql`
	mutation verifyUserEmail($token: String) {
      verifyUserEmail(token: $token)
	}
`;