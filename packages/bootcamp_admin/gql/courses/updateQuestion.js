import { gql } from "@apollo/client";

export const UPDATE_QUIZ_QUERY = gql`
  mutation updateQuestion($id: String, $question: QuestionInput) {
    updateQuestion(id: $id, question: $question) {
      _id
      question
      answers {
        optionNumber
        answerBody
      }
      correctAnswers
    }
  }
`;
