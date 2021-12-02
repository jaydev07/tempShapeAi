import { ApolloError } from "apollo-server-errors";
import Course from "../../../database/models/course";
export default async (parent, params) => {
	try {
		const course = await Course
			.findOne(params)
			.populate('modules');
		return course;
		
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}