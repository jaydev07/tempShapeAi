import mongoose from 'mongoose';

const bootcampSchema = new mongoose.Schema({
	name: String,
	description: String,
});

const Bootcamp = mongoose.model('Bootcamp', bootcampSchema);
export default Bootcamp;