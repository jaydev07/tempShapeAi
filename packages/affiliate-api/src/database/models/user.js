import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
		trim: true,
		lowercase: true,
		unique: true,
		index: true,
	},
	name: String,
	phone: {
		type: Number,
		minlength: 8,
		maxlength:12,
	},
	address: String,
	role: {
		type: String,
		enum: ['studentManager', 'studentInfluencer']
	},
	password: String,
	referralId: {
		type: String,
		index: true,
	},
	// if user is a studentInfluencer
	manager: {
		type: mongoose.Types.ObjectId,
		ref: 'User',
	},
	referrals: [{
		type: mongoose.Types.ObjectId,
		ref: 'Referral'
	}],
	profileCompleted: {
		type: Boolean,
		default: false,
	},
	profileUpdateAttempts: {
		default: 0,
		type: Number,
	}
}, {
	timestamps: true,
});

userSchema.pre('save', function (next) {
	const user = this;
	const SALT_FACTOR = 8;
	if (!user.isModified('password')) return next();
	bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
		if (err) return next(err);
		// hashing password
		bcrypt.hash(user.password, salt, (err, hash) => {
			if (err) return next(err);
			user.password = hash;
			return next();
		});
	});
});


userSchema.methods.generateAuthToken = function (next) {
	return jwt.sign({
		sub: this._id.toString(),
		iss: 'https://shapeai.tech',
		aud: 'https://affiliate.shapeai.tech',
		role: 'student',
	}, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});
};

userSchema.statics.findByCredentials = async (email, password) => {
	const user = await User.findOne({ email }).populate('enrolledCourse');
	if (!user) throw new Error('Invalid Credentials');
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) throw new Error('Invalid Credentials');
	return user;
};

userSchema.statics.completeProfile = async (userId, { name, vpa, address, phone}) => {
	return  User.findByIdAndUpdate(userId, {
		$set: {
			name,
			vpa,
			address,
			phone,
			profileCompleted: true,
		},
		$inc: {
			profileUpdateAttempts: 1,
		}
	}, {
		new: true,
	});
}

userSchema.statics.reduceAttempts = async (userId) => {
	return  User.findByIdAndUpdate(userId, {
		$inc: {
			profileUpdateAttempts: 1,
		}
	}, {
		new: true,
	});
}


const User = mongoose.model('User', userSchema);
export default User;