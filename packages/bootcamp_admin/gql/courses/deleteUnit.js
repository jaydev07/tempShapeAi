import { gql } from "@apollo/client";

export const DELETE_UNIT_QUERY = gql`
  mutation deleteTask($id: String) {
    deleteTask(id: $id)
  }
`;
