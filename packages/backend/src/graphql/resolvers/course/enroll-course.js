import { ApolloError } from "apollo-server-errors";
import Course from "../../../database/models/course";
import CourseTacker from "../../../database/models/course-tracker";
import ModuleTacker from "../../../database/models/module-tracker";
import User from '../../../database/models/user';
import { Types } from 'mongoose';
import { getNextTask } from './helpers';
import Module from '../../../database/models/module';
import CourseTask from '../../../database/models/course-task';

export default async (parent, { id }, { user }) => {
	try {
		const course = await Course.findOne({ _id: Types.ObjectId(id), isDraft: false})
			.populate('modules');
		user.enrolledCourseId = course.Id;
		await user.save();
		let ct = await CourseTacker.findOne({
			course: course._id,
			user: user._id,
		});
		if (ct) {
			return 'Course Re-Enrolled';
		} else {
			const firstModule = course.modules[0];
			const unit = firstModule.units[0].type === 'Module' ?  await Module.findById(firstModule.units[0].unit) : firstModule.units[0];
			const currentTask = await getNextTask(unit);
			const ct = new CourseTacker({
				user: user._id,
				course: id,
				rootCourse: course.origin,
				courseId: course.Id,
				courseVersion: course.__v,
				currentModule: currentTask.module,
				currentTask: currentTask._id,
			});
			// create all module trackers
			const courseModules = await Module.find({ course: course.origin, isPublished: true, });
			const moduleTrackers = courseModules.map(cm => ({
				module: cm._id,
				hasOptions: cm.isOptionModule,
				courseTracker: ct._id,
				user: user._id,
			}));
			const insertedModuleTrackers = await ModuleTacker.insertMany(moduleTrackers);
			ct.moduleTrackers = insertedModuleTrackers.map(i => i._id);
			await ct.save();
		}
		return 'Course Enrolled';
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}