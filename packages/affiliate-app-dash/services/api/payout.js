import API from './API';

export default {
	initPayout: () => API().post('/payouts/init'),
	getPayouts: () => API().get('/payouts')
}