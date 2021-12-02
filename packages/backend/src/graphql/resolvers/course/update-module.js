import {ApolloError} from "apollo-server-errors";
import Module from "../../../database/models/module.js";

export default async (parent, params) => {
	try {
		return await Module.findByIdAndUpdate(params.id, params, {
			omitUndefined: true, new: true,
		}).populate('units');
		
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}