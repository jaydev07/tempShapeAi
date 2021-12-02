import axios from 'axios';

console.log('s', process.env.NEXT_PUBLIC_API_URL)
export default () => {
	return axios.create({
		baseURL: process.env.NEXT_PUBLIC_API_URL,
		headers: {
			Authorization: {
				toString() {
					return `Bearer ${localStorage.getItem('userToken')}`;
				},
			},
		},
	});
};