import { gql } from "@apollo/client";

export const DELETE_QUIZ_QUERY = gql`
  mutation deleteQuestion($id: String) {
    deleteQuestion(id: $id)
  }
`;
