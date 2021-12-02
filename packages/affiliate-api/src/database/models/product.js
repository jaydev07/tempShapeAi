import mongoose from 'mongoose';
import './batch';

const productSchema = new mongoose.Schema({
	name: String,
	description: String,
	type: String,
	price: Number,
	priceInUSD: Number,
	discountOnReferral: Number,
	referrerCut: Number,
	details: {
		type: mongoose.Types.ObjectId,
		ref: 'Batch'
	},
	detailsType: {
		type: String,
		default: 'Batch',
	}
});

const Product = mongoose.model('Product', productSchema);
export default Product;