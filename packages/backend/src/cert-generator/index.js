import puppeteer from 'puppeteer';
import certTemplates from './templates';
import {uploadToS3PM} from '../services/aws';
import ModuleTracker from '../database/models/module-tracker';
import {getBrowser} from '../services/pupperteer/browser';

export const genCert = async (certificateTemplate, certificate, credentialId, user, accomplishmentName) => {
	const browser = await getBrowser();
	const page = await browser.newPage();
	const { height, width } = certificateTemplate.dimensions;
	await page.setViewport({
		width: width,
		height: height,
	});
	const { firstName, lastName } = user.name;
	const html = certTemplates[certificateTemplate.type](
		`${firstName} ${lastName}`,
		credentialId,
		`has successfully completed the ${certificate.accomplishmentType} ${accomplishmentName}`,
		certificateTemplate.imageUrl,
		certificateTemplate.height,
		certificateTemplate.width
	);
	await page.setContent(html);
	const ss = await page.screenshot();
	const pdf = await page.pdf({
		printBackground: true,
		width: `${width + 0.0938 * width}px`,
		height: `${height + 0.0101 * height}px`,
		margin: {
			left: "50px",
			right: "50px",
		},
	});
	await page.close();
	certificate.pdfUrl = (
		await uploadToS3PM(`certificates/${user._id}`, credentialId, pdf, "pdf")
	).Location;
	certificate.imgUrl = (
		await uploadToS3PM(`certificates/${user._id}`, credentialId, ss, "png")
	).Location;
	certificate.status = "generated";
	return await certificate.save();
}