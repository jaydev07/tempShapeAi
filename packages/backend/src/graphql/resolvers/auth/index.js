import register from './register';
import login from './login';
import verifyUserEmail from './verify-user-email';
import createAdminUser from './create-admin-user';
import updatePassword from './update-password';

export default {
	Mutation: {
		register,
		login,
		verifyUserEmail,
		createAdminUser,
		updatePassword,
	}
}