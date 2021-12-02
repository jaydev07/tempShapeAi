import aws from 'aws-sdk';
import dotenv from 'dotenv';
dotenv.config({
	path: require('path').resolve(__dirname, '../../../.env'),
});
const s3Region = process.env.UPLOAD_BUCKET_REGION;
const s3Bucket = process.env.UPLOAD_BUCKET;

export const s3 = new aws.S3({
	signatureVersion: 'v4',
	region: s3Region,
	accessKeyId: process.env.UPLOAD_AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.UPLOAD_AWS_SECRET_ACCESS_KEY,
});

export const ses = new aws.SES({
	signatureVersion: 'v4',
	region: s3Region,
	accessKeyId: process.env.AWS_MAIN_KEY,
	secretAccessKey: process.env.AWS_MAIN_SECRET,
});

export const getPublicUploadSign = async (key, contentType) => {
	const signedUrl = await s3.getSignedUrl('putObject', {
		Bucket: s3Bucket,
		Key: key,
		Expires: 120,
		ContentType: contentType,
		ACL: 'public-read',
	});
	const objectUrl = `https://${s3Bucket}.s3.${s3Region}.amazonaws.com/${key}`;
	return { signedUrl, objectUrl };
};

export const uploadToS3PM = (path, filename, buffer, ext) => new Promise((resolve, reject) => {
	s3.upload({
		Key: `${path}/${filename}.${ext}`,
		Body: buffer,
		Bucket: s3Bucket,
	}, (err, data) => {
		if (err) reject(err);
		resolve(data);
	});
});
