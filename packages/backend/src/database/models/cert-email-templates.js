import mongoose from 'mongoose';
const schema = new mongoose.Schema({
	name: String,
	body: String,
	markdown: String
});

const CertificateEmailTemplate = new mongoose.model('CertificateEmailTemplate', schema);
export default CertificateEmailTemplate;