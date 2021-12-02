import express from 'express';
const router = express();
import { createOrder, updateOrderStatus } from '../controllers/order'
import { getUserPublicIP } from "../utils";
import { getLocationByIp } from "../services/ipstack";

router.post('/update/status', async (req, res) => {
	try {
		const { razorpayPaymentId, razorpaySignature } = req.body;
		const updatedOrder = await updateOrderStatus(razorpayPaymentId, razorpaySignature, {
			fromWebhook: false
		});
		res.status(200).json(updatedOrder);
	} catch (e) {
		console.log(e)
		res.status(500).send( 'ss' +  e.toString());
	}
	
});

router.post('/:id', async (req, res) => {
	try {
		const userIp = getUserPublicIP(req);
		console.log({userIp});
		const location = await getLocationByIp(userIp);
		console.log({location});
		let currency = 'INR';
		if (location.country_code) currency = location.country_code === 'IN' ? 'INR': 'USD';
 		const order = await createOrder(req.params.id, req.body.refId, currency, req.body.notes);
		return res.status(200).json(order);
	} catch (e) {
		console.log(e)
		res.status(500).send( e.toString());
	}
});



export default router;
