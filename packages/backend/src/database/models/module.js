import mongoose from 'mongoose';
const resourceSchema = new mongoose.Schema({
	name: String,
	key: String,
	location: String,
});

const moduleSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	description: String,
	course: {
		type: mongoose.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	units: [{
		type: {
			type: String,
			enum: ['Module', 'CourseTask'],
			required: true,
		},
		unit: {
			type: mongoose.Types.ObjectId,
			refPath: 'units.type',
			required: true,
		},
		_id: false,
	}],
	moduleOptions: [{
		type: mongoose.Types.ObjectId,
		ref: 'Module',
	}],
	isProjectModule: {
		type: Boolean,
		default: false,
	},
	isOptionModule: {
		type: Boolean,
		default: false,
	},
	isSub: {
		type: Boolean,
		default: false,
	},
	parentModule: {
		type: mongoose.SchemaTypes.ObjectId,
		ref: 'Module',
	},
	isPublished: {
		type: Boolean,
		default: false,
	},
	isCertificateAvailable: {
		type: Boolean,
		default: false,
	},
	certificateTemplate: {
		type: mongoose.Types.ObjectId,
		ref: 'CertificateTemplate',
	},
	resources: [resourceSchema],
	
})
const Module = new mongoose.model('Module', moduleSchema);
export default Module;