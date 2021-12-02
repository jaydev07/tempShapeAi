import { gql } from "@apollo/client";

export const CREATE_NEW_TASK_QUERY = gql`
  mutation createTask($task: TaskInput) {
    createTask(task: $task) {
      _id
      name
      description
      course
      module
      type
      points
      details {
        _id
        content
      }
    }
  }
`;
