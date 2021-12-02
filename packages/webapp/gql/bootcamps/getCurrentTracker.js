import { gql } from "@apollo/client";

export const GET_CURRENT_TRACKER_QUERY = gql`
  query getCurrentTracker {
    getCurrentTracker {
      course
      courseId
      currentModule
      currentTask
      isCompleted
      createdAt
      moduleTrackers {
        module
        user
        courseTracker
        unitsCompleted
        percentageCompleted
      }
      completionDate
    }
  }
`;
