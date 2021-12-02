import { ApolloError } from 'apollo-server-errors';
import { getPublicUploadSign } from '../../../services/aws';

const purposePathStore = {
	'courseImage': 'images/courses',
	'courseResources': 'courses/files',
	'userProfile': 'images/users',
	'certificateTemplate': 'certificate/templates',
	'certBatchCSV': 'certificates/batches'
};

const formatFilename = filename => {
	const date = new Date().toISOString();
	const randomString = Math.random()
		.toString(36)
		.substring(2, 7);
	const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
	const newFilename = `${date}-${randomString}- ${cleanFileName}`;
	return newFilename.substring(0, 60);
};

export default async  (parent, { files, contentType, purpose }) => {
	try {
		return files.map(async file => ({
			filename: file.filename,
			...await getPublicUploadSign(`${purposePathStore[purpose]}/${formatFilename(file.filename)}`, file.contentType),
		}));
	} catch (error) {
		throw new ApolloError(error.toString(), 'INTERNAL SERVER ERROR');
	}
};
