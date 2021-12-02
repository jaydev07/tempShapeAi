import connectToDB from '../database/conn';
import qrcode from 'qrcode';
import bcrypt from 'bcryptjs'
import {getBrowser} from '../services/pupperteer/browser';
import CertificateTemplate from '../database/models/certificate-template';
import { unique } from 'shorthash';

import {uploadToS3PM} from '../services/aws';
import manual1 from '../cert-generator/templates/manual-1';
import UserCertificate from '../database/models/user-certificate';
import { addCertSendJob } from './producers/email';
import EmailQueue from './queues/email';
import https from 'follow-redirects/https';
import csvjson from 'csvjson';
import fs from 'fs';

(async () => {
	await connectToDB();
	// const c = await CertificateTemplate.findById('608d8f3dba3f0438e6156ff5');
	// console.log(c.html);
	bcrypt.genSalt(8, (err, salt) => {
		if (err) return next(err);
		// hashing password
		bcrypt.hash('shapeai', salt, (err, hash) => {
			if (err) return next(err);
			console.log({hash})
			return next();
		});
	});
	// const url = await qrcode.toDataURL('This is a sample QR Code, this will be replaced with actual url for the certificate page', { errorCorrectionLevel: 'M' });
	// console.log({url});
})();