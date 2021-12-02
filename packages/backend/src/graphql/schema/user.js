import gql from 'graphql-tag';

export default gql`
    input FullNameInput {
        firstName: String
        lastName: String
    }

    type FullName {
        firstName: String!
        lastName: String
    }
    input RegisterUserInput {
        """
        FirstName of the user
        """
        name: FullNameInput
        """
        email of the user
        """
        email: String!
        """
        password of the user
        """
        password: String
        """
        Phone number of the user
        """
        phone: String!
    }
    input userUpdateInput {
        """
        FirstName of the user
        """
        name: FullNameInput
        """
				profile picture
        """
		    profilePicture: ImageInput
    }
    type User {
        """
        _id of the user
        """
        _id: String
        """
        FirstName of the user
        """
        name: FullName
        """
        email of the user
        """
        email: String!
        """
        Custom Id of the currently enrolled course
        """
        enrolledCourseId: String
        """
        profile picture
        """
        profilePicture: Image
        """
        xp of the user
        """
        xp: Int
        """
        Verification status of the user
        """
        isVerified: Boolean
        """
        User type
        """
        type: String
    }
    type emailRes {
        sent: Boolean
        code: String
    }
    type UserStatus {
        user: String
        hasSubmittedInitForm: Boolean
    }
    enum UserType {
        superAdmin
        certAdmin
        student
    }
    extend type Mutation {
		    updateUserProfile (userUpdateInput: userUpdateInput): User
        resendVerificationEmail: emailRes
        setUserStatus(hasSubmittedInitForm: Boolean): UserStatus
        createAdminUser(email: String! password: String! type: UserType!): User
        updatePassword(password: String!): Boolean
        sendSESVerification(email: String!): Boolean
        
    }
    
    extend type Query {
        getCurrentUser: User
        getUserStatus: UserStatus
        getAdmins: [User]
        getSESVerifiedEmails: [String]
    }
`;