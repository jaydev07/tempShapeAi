import api from '.';

export const createStream =
	async (data: { name: string; description: string; bootcamp: string; coHosts: string[]; startsAt: string; }) =>
		(api().post('/streams', data));

export const getBootcamps =
	async () => (api().get('/bootcamps'));

export const getMentors =
	async () => (api().get('/users/mentors'));

export const getUpcomingStreams =
	async () => (api().get('/streams/upcoming'));

export const updateStream =
	async (id: string, action: string, eventId: string) => (api().post(`/streams/${id}/${action}`, { eventId }));

export const getBatches =
	async () => (api().get('/mentor/batches'))

export const getSessionsByBatch =
	async (batchId: string) => (api().get(`/sessions/${batchId}`))

export const scheduleSession =
	async (sessionId: string, batchId: string, startsAt: string) => (api().post(`/sessions/${sessionId}/start`, {
		batchId,
		startsAt,
		isInstant: false,
	}))

export const connectZoom =
	async (code:string) => (api().post('/auth/zoom', { code }));

// User Problems apis

export const getUserProblems = 
	async (uid:string) => (api().get(`/user/problem/${uid}`));

export const addNewProblemInUser = 
	async (userId:string, problemId:string) => (api().post('/user/problem', {
		userId,
		problemId
	}));
	
export const getStudentBatch = 
	async (uid:string) => (api().get(`/student/batch/${uid}`));
