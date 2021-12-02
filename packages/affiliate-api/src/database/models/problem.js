import mongoose from 'mongoose';

const Problem = mongoose.model('Problem', new mongoose.Schema({
	title: String,
	description: String,
	statement: String,
	solutionLink: String,
	day: {
		type: mongoose.Types.ObjectId,
		ref: 'Day',
	}
}));

export default Problem;