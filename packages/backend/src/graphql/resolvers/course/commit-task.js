import { ApolloError } from "apollo-server-errors";
import Commit from '../../../database/models/commit';
import Activity from '../../../database/models/activities/activity';
import CourseTask from '../../../database/models/course-task';
import ModuleTracker from '../../../database/models/module-tracker';
import Module from '../../../database/models/module';
import CourseTracker from '../../../database/models/course-tracker';
import { updateModuleTrackerAndGetNextUnit } from './helpers';
import CertificateTemplate from '../../../database/models/certificate-template';
import {unique} from 'shorthash';
import UserCertificate from '../../../database/models/user-certificate';
import {genCert} from '../../../cert-generator';

export default async (parent, { id }, { user }) => {
	try {
		const task = await CourseTask.findById(id)
			.populate('module')
			.populate('course');
		let { module, course } = task;
		let commit = await Commit.create({
			course: task.course,
			task: task._id,
			user: user._id,
		});
		await Activity.create({
			user: user._id,
			type: 'Commit',
			details: commit._id,
			points: task.points,
		});
		const ct = await CourseTracker.findOne({ user: user._id, rootCourse: course._id })
			.populate('moduleTrackers');
		let moduleTracker = await ModuleTracker.findOne({
			module: module._id,
			user: user._id,
		});
		if (!moduleTracker) {
			moduleTracker = await ModuleTracker.create({
				module: module._id,
				user: user._id,
				course: id,
				courseTracker: ct._id,
				hasOptions: module.isProjectModule,
			})
		}
		const nextTask = await updateModuleTrackerAndGetNextUnit(id, module, moduleTracker, user._id, ct);
		if (!nextTask) {
			ct.isCompleted = true;
			ct.currentTask = null;
			ct.currentModule = null;
			user.enrolledCourseId = '';
			await ct.save();
			if (!ct.certificateGenerated) {
				let certificateTemplate = await CertificateTemplate.findOne({name: 'course'});
				if (!certificateTemplate) certificateTemplate = await CertificateTemplate.findOne();
				
				const credentialId = unique(`${user._id}-${course._id}`);
				let certificate = await UserCertificate.findOne({
					credentialId,
				});
				if (!certificate)
					certificate = await UserCertificate.create({
						user: user._id,
						credentialId,
						template: certificateTemplate._id,
						course: course._id,
						accomplishmentType: "course",
					});
				certificate = await genCert(certificateTemplate, certificate, credentialId, user, 'course');
				ct.certificateGenerated = true;
				ct.certificate = certificate._id;
				await ct.save();
			}
			return await CourseTracker.findOne({ user: user._id, rootCourse: course._id })
				.populate('moduleTrackers');
		}
		ct.currentTask = nextTask._id;
		ct.currentModule = nextTask.module;
		await ct.save();
		return await CourseTracker.findOne({ user: user._id, rootCourse: course._id })
			.populate('moduleTrackers');
		
	} catch (e) {
		console.log(e);
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}
