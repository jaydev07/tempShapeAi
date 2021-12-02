import mongoose from 'mongoose';

const quizSubmissionSchema = new mongoose.Schema({
	quizId: {
		type: mongoose.Types.ObjectId,
		ref: 'Quiz',
	},
	submittedAnswers: [{
		question :{
			type: mongoose.Types.ObjectId,
			ref: 'Question',
		},
		answers: [Number]
	}],
	percentage: Number,
});

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);
export default QuizSubmission;