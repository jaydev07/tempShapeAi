import { ApolloError } from "apollo-server-errors";
import Question from '../../../database/models/quiz/question';

export default async (parent, { question, id }) => {
	try {
		return await Question.findByIdAndUpdate(id, question)
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}