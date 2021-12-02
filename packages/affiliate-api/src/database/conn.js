import mongoose from 'mongoose';

export default () => {
	return mongoose.connect(process.env.DB_PATH, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
}