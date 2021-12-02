import updateUserProfile from './update-profile';
import getCurrentUser from './get-current-user';
import resendVerificationEmail from './resend-verification-link';
import setUserStatus from './set-user-status';
import getUserStatus from './get-user-status';
import getAdmins from './get-admins';
import sendSESVerification from './send-ses-verification';
import getSESVerifiedEmails from './get-ses-verified-emails';

export default {
	Mutation: {
		updateUserProfile,
		resendVerificationEmail,
		setUserStatus,
		sendSESVerification,
	},
	Query: {
		getCurrentUser,
		getUserStatus,
		getAdmins,
		getSESVerifiedEmails,
	}
};