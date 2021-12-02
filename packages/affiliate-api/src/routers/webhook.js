import express from 'express';
import Order from '../database/models/order';
import BatchSlot from '../database/models/batch-slot';
import Batch from '../database/models/batch';
import { updateOrderStatus } from "../controllers/order";
import Referral from "../database/models/referral";
import aws from 'aws-sdk'
import User from "../database/models/user";
const router = express();
const cloudwatchLogs = new aws.CloudWatchLogs({
  accessKeyId: process.env.AWS_MAIN_KEY,
  secretAccessKey: process.env.AWS_MAIN_SECRET,
  region: 'ap-south-1',
});

router.post('/', async (req, res) => {
  const { event, payload } = (req.body);
  try {
  
  // this webhook is to handle when the payment status was created but was not authorized which later the bank declined ('failed')
  // and also to cancel booking and update order, referral status when refunded
  
  // if the payment was not done through our integration, we will not have the order (eg: payment done through razorpay Pages)
  if (! await Order.exists({ razorpayOrderId: payload.payment.entity.order_id }))
    return res.send();
  
  if (event === 'refund.created' || event === 'payment.failed') {
    
    const newOrderStatus = event === 'refund.created' ? 'refunded': 'failed';
    const order = await Order.updateStatusByPaymentId(payload.payment.entity.id, newOrderStatus);
    if (!order)
      return res.send();
    
    // if payment 'failed' after a while being 'created' due to customer bank errors
    // at the created state the batch slots would've been booked
    // so, we're cancelling them below OR Because it's being refunded
    if (await BatchSlot.exists({ order: order._id, status: { $ne: 'refunded' } })) {
      const batchSlot = await BatchSlot.cancelByFilter({ order: order._id });
      await Batch.incrementBookedSlotsById(batchSlot.batch, -1);
    }
    
    await Referral.findOneAndUpdate({ order: order._id }, {
      $set: {
        status: 'refunded',
      }
    });
  }
  
  else if (event === 'payment.authorized') {
    await updateOrderStatus(payload.payment.entity.id, null, {
      fromWebhook: true,
    });
  }
   return res.send();
  } catch (e) {
    
    let errorMessage;
    if ('toJSON' in e) errorMessage = JSON.stringify(e.toJSON());
    else {
      const alt = {};
      Object.getOwnPropertyNames(e).forEach(function (key) {
        alt[key] = e[key];
      }, e);
      errorMessage = JSON.stringify(alt);
    }
  
    const newEStream = new Date();
    const eStreamName = `[${payload.payment.entity.id}] ${newEStream.toLocaleString()
      .replaceAll(':', '.')}`;
    
    await cloudwatchLogs.createLogStream({
      logGroupName: 'aff-api/webhook-errors',
      logStreamName: eStreamName,
    }).promise();
    
    await cloudwatchLogs.putLogEvents({
      logEvents: [
        {
          message: errorMessage,
          timestamp: newEStream.getTime(),
        }
      ],
      logGroupName: 'aff-api/webhook-errors',
      logStreamName: eStreamName,
    }).promise();
    
    res.send();
  }
  }
  
);


export default router;