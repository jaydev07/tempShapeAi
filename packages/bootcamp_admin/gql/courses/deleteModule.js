import { gql } from "@apollo/client";

export const DELETE_MODULE_QUERY = gql`
  mutation deleteModule($id: String) {
    deleteModule(id: $id)
  }
`;
