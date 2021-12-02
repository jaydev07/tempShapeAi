import aws from 'aws-sdk';
import EmailTemplate from "../database/models/email-template";

const ses = new aws.SES({
	accessKeyId: process.env.AWS_MAIN_KEY,
	secretAccessKey: process.env.AWS_MAIN_SECRET,
	region: 'ap-south-1',
});

export const sendPaymentConfirmationMail = async (email, paymentId) => {
	const template = await EmailTemplate.findOne({ name: 'payment-success' });
	let body = template.body.concat(`<br/><br/>Your Payment Id is: <b>${paymentId}</b>`);
		const params = {
			Destination: {
				ToAddresses: [
					email
				]
			},
			Message: {
				Body: {
					Html: {
						Data: body,
					},
				},
				Subject: {
					Charset: "UTF-8",
					Data: 'Payment Successful',
				}
			},
			ReplyToAddresses: [
			],
			Source: "Shape AI Payments <shapeai.cloud@gmail.com>",
		};
		return ses.sendEmail(params).promise();
};

export const sendMentorJoinEmail = async (name, email, password) => {
	let body = `<br/><br/>
	Hello ${name}, <br/>
	Please login to the app with the following credentials: <br/>
	email: <b>${email}</b> <br/>
	password: <b>${password}</b> (You can change this later) <br/>
	Thank you. <br/>
	- Shape AI <br/>
`;
	const params = {
		Destination: {
			ToAddresses: [
				email
			]
		},
		Message: {
			Body: {
				Html: {
					Data: body,
				},
			},
			Subject: {
				Charset: "UTF-8",
				Data: 'Credentials for Shape AI Mentor Login',
			}
		},
		ReplyToAddresses: [
		],
		Source: "Shape AI QAP <shapeai.cloud@gmail.com>",
	};
	return ses.sendEmail(params).promise();
};
