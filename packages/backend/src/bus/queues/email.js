import Queue from 'bull';
import { sendConfirmEmail, sendHtmlEmailWithBody } from '../../services/aws/ses';
import {unique} from 'shorthash';
import UserCertificate from '../../database/models/user-certificate';
import CertificateTemplate from '../../database/models/certificate-template';
import CertificateBatch from '../../database/models/cert-batch';
import { uploadToS3PM } from '../../services/aws';
import {getBrowser} from '../../services/pupperteer/browser';
import qrcode from 'qrcode';

const EmailQueue = new Queue('Email-Queue', process.env.REDIS, {
	limiter: {
		max: 11,
		duration: 1000,
	},
})

EmailQueue.process(async (job, done) => {
	const { email, token, name, type } = job.data;
	if(type === 'sendConfirmEmail')
	sendConfirmEmail(email, name, token).then(data => {
		done(null, data)
	}).catch(err => {
		console.log({ err })
		throw new Error(err)
	})
	else if (type === 'certEmail') {
		const { userName, email, courseName, emailBody, templateId, batchId, source } = job.data;
		const browser = await getBrowser();
		const page = await browser.newPage();
		const credId = unique(`${templateId}-${email}`);
		let certificate = await UserCertificate.findOne({ credentialId: credId });
		const { dimensions, html } = await CertificateTemplate.findById(templateId);
		if (!certificate)
		 certificate = await UserCertificate.create({
			userFullName: userName,
			userEmail: email,
			purposeName: courseName,
			credentialId: credId,
			template: templateId,
			accomplishmentType: "bootcamp",
			creationType: 'manual',
		});
		const { height, width } = dimensions;
		await page.setViewport({
			width: width,
			height: height,
		});
		const qrDataUrl = await qrcode.toDataURL(`https://cert.shapeai.tech/verify/${credId}`);
		const certHtml = html
			.replace('$name', userName)
			.replace('https://shapeai-uploads.s3.ap-south-1.amazonaws.com/sample-qr', qrDataUrl)
			.replace(/\$cred_id\b/g, credId)
			.replace(/\cred_id\b/g, credId)
		await page.setContent(certHtml);
		const ss = await page.screenshot();
		const pdf = await page.pdf({
			printBackground: true,
			width: `${width + 0.0938 * width}px`,
			height: `${height + 0.0501 * height}px`,
			margin: {
				left: `${width * 0.046}px`,
				right: `${width * 0.0778}px`,
			},
		});
		await page.close();
		certificate.imgUrl = (
			await uploadToS3PM(`certificates/${unique(email)}`, credId, ss, "png")
		).Location;
		certificate.pdfUrl = (
			await uploadToS3PM(`certificates/${unique(email)}`, credId, pdf, "pdf")
		).Location;
		const varReplacedBody = emailBody
			.replace(/\$name\b/g, userName)
			.replace(/\$courseName\b/g, courseName)
			.replace(/\$downloadStatement\b/g, `To download the certificate, please click <a target="_blank" href="${certificate.pdfUrl}">here</a>`)
		try {
			await sendHtmlEmailWithBody(email, userName, `Certificate for ${courseName}`, varReplacedBody, source);
		} catch (e) {
		    done(new Error('Error while sending email. Check email id given.'))
		}
		certificate.mailSent = true;
		await certificate.save();
		await CertificateBatch.findByIdAndUpdate(batchId, { $inc: { completedCount: 1 } });
		console.log(`certSent: ${email}`);
		done(null, `certSent: ${email}`);
	}
	else throw new Error('Unknown job type')
});

export default EmailQueue;