import User from '../database/models/user';
import { unique } from 'shorthash';
import jwt from 'jsonwebtoken';

import cashfreePayouts from '../services/cashfree';
import { logError } from '../services/cloudwatchlogs';
import Referral from "../database/models/referral";

const USER_UPDATE_PROFILE_LIMIT = 4;
export const createUser = async (email, role, password, managerRefId) => {
	let manager;
	if (role === 'studentInfluencer') {
		manager = await User.findOne({ referralId: managerRefId, role: 'studentManager' });
		if (!manager) throw new Error('No Student Manager exists with the given Id.');
	}
	const user = await User.create({
		email,
		password,
		role,
		manager: manager ? manager._id: null,
		referralId: unique(email),
	});
	return {
		user,
		token: user.generateAuthToken(),
	}
};

export const getUserByToken = async (jwtToken, hideSensitiveData) => {
	const { sub } = jwt.verify(jwtToken, process.env.JWT_SECRET);
	if (hideSensitiveData) return User.findById(sub).select('-password -__v -email');
	return User.findById(sub);
};

export const loginUser = async (email, password) => {
	const user = await User.findByCredentials(email, password);
	return {
		user,
		token: user.generateAuthToken(),
	}
};

export const updateUserProfile = async (userId, data) => {
	const user = await User.findById(userId);
	
	// because this could be a request to update upi id again
	// and until further measures are developed to verify the authenticity of user
	// like through OTP for mobile, this should not be allowed
	if (user.profileCompleted) throw new Error('Already Updated');
	if (user.profileUpdateAttempts >= USER_UPDATE_PROFILE_LIMIT)
		throw new Error('Update Limit Reached. Please reach out to Admin');
	
	const { name, vpa, address, phone } = data;
	try {
		await cashfreePayouts.validateUpi({
			name,
			vpa,
		});

		await cashfreePayouts.addBeneficiary({
			name,
			phone,
			vpa,
			address,
			beneId: userId,
			email: user.email,
		});
		await User.completeProfile(userId, data);
		return {
			result: 'valid',
			message: 'Profile Completed Successfully'
		}
		
	} catch (e) {
		console.log(e)
		if (e.name === 'CashfreeAPIError' && e.source === 'user') {
			return {
				result: 'invalid',
				message: e.message,
				attemptsLeft: USER_UPDATE_PROFILE_LIMIT - (await User.reduceAttempts(user._id)).profileUpdateAttempts,
			}
		}
		console.log(e);
		throw new Error('Something went wrong. Please try again later.')
	}
};

export const getEarnings = async (userId) => {
	return {
		escrow: await Referral.getTotalAmountForUserByStatus(userId, 'created'),
		payable: await Referral.getTotalAmountForUserByStatus(userId, 'payable'),
		paid: await Referral.getTotalAmountForUserByStatus(userId, 'paid'),
	}
};