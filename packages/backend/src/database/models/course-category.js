const mongoose = require('mongoose');
const categorySchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
	},
	priority: {
		type: Number,
		default:0,
	},
	courses: [{ type: mongoose.Types.ObjectId, ref: 'Course' }],
});

module.exports = mongoose.model('CourseCategory', categorySchema);