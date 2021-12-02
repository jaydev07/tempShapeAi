import { ApolloError } from "apollo-server-errors";
import CourseTask from '../../../database/models/course-task';
import Quiz from '../../../database/models/quiz/quiz';
import QuizSubmission from '../../../database/models/quiz/quiz-submission';


export default async (parent, { id, answers }) => {
	try {
	const task = await CourseTask.findById(id).populate({
		path: 'details',
		populate: {
			path: 'questions'
		}
	});
	const quiz = task.details;
	const submission = new QuizSubmission({
		quiz: quiz._id,
		submittedAnswers: answers,
	});
		return true;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}