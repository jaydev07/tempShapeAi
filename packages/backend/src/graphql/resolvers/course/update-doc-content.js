import { ApolloError } from "apollo-server-errors";
import DocumentTask from '../../../database/models/document-task';
export default async (parent, { id, content }) => {
	try {
		await DocumentTask.findByIdAndUpdate(id, { content })
		return true;
	} catch (e) {
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
}