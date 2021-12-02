import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		unique: true,
	},
	imageUrl: {
		type: String,
		required: true,
	},
	type: {
		type: String,
		required: true,
		enum: ['generic', 'custom'],
	},
	dimensions: {
		height: {
			type: Number,
			required: true,
		},
		width: {
			type: Number,
			required: true,
		},
	},
	tags: [{
		key: String,
		value: String,
	}],
	html: String,
});

const CertificateTemplate = mongoose.model('CertificateTemplate', templateSchema);
export default CertificateTemplate;