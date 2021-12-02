import { ApolloError } from 'apollo-server-errors';
import CertificateBatch from '../../../database/models/cert-batch';
import https from 'follow-redirects/https';
import csvjson from 'csvjson';
import { s3 } from '../../../services/aws';
import { addCertSendJob } from '../../../bus/producers/email';
import CertificateTemplate from '../../../database/models/certificate-template';
import {getVerifiedEmails} from '../../../services/aws/ses';

const getStringDataFromUrl = (url) => {
	return new Promise((resolve, reject) => {
		s3.getObject({
			Bucket: process.env.UPLOAD_BUCKET,
			Key: url.split('.com/')[1],
		}, (err, data) => {
			if (err) reject(err)
			resolve(data.Body.toString());
		})

	})
};

export default async (parent, params, { user }) => {
	try {
		const SESVerifiedEmails = await getVerifiedEmails();
		if (!SESVerifiedEmails.includes(user.email))
			throw new ApolloError('Your email-id is not verified with SES.' +
				' \n Please request the admin send you a verification email', 'FORBIDDEN')
		
		const csvString = await getStringDataFromUrl(params.csv);
		const csvData = csvjson.toObject(csvString);
		if (!csvData[0].name || !csvData[0].email)
			throw new ApolloError('`name` or `email` column header missing from csv file', 'VALIDATION_ERROR')
		else {
			const certBatch = await CertificateBatch.create({
				...params,
				totalEntries: csvData.length,
			});
			const { _id, name } = await CertificateTemplate.findById(certBatch.certificateTemplate);
			for (const entry of csvData) {
				addCertSendJob(entry.name, entry.email, name, certBatch.emailBody, _id, certBatch._id, {
					email: user.email,
					name: params.sourceName,
				});
			}
			return certBatch;
		}
	} catch (e) {
		console.log(e)
		throw new ApolloError(e.toString(), 'INTERNAL SERVER ERROR');
	}
};