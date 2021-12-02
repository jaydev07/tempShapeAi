import { ses } from '../index';
const env = process.env.NODE_ENV;
const clientHost = process.env.CLIENT_HOST;
import confirmEmailTemplate from './templates/verify-email';
import base from './templates/base';

export const sendConfirmEmail = (email, name, token) => {
	return new Promise((resolve, reject) => {
		const params = {
			Destination: {
				ToAddresses: [
					email
				]
			},
			Message: {
				Body: {
					Html: {
						Data: confirmEmailTemplate(name, `${env === 'development' ? 'http' : 'https'}://${clientHost}/verify-email/${token}`),
					},
					
				},
				Subject: {
					Charset: "UTF-8",
					Data: "Please Verify your email"
				}
			},
			ReplyToAddresses: [
			],
			Source: "Shape AI <shapeai.cloud@gmail.com>",
		};
		return ses.sendEmail(params, function(err, data) {
			if (err) reject(err)
			else resolve(data);           // successful response
		});
	})

}

export const sendHtmlEmailWithBody = (email, name, subject, body, source) => {
	return new Promise((resolve, reject) => {
		const params = {
			Destination: {
				ToAddresses: [
					email
				]
			},
			Message: {
				Body: {
					Html: {
						Data: base(name,body),
					},
					
				},
				Subject: {
					Charset: "UTF-8",
					Data: subject,
				}
			},
			ReplyToAddresses: [
			],
			Source: `${source.name || 'Shape AI'} <${source.email}>`,
		};
		return ses.sendEmail(params, function(err, data) {
			if (err) reject(err)
			else resolve(data);           // successful response
		});
	})
	
};

export const getVerifiedEmails = async () => {
	return new Promise((resolve, reject) => {
		ses.listIdentities({
			IdentityType: "EmailAddress",
			MaxItems: 123,
			NextToken: ""
		}, function(err, data) {
			if (err) reject(err)
			resolve(data.Identities);
		});
	})
};

export const verifyEmail = async (email) => {
	return new Promise((resolve, reject) => {
	ses.verifyEmailIdentity({
		EmailAddress: email
	}, function(err, data) {
		if (err) reject(err)
		else resolve(data);
	});
	})
};
