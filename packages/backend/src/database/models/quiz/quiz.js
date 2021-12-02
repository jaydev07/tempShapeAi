import mongoose from 'mongoose';
const quizSchema = new mongoose.Schema({
	parent: {
		type: mongoose.Types.ObjectId,
		ref: 'CourseTask',
	},
	questions: [{
		type: mongoose.Types.ObjectId,
		ref: 'Question',
	}],
});

const Quiz = mongoose.model('Quiz', quizSchema);
export default Quiz;
