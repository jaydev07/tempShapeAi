import firebase from '../services/firebase';
export const adminAuth = (req, res, next) => {
	if (process.env.ADMIN_TOKEN !== req.headers.authorization)
		res.status(401).send('Unauthorized')
	next();
};

export const mentorAuth = (req, res, next) => {
	try {
		const token = req.headers.authorization.replace('Bearer ', '');
		if (!token) throw new Error();
		firebase.auth().verifyIdToken(token).then(c => {
			if (c.mentor) {
				req.userId = c.uid;
				next();
			}
			else res.status(401).send('PERMISSION_DENIED');
		})
		
	} catch (e) {
		res.status(400).send('JWT_ERROR');
	}
}

export const userAuth = (req, res, next) => {
	try {
		const token = req.headers.authorization.replace('Bearer ', '');
		if (!token) throw new Error();
		firebase.auth().verifyIdToken(token)
			.then(c => {
				req.userId = c.uid
				next()
			})
			.catch(e => res.status(401).send('PERMISSION_DENIED'))
	} catch (e) {
		res.status(400).send('JWT_ERROR');
	}
}