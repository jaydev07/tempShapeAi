import CourseTask from '../../../database/models/course-task';
import Module from '../../../database/models/module';
import ModuleTracker from '../../../database/models/module-tracker';
import Course from '../../../database/models/course';

export const getNextTask = async (unit) => {
	// console.log('getNextTask', { unit })
	if (unit.type === 'CourseTask') {
		const nextTask = await CourseTask.findById(unit.unit);
		// console.log('Found next Task', { nextTask });
		return nextTask;
	}
		// console.log('not a task', unit)
		const nextUnit = await findNextPublishedUnit(unit);
		// console.log({ nextUnit })
		return getNextTask(nextUnit);
};


const getNextParentModuleWithCurrentModule = (module) => {
	// the module passed should have course and its modules populated
	// console.log('not sub', { module }, module.course.modules);
	const { course } = module;
	const mod = course.modules.findIndex(mod => mod._id.equals(module._id));
	// console.log({ mod });
	const searchStartIndex = mod + 1;
	const nextModule = course.modules.slice(searchStartIndex).findIndex(m => m.isPublished);
	// console.log({ nextModule });
	if (nextModule === -1) return null;
	return course.modules[nextModule];
	// return course.modules[nextModule].units[0];
	
}

const findNextPublishedUnit = async (module) => {
	// takes a moduleId, returns module if it's published
	// else checks for next published module recursively
	
	if (module.type === 'Module') module = await Module.findById(module.unit)
		.populate({
		path: 'course',
		populate: {
			path: 'modules',
		},
	});
	// console.log('findNextPublishedUnit', { module });
	if (module.isPublished) return module.units[0];
	if (module.isSub) {
			// search for next published module at the same level
			const parentModule = await Module.findById(module.parentModule).populate('units');
		// console.log({ parentModule }, parentModule.units[0]);
			const searchIndex = parentModule.units.findIndex(m => {
				// console.log({m}, module._id);
				return m.unit.equals(module._id)
			});
			const nextUnit = parentModule.units.slice(searchIndex).findIndex(u => u.type === 'CourseTask' || u.isPublished);
		// console.log('-=-=-=-=-=-=-=-=-=-=\n',parentModule.units[nextUnit])
			if (nextUnit === -1) {
				if (parentModule.isSub) return findNextPublishedUnit(await Module.findById(parentModule.parentModule))
				const nextMainModule = getNextParentModuleWithCurrentModule(module);
				if (!nextMainModule) return null;
				return findNextPublishedUnit(nextMainModule);
			}
			return parentModule.units[nextUnit];
		} else {
		const nextMainModule = getNextParentModuleWithCurrentModule(module);
		if (!nextMainModule) return null;
			return nextModule.units[0];
		}
}

export const updateModuleTrackerAndGetNextUnit = async (unitId, module, moduleTracker, userId, ct) => {
	// console.log('updateModuleTrackerAndGetNextUnit - enter', unitId, module)
	moduleTracker.unitsCompleted.push(unitId);
	moduleTracker.percentageCompleted = (moduleTracker.unitsCompleted.length / module.units.length) * 100;
	await moduleTracker.save();
	// console.log(module._id, moduleTracker.percentageCompleted);
	if (moduleTracker.percentageCompleted >= 100) {
		if (module.isSub) {
			// console.log('completed. in iSub')
			// console.log('updateModuleTrackerAndGetNextUnit - isSub, updating parent module')
			let parentModule = await Module.findById(module.parentModule);
			let parentModuleTracker = await ModuleTracker.findOne({
				module: parentModule._id,
				user: userId,
			});
			// console.log('Found parent module', parentModule, 'adding', module._id, ' to completed units');
			return await updateModuleTrackerAndGetNextUnit(module._id, parentModule, parentModuleTracker, userId, ct);
		} else {
			// console.log('completed. in Main')
			// console.log('Parent module', module._id, ' completed, getting next main module')
			const course = await Course.findById(ct.course).populate('modules');
			// console.log('=-=-=-=-=-=-=-=-=-=-====----',{ course },course.modules);
			const mod = course.modules.findIndex(mod => mod._id.equals(module._id));
			// console.log('0-0-0-0-0-0-=0-0-0-0-0-0-0-0\n', { mod })
			const searchStartIndex = mod + 1;
			const nextModule = course.modules.slice(searchStartIndex).find(m => m.isPublished);
			if (!nextModule) return null;
			else {
				// console.log('Next Module found', nextModule);
				return await getNextTask(nextModule.units[0]);
			}
		}
	} else {
		
		// console.log('Module is not completed 100% percent, fetching next task from next unit', module.units[moduleTracker.unitsCompleted.length]);
		return await getNextTask(module.units[moduleTracker.unitsCompleted.length]);
	}
};
