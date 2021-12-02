import mongoose from 'mongoose';

const courseTaskSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	course: {
		type: mongoose.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	module: {
		type: mongoose.Types.ObjectId,
		ref: 'Module',
		required: true,
	},
	type: {
		type: String,
		enum: ['DocumentTask', 'ProjectTask', 'Quiz'],
		required: true,
	},
	details: {
		type: mongoose.Types.ObjectId,
		refPath: 'type',
		required: true,
	},
	points: {
		type: Number,
		default: 5,
		required: true,
	},
});

const CourseTask = mongoose.model('CourseTask', courseTaskSchema);
export default CourseTask;