import { gql } from "@apollo/client";

export const GET_TASK_DATA_QUERY = gql`
  query getTask($id: String) {
    getTask(id: $id) {
      _id
      name
      description
      course
      module
      type
      points
      details {
        content
        type
        questions {
          _id
          question
          answers {
            optionNumber
            answerBody
          }
          correctAnswers
        }
        _id
      }
    }
  }
`;
