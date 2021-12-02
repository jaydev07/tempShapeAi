import express from 'express';
import connectToDb from '../database/conn';
import { createBullBoard } from 'bull-board';
import { BullAdapter } from  'bull-board/bullAdapter'
import EmailQueue from './queues/email';
const { router } = createBullBoard([
	new BullAdapter(EmailQueue),
])
const app = express();

app.use('/bullMonitor', router);
app.listen(9009, () => connectToDb().then(() =>console.log('bull monitor running')));