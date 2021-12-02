import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	parent:{
		type: mongoose.Types.ObjectId,
		ref: 'CourseTask'
	},
	content: String,
	attachments: [],
	type: {
		type: String,
		enum: ['Document', 'Project'],
		default: 'Document',
	},
});

const DocumentTask = mongoose.model('DocumentTask', schema);
export default DocumentTask;
