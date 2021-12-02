import { ApolloError } from "apollo-server-errors";

import Course from "../../../database/models/course";
import Module from "../../../database/models/module";
import mongoose from 'mongoose';

export default async (parent, { id }) => {
	try {
		await Module.updateMany({
			course: mongoose.Types.ObjectId(id),
			isPublished: false
		}, {
			$set: {
				isPublished: true,
			},
		});
		return await Course.publish(id);
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}