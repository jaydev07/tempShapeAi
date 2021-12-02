const { https } = require('follow-redirects');
const csvjson = require('csvjson');
import connectToDB from '../database/conn';
import AllowedEmail from '../database/models/allowed-email';

const main = async () => {
	https.get('https://docs.google.com/spreadsheets/d/e/2PACX-1vRISS40kB7kK2ilIrauQL2CAKgi9ZmZItZ_JS65SwDe8MQIxiG-LfEO8Sapoxphcdg0PlNwnsqixc-d/pub?gid=0&single=true&output=csv', response => {
		response.on('data', chunk => {
			const data = (csvjson.toObject(chunk.toString()));
			connectToDB().then(() => {
				AllowedEmail.insertMany(data, {
					ordered: false
				}, (err, res) => {
					console.log('Cron Executed', new Date());
				})
			});
		});
	}).on('error', err => {
	});
};
export default main;