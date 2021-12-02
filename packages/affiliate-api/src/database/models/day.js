import mongoose from 'mongoose';

const Day = mongoose.model('Day', new mongoose.Schema({
	name: String,
	bootcamp: {
		type: mongoose.Types.ObjectId,
		ref: 'Bootcamp',
	},
	week: {
		type: mongoose.Types.ObjectId,
		ref: 'Week',
	}
}));

export default Day;