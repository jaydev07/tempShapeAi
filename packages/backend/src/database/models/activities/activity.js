import mongoose from 'mongoose';
import User from '../user';

const activitySchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	type: {
		type: String,
		enum: ['Commit', 'Login', 'SignUp'],
		required: true,
	},
	details: {
		type: mongoose.Types.ObjectId,
		refPath: 'type',
	},
	points: {
		type: Number,
		default: 0,
	}
}, {
	timestamps: true,
});

activitySchema.post('save', async function () {
	if (this.points !== 0)
	await User.findByIdAndUpdate(this.user, {
		$inc: {
			xp: this.points,
		}
	});

});

const Activity = mongoose.model('Activity', activitySchema);
export default Activity;