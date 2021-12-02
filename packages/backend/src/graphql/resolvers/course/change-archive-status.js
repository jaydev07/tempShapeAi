import { ApolloError } from "apollo-server-errors";

import Course from "../../../database/models/course";
export default async (parent, { Id, archive }) => {
	try {
		const res = await Course.updateMany({ Id }, {
			$set: {
				isArchived: archive,
			}
		});
		return res.nModified > 0;
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}