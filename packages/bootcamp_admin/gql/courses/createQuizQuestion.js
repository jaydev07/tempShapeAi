import { gql } from "@apollo/client";

export const CREATE_NEW_QUIZ_QUESTION_QUERY = gql`
  mutation addQuestions($questions: [QuestionInput], $quizId: String) {
    addQuestions(questions: $questions, quizId: $quizId) {
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
