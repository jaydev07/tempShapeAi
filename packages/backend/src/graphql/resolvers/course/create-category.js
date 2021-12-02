import { ApolloError } from "apollo-server-errors";
import CourseCategory from "../../../database/models/course-category";
export default async (parent, { name }) => {
	try {
		const category = await CourseCategory.create({ name });
		return category;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}