import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
	quiz: {
		type: mongoose.Types.ObjectId,
		ref: 'Quiz',
		
	},
	question: String,
	answers: [{
		optionNumber: Number,
		answerBody: String,
	}],
	correctAnswers: [Number]
});

const Question = mongoose.model('Question', questionSchema);
export default Question;
