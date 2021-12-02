import API from './API';

export default {
	signup: ({ email, password, managerRefId }) =>
		(API().post('/users/register', { email, password, managerRefId })),
	me: () =>
		(API().get('/users/me')),
	signin: ({email, password}) =>
		(API().post('/users/signin', { email, password })),
	updateProfile: data =>
		(API().patch('/users/me', data)),
	getEarnings: () =>
		(API().get('/users/earnings'))
}