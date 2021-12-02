import { ApolloError } from "apollo-server-errors";
import CourseTracker from "../../../database/models/course-tracker";

export default async (parent, {}, { user }) => {
	try {
		return await CourseTracker.findOne({
			user: user._id,
			courseId: user.enrolledCourseId,
		}).populate('moduleTrackers');
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}