import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
	bootcamp: {
		type: mongoose.Types.ObjectId,
		ref: 'Bootcamp',
	},
	from: Date,
	to: Date,
	availableSlots: Number,
	bookedSlots: Number,
	description: String,
	acceptSlotsAfterLimit: Boolean,
});

batchSchema.statics.incrementBookedSlotsById = async (id, inc) => {
	return Batch.findByIdAndUpdate(id,{
		$inc: {
			bookedSlots: inc,
		}
	}, {
		new: true,
	});
}

const Batch = mongoose.model('Batch', batchSchema);
export default Batch;