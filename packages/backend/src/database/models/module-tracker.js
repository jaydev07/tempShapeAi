import mongoose from 'mongoose';
const moduleTrackerSchema = new mongoose.Schema({
	module: {
		type: mongoose.Types.ObjectId,
		ref: 'Module',
		required: true,
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	courseTracker: {
		type: mongoose.Types.ObjectId,
		ref: 'CourseTracker',
		required: true,
	},
	unitsCompleted: [{
		type: mongoose.Types.ObjectId,
	}],
	percentageCompleted: {
		type: Number,
		default: 0,
	},
	hasOptions: {
		type: Boolean,
		default: false,
	},
	// to be set to 'selected' option if the module has options,
	// null if the module has no options
	selectedOption: {
		type: mongoose.Types.ObjectId,
		ref: 'Module',
	},
	certificateGenerated: {
		type: Boolean,
		default: false,
	},
	certificate: {
		type: mongoose.Types.ObjectId,
		ref: 'UserCertificate',
	},
});

const ModuleTracker = mongoose.model('ModuleTracker', moduleTrackerSchema);
export default ModuleTracker;