import mongoose from 'mongoose';
const { Types } = mongoose;

const certSchema = new mongoose.Schema({
	user: {
		type: Types.ObjectId,
		ref: 'User',
		index: true,
	},
	userFullName: String,
	purposeName: String,
	userEmail: String,
	credentialId: {
		type: String,
		unique: true,
		index: true,
	},
	template: {
		type: Types.ObjectId,
		ref: 'CertificateTemplate',
		required: true,
	},
	course: {
		type: Types.ObjectId,
		ref: 'Course',
	},
	accomplishmentType: {
		type: String,
		required: true,
		enum: ['course', 'module', 'bootcamp'],
	},
	module: {
		type: Types.ObjectId,
		ref: 'Module',
	},
	status: {
		type: String,
		enum: ['enqueued', 'generated'],
	},
	pdfUrl: String,
	imgUrl: String,
	creationType: {
		type: String,
		enum: ['auto', 'manual'],
	},
	mailSent: {
		type: Boolean,
		default: false,
	}
}, {
	timestamps: true,
});

const UserCertificate = mongoose.model('UserCertificate', certSchema);
export default UserCertificate;