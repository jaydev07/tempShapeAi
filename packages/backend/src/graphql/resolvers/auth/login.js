import { ApolloError } from "apollo-server-errors";
import User from "../../../database/models/user";
export default async (parent, { email, password }) => {
	try {
		const user = await User.findByCredentials(email, password);
		const token = user.generateAuthToken();
		return {
			user,
			token,
		};
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}