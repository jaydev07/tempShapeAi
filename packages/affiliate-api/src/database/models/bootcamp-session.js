import mongoose from 'mongoose';

const BootcampSession = mongoose.model('BootcampSession', new mongoose.Schema({
	name: String,
	type: String,
	day: {
		type: mongoose.Types.ObjectId,
		ref: 'Day',
	},
	week: {
		type: mongoose.Types.ObjectId,
		ref: 'Week',
	},
	bootcamp: {
		type: mongoose.Types.ObjectId,
		ref: 'Bootcamp',
	}
}));

export default BootcampSession;