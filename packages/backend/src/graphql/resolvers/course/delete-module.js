import { ApolloError } from "apollo-server-errors";
import Module from '../../../database/models/module';

export default async (parent, { id }) => {
	try {
		const module = await Module.findById(id);
		if (module.units.length !== 0) throw new ApolloError('Module is not empty', 'Non-Empty-Module')
		else await Module.findByIdAndDelete(id);
		return true
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}
