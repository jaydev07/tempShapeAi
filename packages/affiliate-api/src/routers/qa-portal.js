import express from 'express';
const router = express();
import {
  createChatRoomByBatchId,
  createChatUser,
  createMentorAndAddToRoomChat, 
  createStream, 
  endStream,
  getMentors, 
  startStream, 
  addNewProblemInUser, 
  getUserProblems,
  createStreamFromSessionId,
  getAllChatRooms,
  getBatchesByMentor,
  getChatRoomsByBatchId,
  getSessionByMentorAndBatch,
  getSessionsByBatch, getBatchesByStudent
} from "../controllers/qa-portal";
import {mentorAuth, userAuth} from '../middlewares/admin';
import Bootcamp from '../database/models/bootcamp';
import LiveStream from '../database/models/live-stream';
import Zoom from '../services/zoom';
import admin from '../services/firebase';

router.post('/users/create', async (req, res) => {
  try {
    const { email, name, password, paymentId, type, batchIds } = req.body;
    if (type === 'mentor') {
      await createMentorAndAddToRoomChat(name, email, batchIds);
      res.send('ok');
    } else {
      const token = await createChatUser(name, email, password, paymentId);
      res.json({ token });
    }
  } catch (e) {
    console.log(e);
    res.status(400).send(e.toString());
  }
});

router.get('/users/mentors', async (req, res) => {
  res.json(await getMentors());
});

router.post('/streams', mentorAuth, async (req, res) => {
  const { name, description, coHosts, startsAt, bootcamp } = req.body;
  const stream = await createStream(name, description, bootcamp, req.userId, coHosts, startsAt);
  res.status(201).json(stream);
});

router.get('/streams/upcoming', mentorAuth, async (req, res) => {
  res.json(await LiveStream.find({ host: req.userId, status: { $ne: 'ended' }, }));
});

router.post('/streams/:id/:action', mentorAuth, async (req, res) => {
  const { id, action } = req.params;
  const { eventId } = req.body;
  if (action === 'start') return res.json(await startStream(id, eventId));
  if (action === 'end') return res.json(await endStream(id));
})



router.get('/bootcamps', async (req, res) => {
  try {
    res.json(await Bootcamp.find().lean())
  } catch (e) {
    console.log(e);
    res.send(e.message).status(500)
  }
});

router.get('/batches/:id/chatrooms', async (req, res) => {
  res.send(await getChatRoomsByBatchId(req.params.id));
});

router.post('/batches/:id/chatrooms', async (req, res) => {
  res.send(await createChatRoomByBatchId(req.params.id, req.body.name));
});

router.get('/chatrooms', async (req, res) => {
  res.send(await getAllChatRooms());
});

router.get('/auth/zoom', async (req, res) => {
  console.log(req.query)
  await new Zoom().saveAuth('12345', req.query.code);
  res.send('k');
});

router.post('/auth/zoom', mentorAuth, async (req, res) => {
  console.log(req.body)
  await new Zoom().saveAuth(req.userId, req.body.code);
  await admin.database().ref(`users/${req.userId}/zoomConnected`).set(true);
  res.send();
});

router.get('/user/problem/:uid', getUserProblems);

router.post('/user/problem',addNewProblemInUser);

router.get('/mentor/batches', mentorAuth, async (req, res) => {
  res.send(await getBatchesByMentor(req.userId));
});

// router.get('/student/batch', userAuth, async (req, res) => {
//   res.send(await getBatchesByStudent(req.userId));
// });

router.get('/student/batch/:uid', async (req, res) => {
  res.send(await getBatchesByStudent(req.params.uid));
});

router.get('/sessions/:batchId', mentorAuth, async (req, res) => {
  res.send(await getSessionByMentorAndBatch(req.params.batchId, req.userId));
});

router.post('/sessions/:id/:action', mentorAuth, async (req, res) => {
  const { id, action } = req.params;
  const {  batchId, startsAt } = req.body;
  if (action === 'start') return res.json(await createStreamFromSessionId(id, batchId, req.userId, false,  startsAt));
  if (action === 'end') return res.json(await endStream(id));
});

router.post('/sessions/new', mentorAuth, async (req, res) => {
  // create session by name and batch
  const {  batchId, startsAt } = req.body;
});

router.get('/batch/sessions/:id', async (req, res) => {
  const mentors = await getMentors();
  const mentorsHash = {};

  mentors.forEach(m => mentorsHash[m.uid] = m.displayName)
  res.json({
    sessions: await getSessionsByBatch(req.params.id),
    mentors: mentorsHash,
  })
});


export default router;
