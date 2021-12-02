import gql from 'graphql-tag';

export default gql`
		type UserRes {
				user: User
				token: String
		}
		extend type Mutation {
        """
				Login user with email and password
        """
				login(email: String! password: String!): UserRes

        """
        Register user with email and password
        """
        register(user: RegisterUserInput): UserRes
				"""
				Verify User Email with token
				"""
				verifyUserEmail(token: String): Boolean
		}
`;