import {ApolloError} from "apollo-server-errors";
import Course from "../../../database/models/course";

export default async (parent, params) => {
	try {
		return await Course.findByIdAndUpdate(params.id, params, {
			omitUndefined: true, new: true,
		});
		
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}