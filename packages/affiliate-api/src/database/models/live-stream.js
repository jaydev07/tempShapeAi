import mongoose from 'mongoose';

const schema = new mongoose.Schema({
	name: String,
	description: String,
	bootcamp: {
		type: mongoose.Types.ObjectId,
		ref: 'Bootcamp',
	},
	day: {
		type: mongoose.Types.ObjectId,
		ref: 'Day',
	},
	week: {
		type: mongoose.Types.ObjectId,
		ref: 'Week',
	},
	batch: {
		type: mongoose.Types.ObjectId,
		ref: 'Batch',
	},
	session: {
		type: mongoose.Types.ObjectId,
		ref: 'BootcampSession',
	},
	status: {
		type: String,
		enum: ['scheduled', 'started', 'ended'],
		default: 'scheduled',
	},
	host: {
		type: String,
		required: true,
	},
	coHosts: [{
		type: String,
	}],
	startsAt: {
		type: Date,
	},
	eventId: {
		type: String,
	},
});

const LiveStream = mongoose.model('LiveStream', schema);
export default LiveStream;