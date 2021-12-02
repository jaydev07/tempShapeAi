import { ApolloError } from 'apollo-server-errors';
import ModuleTracker from '../../../database/models/module-tracker';
import { Types } from 'mongoose';

export default async (parent, { id }, { user }) => {
	try {
		return await ModuleTracker.findOne({
			_id: Types.ObjectId(id),
			user: user._id,
		});
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}