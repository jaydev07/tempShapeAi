import mongoose from 'mongoose';
const CourseView = mongoose.model('CourseView', new mongoose.Schema({
	course: {
		type: mongoose.Types.ObjectId,
		ref: 'Course',
		required: true,
	},
	user: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
		required: true,
	}
}, {
	timestamps: true,
}));

export default CourseView;