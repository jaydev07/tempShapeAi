import mongoose from 'mongoose';
import moment from 'moment';

const commitSchema = new mongoose.Schema({
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	task: {
		type: mongoose.Types.ObjectId,
		ref: 'CourseTask',
		required: true,
	},
	course: {
		type: mongoose.Types.ObjectId,
		ref: 'Course',
		required: true,
	}
}, {
	timestamps: true,
});

commitSchema.statics.getUserStreak = async (userId) => {
		let streak = 0;
		while (true) {
			const date = moment(new Date(moment().subtract(streak, 'days')._d));
			const commit = await Commit.findOne({
				user: mongoose.Types.ObjectId(userId),
				createdAt: {
					$gte: date.startOf('day').toDate(),
					$lte: moment(date).endOf('day').toDate(),
				}
			})
			if(!commit) break;
			streak ++;
		}
		return streak;
}

const Commit = mongoose.model('Commit', commitSchema);
export default Commit;