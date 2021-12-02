import mongoose from 'mongoose';
const schema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		index: true,
	}
}, {
	timestamps: true,
});

const AllowedEmail = mongoose.model('AllowedEmail', schema);
export default AllowedEmail;