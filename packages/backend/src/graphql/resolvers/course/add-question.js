import { ApolloError } from "apollo-server-errors";
import Question from "../../../database/models/quiz/question";
import Quiz from "../../../database/models/quiz/quiz";

export default async (parent, { questions, quizId }) => {
  try {
    questions.forEach((q) => (q.quiz = quizId));
    const questionsInserted = await Question.insertMany(questions);
    await Quiz.findByIdAndUpdate(quizId, {
      $addToSet: {
        questions: questionsInserted.map((q) => q._id),
      },
    });
    return questionsInserted;
  } catch (e) {
    throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
  }
};
