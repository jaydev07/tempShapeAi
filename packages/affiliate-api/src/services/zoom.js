import axios from 'axios';
import ZoomAuth from '../database/models/zoom-auth';
import jwt from 'jsonwebtoken';
const BUFFER_TIME = 300;
class Zoom {
	clientId;
	clientSecret;
	accessToken;
	zoomUserId;
	constructor() {
		this.clientId = process.env.ZOOM_CLIENT_ID;
		this.clientSecret = process.env.ZOOM_CLIENT_SECRET;
		
		this.helpers = {
			objectToFormEncoded: object => Object
				.keys(object)
				.map((key) => `${key}=${encodeURIComponent(object[key])}`)
				.join('&')
		}
		
		this.authAPI = axios.create({
			baseURL: 'https://zoom.us/oauth',
			headers: {
				Authorization: `Basic ${Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64')}`,
				'Content-Type': 'application/x-www-form-urlencoded',
			}
		});
		
		this.api = () => axios.create({
			baseURL: 'https://api.zoom.us/v2',
			headers: {
				Authorization: `Bearer ${this.accessToken}`,
			}
		});
		
	}
	
	async init(uid) {
		console.log({uid})
		try {
			this.uid = uid;
			const zoomAuth = await ZoomAuth.findOne({ uid });
			console.log(zoomAuth.uid)
			if (new Date() >= zoomAuth.accessTokenExpiry ) {
				const { access_token } = await this.refreshToken(zoomAuth.refreshToken);
				this.accessToken = access_token;
			}
			else {
				this.accessToken = zoomAuth.accessToken;
				this.zoomUserId = zoomAuth.zoomUserId
			}
			return this.accessToken;
		} catch (e) {
		    console.log(e.response)
		}
	};
	
	async me () {
		return (await this.api().get('/users/me')).data
	}
	
	async refreshToken(refreshToken) {
		try {
			const res = await this.authAPI.post('/token', this.helpers.objectToFormEncoded({
				grant_type: 'refresh_token',
				refresh_token: refreshToken,
			}));
			await ZoomAuth.findOneAndUpdate({ uid: this.uid },{
				accessToken: res.data.access_token,
				refreshToken: res.data.refresh_token,
				accessTokenExpiry: new Date().getTime() +(res.data.expires_in - BUFFER_TIME) * 1000,
			});
			return res.data;
		} catch (e) {
			console.log(e.response)
		}
		
	}
 
	async saveAuth(uid, code) {
		console.log({ uid })
		try {
			const params =  {
				grant_type: 'authorization_code',
				code,
				redirect_uri: 'http://localhost:3000/auth/zoom',
				}
			const res = await this.authAPI.post('/token',
				this.helpers.objectToFormEncoded(params));
			const zoomUserId = jwt.decode(res.data.access_token).uid;
			await ZoomAuth.create({
				uid,
				accessToken: res.data.access_token,
				refreshToken: res.data.refresh_token,
				accessTokenExpiry: new Date().getTime() +(res.data.expires_in - BUFFER_TIME) * 1000,
				zoomUserId,
			});
			this.zoomUserId = zoomUserId;
		} catch (e) {
			console.log(e,e.response)
			throw e;
		}
	}
	
	async createMeeting({topic, type, preSchedule, startTime, agenda}) {
		try {
			console.log(agenda)
			return (await this.api().post(`/users/${this.zoomUserId}/meetings`, {
				topic,
				type,
				pre_schedule: preSchedule,
				start_time: startTime,
				agenda,
				settings: {
					in_meeting: true,
					join_before_host: false,
					mute_upon_entry: true,
					auto_recording: 'cloud',
				}
			})).data;
			
		} catch (e) {
			console.log('sss',e,e.response)
		}
	}
}

export default Zoom;
