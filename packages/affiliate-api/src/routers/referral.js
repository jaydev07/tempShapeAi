import express from 'express';
const router = express();
import { referralIdExists, getReferralCountsByBatches, getInfluencerSalesCountUnderManager } from '../controllers/referral';

router.get('/exists/:id', async (req, res) => {
	try {
		res.status(200).send({
			exists: await referralIdExists(req.params.id),
		})
	} catch (e) {
		res.status(500).send(e.toString());
	}
});

// TODO: PAGINATE
router.get('/sales-count/influencers/:managerId', async (req, res) => {
	try {
		res.status(200).json(await getInfluencerSalesCountUnderManager(req.params.managerId))
	} catch (e) {
		res.status(500).send(e.toString());
	}
});

router.get('/sales/:id', async (req, res) => {
	try {
		res.status(200).json(await getReferralCountsByBatches(req.params.id))
	} catch (e) {
	    res.status(500).send(e.toString());
	}
});

export default router;