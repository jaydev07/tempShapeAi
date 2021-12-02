import gql from "graphql-tag";

export default gql`
  scalar Date
  scalar Time
  scalar DateTime

  type Image {
    key: String
    location: String
    contentType: String
    bucket: String
  }

  type File {
    _id: String
    key: String!
    location: String!
    name: String
  }

  input ImageInput {
    key: String!
    location: String!
    name: String
  }
  type Str {
    value: String
  }
`;
