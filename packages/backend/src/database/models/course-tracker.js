import mongoose from 'mongoose';
const courseTrackerSchema = new mongoose.Schema({
	course: {
		type: mongoose.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	courseId: {
		type: String,
		required: true,
	},
	rootCourse: {
		type: mongoose.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	courseVersion: {
		type: Number,
		required: true,
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	percentageCompleted: {
		type: Number,
		default: 0,
	},
	currentModule: {
		type: mongoose.Types.ObjectId,
		ref: 'Module',
	},
	currentTask: {
		type: mongoose.Types.ObjectId,
		ref: 'CourseTask',
	},
	isCompleted: {
		type: Boolean,
		default: false,
	},
	completionDate: {
		type: Date,
	},
	moduleTrackers: [{
		type: mongoose.Types.ObjectId,
		ref: 'ModuleTracker'
	}],
	certificateGenerated: {
		type: Boolean,
		default: false,
	},
	certificate: {
		type: mongoose.Types.ObjectId,
		ref: 'UserCertificate'
	},
}, {
	timestamps: true,
});

const CourseTracker = mongoose.model('CourseTracker', courseTrackerSchema);
export default CourseTracker;
