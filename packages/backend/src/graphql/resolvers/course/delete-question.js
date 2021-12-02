import { ApolloError } from "apollo-server-errors";
import Question from '../../../database/models/quiz/question';
import Quiz from '../../../database/models/quiz/quiz';

export default async (parent, { id }) => {
	try {
		const ques = await Question.findByIdAndDelete(id);
		await Quiz.findByIdAndUpdate(ques.quiz,{
			$pull: {
				questions: id,
			},
		});
		return true;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}
