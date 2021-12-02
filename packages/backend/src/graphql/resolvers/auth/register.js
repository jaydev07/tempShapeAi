import { ApolloError } from "apollo-server-errors";
import User from "../../../database/models/user";
import UserVerification from '../../../database/models/user-verification';
import AllowedEmail from '../../../database/models/allowed-email';
import { addVerifyEmailJob } from '../../../bus/producers/email'

export default async (parent, args) => {
	try {
		if (!await AllowedEmail.exists({ email: args.user.email }))
			throw new ApolloError('Unrecognizable Email Id', 'INVALID VALUES');
		const user = await User.create(args.user);
		const jwtToken = user.generateAuthToken();
		const { token } = await UserVerification.gen(user._id);
		addVerifyEmailJob(token, user.name, user.email);
		return {
			user,
			token: jwtToken,
		};
	} catch (e) {
		if (e.code === 11000 && e.keyPattern.email)
			 throw new ApolloError('Email already exists', 'INVALID VALUES');
	  else throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}
