import { gql } from '@apollo/client';

export const SET_USER_STATUS_QUERY =  gql`
	mutation updateUserState($hasSubmittedInitForm: Boolean) {
			setUserStatus(hasSubmittedInitForm: $hasSubmittedInitForm) {
					hasSubmittedInitForm
			}
	}
	`;