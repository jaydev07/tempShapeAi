import express from 'express';
const router = express();
import { createUser, getUserByToken, loginUser, updateUserProfile, getEarnings } from "../controllers/user";
import { adminAuth } from '../middlewares/admin';
import { user } from "../middlewares/user";
import Referral from "../database/models/referral";

router.post('/create/studentManager', adminAuth, async (req, res) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) res.status(400).send('Email and Password required');
		await createUser(email, 'studentManager', password);
		return res.status(201).send('User Created');
	} catch (e) {
	    return res.status(500).send(e.toString());
	}
});

router.post('/register', async (req, res) => {
	try {
		const { email, password, managerRefId } = req.body;
		if (!email || !password || !managerRefId) res.status(400).send('Email, Password and MangerId required');
		const { token } = await createUser(email, 'studentInfluencer', password, managerRefId);
		res.status(201).json({ token });
	} catch (e) {
		if (e.code === 11000 && e.keyPattern.email)
			res.status(500).send('Email Id exists');
		else res.status(500).send(e.toString());
	}
});

router.get('/me', async (req, res) => {
	try {
		const authHeader = req.headers.authorization || req.headers.Authorization;
		if (!authHeader) res.status(401).send('Unauthorized')
		const jwtToken = authHeader.replace('Bearer ', '');
		const user = await getUserByToken(jwtToken, true);
		res.status(200).json(user);
	} catch (e) {
		console.log(e)
	    res.status(401).send('Unauthorized')
	}
});

router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		const { token } = await loginUser(email, password);
		res.status(200).json({ token })
	} catch (e) {
	    res.status(400).send(e.toString());
	}
});

router.patch('/me', user, async (req, res) => {
	try {
		res.json(await updateUserProfile(req.userId, req.body));
	} catch (e) {
		res.status(400).send(e.message);
	}
});

router.get('/earnings', user, async (req, res) => {
	try {
		res.json(await getEarnings(req.userId));
	} catch (e) {
		res.status(400).send(e.message);
	}
});

export default router;