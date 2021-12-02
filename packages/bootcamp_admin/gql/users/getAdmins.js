import { gql } from '@apollo/client';

export const GET_ADMINS_QUERY = gql`
    query getAdmins {
        getAdmins{
          email
		      type
        }
    }
`;