import {ApolloError} from "apollo-server-errors";
import Course from "../../../database/models/course";

export default async (parent, params) => {
	try {
		return await Course.createDraft(params.course);
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}