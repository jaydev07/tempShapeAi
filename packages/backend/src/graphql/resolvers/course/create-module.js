import { ApolloError } from "apollo-server-errors";
import Course from "../../../database/models/course";
import Module from "../../../database/models/module";

export default async (parent, params) => {
	try {
		const module = await Module.create(params.module);
		if (params.module.isSub)
			await Module.findByIdAndUpdate(params.module.parentModule, {
				$addToSet: {
					units: {
						type: 'Module',
						unit: module._id,
					},
				},
			})
		else
			await Course.findByIdAndUpdate(params.module.course, {
			$addToSet: {
				modules: module._id,
			}
		});
		return module;
	
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}