import {ApolloError} from "apollo-server-errors";
import Commit from '../../../database/models/commit';
import mongoose from 'mongoose';

export default async (parent, { userId }, { user }) => {
	try {
		return await Commit.aggregate([
			{
				$match: {
					$expr: {
						$gt: [
							{$toDate: "$_id"},
							{$toDate: {$subtract: [new Date(), 356 * 86400000]}}
						]
					},
					user: mongoose.Types.ObjectId(userId || user._id),
				}
			},
			{
				$group: {
					_id: {
						dateYMD: {
							$dateFromParts: {
								year: {$year: "$_id"},
								month: {$month: "$_id"},
								day: {$dayOfMonth: "$_id"}
							}
						}
					},
					count: {$sum: 1}
				}
			},
			{
				$sort: {"_id.dateYMD": -1}
			},
			{
				$project: {
					_id: 0,
					count: 1,
					date: {$dateToString: {date: "$_id.dateYMD", format: "%Y-%m-%d"}}
				}
			}
		]);
	} catch (e) {
		throw new ApolloError(e.toString(), "INTERNAL SERVER ERROR");
	}
};
