import EmailQueue from '../queues/email';
export const addVerifyEmailJob = (token, name, email) => EmailQueue.add( {
	token,
	email: email,
	name: `${name.firstName} ${name.lastName}`,
	type: 'sendConfirmEmail',
}, {
	attempts: 3,
	backoff: 10000,
});

export const addCertSendJob = (userName, email, courseName, emailBody, templateId, batchId, source) => EmailQueue.add({
	type: 'certEmail',
	userName,
	email: email.toLowerCase(),
	courseName,
	emailBody,
	templateId,
	batchId,
	source
}, {
	attempts: 3,
	backoff: 10000,
})