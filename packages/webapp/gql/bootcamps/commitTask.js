import { gql } from "@apollo/client";

export const COMMIT_TASK_QUERY = gql`
  mutation commitTask($id: String) {
    commitTask(id: $id) {
      course
      courseId
      rootCourse
      courseVersion
      user
      currentModule
      currentTask
      isCompleted
      completionDate
      moduleTrackers {
        module
        user
        courseTracker
        unitsCompleted
        percentageCompleted
        certificateGenerated
        certificate
      }
      createdAt
    }
  }
`;
