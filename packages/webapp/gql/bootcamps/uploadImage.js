import { gql } from "@apollo/client";

export const UPLOAD_IMAGE_QUERY = gql`
  mutation getS3SignedKey($purpose: UploadPurpose, $files: [UploadReqParams]) {
    getPublicUploadSignedUrl(purpose: $purpose, files: $files) {
      filename
      key
      objectUrl
      signedUrl
    }
  }
`;
