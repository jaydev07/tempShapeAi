import { gql } from "@apollo/client";

export const UPDATE_UNIT_QUERY = gql`
  mutation updateDocumentContent($id: String!, $content: String!) {
    updateDocumentContent(id: $id, content: $content)
  }
`;
