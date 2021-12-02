import { gql } from "@apollo/client";

export const GET_MODULE_TRACKER = gql`
  mutation getModuleTracker($id: String) {
    getModuleTracker(id: $id) {
      _id
      module
      user
      courseTracker
      unitsCompleted
      percentageCompleted
    }
  }
`;
