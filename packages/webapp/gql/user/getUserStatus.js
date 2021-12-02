import { gql } from '@apollo/client';

export const GET_CURRENT_USER_STATUS = gql`
	query getCurrentUserStatus {
			getUserStatus {
					hasSubmittedInitForm
			}
	}
`;