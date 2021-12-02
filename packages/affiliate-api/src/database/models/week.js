import mongoose from 'mongoose';

const Week = mongoose.model('Week', new mongoose.Schema({
	name: String,
	bootcamp: {
		type: mongoose.Types.ObjectId,
	}
}));

export default Week;