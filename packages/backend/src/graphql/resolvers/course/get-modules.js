import { ApolloError } from "apollo-server-errors";
import Course from '../../../database/models/course'
import Module from "../../../database/models/module";
import mongoose from 'mongoose';

export default async (parent, { ids, courseId }) => {
	try {
		let course, course_id = courseId;
		const courseQuery = { };
		if (course_id) {
			course = await Course.findById(courseId);
			course_id = course.origin || courseId;
			courseQuery['course'] = mongoose.Types.ObjectId(course_id);
			if (!course.isDraft) courseQuery['isPublished'] = true;
		}
		const query = course_id ? courseQuery : { _id: ids };
		return await Module.find(query).populate('units.unit');
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
	}
};
