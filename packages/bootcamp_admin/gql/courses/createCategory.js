import { gql } from "@apollo/client";

export const CREATE_CATEGORIES_QUERY  = gql`
  mutation createCategory($name: String) {
    createCategory(name: $name) {
      name
      _id
    }
  }
`;
