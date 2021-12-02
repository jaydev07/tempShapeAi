import authResolver from './auth';
import courseResolver from './course';
import uploadResolver from './upload';
import userResolver from './user';
import certificateResolver from './certificate';
import { merge } from 'lodash';

export default merge(
	{},
	authResolver,
	courseResolver,
	uploadResolver,
	userResolver,
	certificateResolver
	);
