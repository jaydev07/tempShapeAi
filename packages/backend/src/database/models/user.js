import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import * as jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
	name: {
		firstName: {
			type: String,
			required: true,
			trim: true,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
		},
	},
	email: {
		type: String,
		match: /\S+@\S+\.\S+/,
		lowercase: true,
		trim: true,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
	},
	enrolledCourseId: {
		type: String,
	},
	profilePicture: {
		key: {
			type: String,
			default: 'defauls/dp.svg'
		},
		location: {
			type: String,
			default: 'https://shapeai-uploads.s3.ap-south-1.amazonaws.com/defauls/dp.svg'
		},
	},
	xp: {
		type: Number,
		default: 0,
	},
	isVerified: {
		type: Boolean,
		default: false,
	},
	type: {
		type: String,
		enum: ['student', 'superAdmin', 'certAdmin'],
		default: 'student'
	}
});
userSchema.index({
	email: 1,
	name: {
		firstName: 1,
		lastName: 1,
	}
});

userSchema.virtual('enrolledCourse', {
	ref: 'Course',
	localField: 'enrolledCourseID',
	foreignField: 'Id',
	justOne: true,
});

userSchema.methods.generateAuthToken = function (next) {
	return jwt.sign({
		sub: this._id.toString(),
		iss: 'https://shapeai.tech',
		aud: 'https://shapeai.tech',
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


const User = mongoose.model('User', userSchema);
export default User;