import createCourse from './create-course';
import createCategory from './create-category';
import getCategories from './get-categories';
import createModule from './create-module'
import getCourse from "./get-course";
import getCourses from "./get-courses";
import createTask from './create-task';
import updateDocumentContent from './update-doc-content';
import getModules from './get-modules';
import getTask from './get-task';
import updateCourseDetails from './update-course-details';
import updateQuestion from './update-question'
import deleteQuestion from './delete-question';
import updateModuleDetails from './update-module';
import deleteModule from './delete-module';
import addQuestions from './add-question';
import publishCourse from './publish-course';
import changeCourseArchiveStatus from './change-archive-status';
import deleteTask from './delete-task';
import commitTask from './commit-task';
import enrollCourse from './enroll-course';
import getCourseTracker from './get-course-tracker';
import submitQuiz from './submit-quiz';
import getHeatmapData from './get-heatmap-data';
import getCurrentTracker from './get-current-tracker';
import updateModuleResources from './update-module-resources';
import getModuleTracker from './get-moduletracker';
import getCourseTotalPoints from './get-course-total-points';

export default {
	Mutation: {
		createCourse,
		createCategory,
		createModule,
		createTask,
		updateDocumentContent,
		updateCourseDetails,
		updateQuestion,
		deleteQuestion,
		updateModuleDetails,
		deleteModule,
		addQuestions,
		publishCourse,
		changeCourseArchiveStatus,
		deleteTask,
		commitTask,
		enrollCourse,
		submitQuiz,
		updateModuleResources,
		getModuleTracker,
	},
	Query: {
		getCategories,
		getCourse,
		getCourses,
		getModules,
		getTask,
		getCourseTracker,
		getHeatmapData,
		getCurrentTracker,
		getCourseTotalPoints,
	}
};
