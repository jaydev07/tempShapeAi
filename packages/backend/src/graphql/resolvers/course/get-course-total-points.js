import { ApolloError } from 'apollo-server-errors';
import CourseTask from '../../../database/models/course-task';
import Course from '../../../database/models/course';
import { Types } from 'mongoose';

export default async (parent, { courseId }, { user }) => {
	try {
		const course = await Course.findById(courseId).select('origin').lean();
		const courseTasks = await CourseTask.find({ course: course.origin || course._id }).select('points').lean();
		return courseTasks.reduce((a, b) => a + b.points, 0);
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}