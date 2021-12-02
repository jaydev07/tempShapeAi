// import CertificateTemplate from '../database/models/';
import Referral from '../database/models/referral';
import BatchSlot from '../database/models/batch-slot';
import Batch from '../database/models/batch';
const SIXTEEN_DAYS_IN_MS = 16 * 24 * 60 * 60 * 1000;
const cron = async () => {
  // TODO: query the batches that are currently being run only
  const batches = await Batch.find().lean();
  const today = new Date().getTime();
  
  for (const batch of batches) {
    const batchStartTime = new Date(batch.from).getTime();``
    const minimumPayableTime = batchStartTime + SIXTEEN_DAYS_IN_MS;
    if (today > minimumPayableTime) {
      const payableSlots = await BatchSlot.find({
        isCancelled: { $in: [false, null] },
        batch: batch._id,
      }).select('order');
     await Referral.updateMany({
       status: 'created',
       order: { $in: payableSlots.map(s => s.order) }
     }, {
       status: 'payable',
     });
    }
  }
 
}

export default cron;