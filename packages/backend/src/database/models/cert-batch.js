import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
	certificateTemplate: {
		type: mongoose.Types.ObjectId,
		ref: 'CertificateTemplate',
	},
	csv: {
		type: String,
		required: true,
	},
	erroredEntries: [{
		email: String,
		code: String,
		message: String,
	}],
	emailBody: String,
	totalEntries: Number,
	status: {
		type: String,
		enum: ['created', 'processing', 'completed'],
		default: 'created',
	},
	completedCount: {
		type: Number,
		default: 0,
	}
}, {
	timestamps: true,
});

const CertificateBatch = mongoose.model('CertificateBatch', batchSchema);
export default CertificateBatch;