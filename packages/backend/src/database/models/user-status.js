import mongoose from 'mongoose';

const statusSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	hasSubmittedInitForm: {
		type: Boolean,
		default: false,
	},
});

const UserStatus = mongoose.model('UserStatus', statusSchema);
export default UserStatus;