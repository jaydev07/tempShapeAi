import { ApolloError } from 'apollo-server-errors';
export default async (parent, { password }, { user }) => {
	try {
		if (!user) return false;
		user.password = password;
		await user.save();
		return true;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}