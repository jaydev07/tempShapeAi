import Queue from './index';
import { createWorker } from 'tesseract.js';

const worker = createWorker({
	logger: m => console.log(m)
});

import VerifyEmailQueue from './index';
(async () => {
// await 	Queue.clean()
// 	await Queue.clean()
// 	const jobs = await Queue.removeJobs('*');
	await worker.load();
	await worker.loadLanguage('eng');
	await worker.initialize('eng');
	const { data: { text } } = await worker.recognize('https://shapeai-uploads.s3.ap-south-1.amazonaws.com/certificates/PitKD/Z1V5DaR.png');
	console.log(text);
})()
