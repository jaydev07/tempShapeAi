import gql from 'graphql-tag';

export default gql`
    input UploadReqParams {
        filename: String!
        contentType: String!
    }

    type UploadSuccess {
        objectUrl: String
        signedUrl: String
        filename: String
        key: String
    }

    enum UploadPurpose {
        courseImage
        courseResources
        userProfile
        certificateTemplate
        certBatchCSV
    }

    extend type Mutation {
        """
        Get S3 signedUrl/s to upload files/s
        """
        getPublicUploadSignedUrl( purpose: UploadPurpose files: [UploadReqParams] ): [UploadSuccess]
    }

`;
