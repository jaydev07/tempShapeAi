import { gql } from '@apollo/client'

export const SEND_SES_VERIFICATION = gql`
    mutation sendSESVerification($email: String!) {
        sendSESVerification(email: $email)
    }

`;