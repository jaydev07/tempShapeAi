import mongoose from 'mongoose';

const projectTaskSchema = new mongoose.Schema({
	parent:{
		type: mongoose.Types.ObjectId,
		ref: 'CourseTask'
	},
	projectOptions: [{
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'DocumentTask',
	}],
});

const ProjectTask = mongoose.model('ProjectTask', projectTaskSchema);
export default ProjectTask;
