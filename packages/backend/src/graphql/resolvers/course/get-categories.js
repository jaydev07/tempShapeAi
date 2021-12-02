import { ApolloError } from "apollo-server-errors";
import CourseCategory from "../../../database/models/course-category";
export default async (parent) => {
	try {
		const categories = await CourseCategory.find({});
		return categories;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}