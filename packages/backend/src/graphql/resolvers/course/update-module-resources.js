import {ApolloError} from 'apollo-server-errors';
import Module from '../../../database/models/module';
import {Types} from 'mongoose';

export default async (parent, { id, action, resources, resourceIds, newName }, { user }) => {
	try {
		if (action === 'add') {
			return await Module.findByIdAndUpdate(id, {
				$push: {
					resources: {
						$each: resources,
					},
				},
			}, {
				new: true,
			});
		}
		else if (action === 'remove')
			return await Module.findByIdAndUpdate(id, {
				$pull: {
					resources: {
						_id: resourceIds.map(r => Types.ObjectId(r)),
					},
				},
			}, {
				new: true,
			});
		else {
			return await Module.findOneAndUpdate({_id: Types.ObjectId(id), 'resources._id': Types.ObjectId(resourceIds[0])}, {
				$set: {
					'resources.$.name': newName,
				}
			}, {
				new: true
			});
		}
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}