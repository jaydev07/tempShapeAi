import { ApolloError } from "apollo-server-errors";
import CourseTracker from "../../../database/models/course-tracker";
import mongoose from 'mongoose';
export default async (parent, { course }, { user }) => {
	try {
	return await CourseTracker.findOne({
		user: user._id,
		course: mongoose.Types.ObjectId(course),
	}).populate('moduleTrackers');
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}