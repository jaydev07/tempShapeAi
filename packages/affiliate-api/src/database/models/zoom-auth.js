import mongoose from 'mongoose';

const zoomAuthSchema = new mongoose.Schema({
	uid: {
		type: String,
		required: true,
		index: true,
	},
	refreshToken: String,
	accessToken: String,
	accessTokenExpiry: Date,
	zoomUserId: String,
}, {
	timestamps: true,
});

const ZoomAuth = mongoose.model('ZoomAuth', zoomAuthSchema);
export default ZoomAuth;