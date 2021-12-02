import { gql } from "@apollo/client";

export const GET_COURSE_TRACKER_QUERY = gql`
  query getCourseTracker($course: String) {
    getCourseTracker(course: $course) {
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
      }
      createdAt
    }
  },
`;
