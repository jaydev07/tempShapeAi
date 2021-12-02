import mongoose from 'mongoose';

const batchSlotSchema = new mongoose.Schema({
	batch: {
		type: mongoose.Types.ObjectId,
		ref: 'Batch',
		required: true,
		index: true,
	},
	order: {
		type: mongoose.Types.ObjectId,
		ref: 'Order',
		required: true,
		unique: true,
	},
	referrer: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	email: String,
	phone: String,
	isCancelled: {
		type: Boolean,
		default: false,
	}
	
}, {
	timestamps: true,
});

batchSlotSchema.index({ 'createdAt': 1 });

batchSlotSchema.statics.cancelByFilter = async (filter) => {
	return  BatchSlot.findOneAndUpdate(filter, {
		$set: {
			isCancelled: true,
		},
	}, {
		new: true,
	},);
}

const BatchSlot = mongoose.model('BatchSlot', batchSlotSchema);
export default BatchSlot;