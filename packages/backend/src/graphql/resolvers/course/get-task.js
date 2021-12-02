import {ApolloError} from "apollo-server-errors";
import CourseTask from "../../../database/models/course-task";

export default async (parent, { id }) => {
	try {
		return await CourseTask.findById(id).populate({
			path: 'details',
			populate: {
				path: 'questions'
			}
		});
	} catch (e) {
		throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
	}
};
