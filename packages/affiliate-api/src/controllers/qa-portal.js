import razorpay from "../services/razorpay";
import admin, {getMentorsByBatch, isPaymentIdAlreadyUsed} from '../services/firebase';
import { sendMentorJoinEmail } from "../services/ses";
import LiveStream from '../database/models/live-stream';
import UserProblems from "../database/models/user-problems";
import Batch from '../database/models/batch';
import Day from '../database/models/day';
import Week from '../database/models/week';
import Problem from '../database/models/problem';
import BootcampSession from '../database/models/bootcamp-session';
import mongoose from 'mongoose';
import Zoom from '../services/zoom';
const util = require('util')


export const hash = (str) => {
  let hash = 0;
  if (str.length === 0) return hash;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ( (hash <<5 ) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

export const createChatUser = async (name, email, password, paymentId, batchId) => {
  let payment;
  // TODO: Uncomment
  
  // try {
  //   payment = await razorpay.payments.fetch(paymentId);
  //   console.log(payment, payment.notes);
  // } catch (e) {
  //   throw new Error('Invalid Payment Id. Please check the id entered and try again.')
  // }
  //
  // if (await isPaymentIdAlreadyUsed(paymentId))
  //   throw new Error('The provided payment id is already used.');
  //
  // if (!['captured', 'authorized'].includes(payment.status))
  //   throw new Error('The provided payment id is either still processing or has been failed/refunded.')
  //
  // if (!payment.notes?.batchId) throw new Error('BatchId required.')
  // batchId = batchId ? batchId : payment.notes?.batchId || 'default';
  // TODO: Remove hard-coding
  batchId = '60cdfdf4f83b4745d1761316'
  let assignedChatRoom;
  const chatRooms = await getChatRoomsByBatchId(batchId);
  const lastAssignedChatRoom = await getRoundRobinNumber(batchId);
  console.log({ lastAssignedChatRoom, chatRooms })
  assignedChatRoom = chatRooms[lastAssignedChatRoom + 1] ? chatRooms[lastAssignedChatRoom + 1] : chatRooms[0];
  const chatRoomId = assignedChatRoom.key;
  try {
    const user = await admin.auth().createUser({
      email,
      password,
      displayName: name,
      emailVerified: true,
    });

    await admin.database().ref(`users/${user.uid}`).set({ chatRoomIds: [chatRoomId], batchId });
    // const batchMentors = await getMentorsByBatch(chatRoomId);
    // const assignedMentor = batchMentors[hash(user.uid) % batchMentors.length];
    await admin.database().ref(`users/${user.uid}/assignedChatRoom`).set(chatRoomId);
    // TODO: Uncomment
    // await admin.database().ref(`paymentsMap/${paymentId}`).set({ user: user.uid });
    
    // await admin.database().ref(`chatrooms/${chatRoomId}`).set({ name: 'ML 1' });
    await admin.database().ref(`chatrooms/${chatRoomId}/students`).push({ user: user.uid });
    await setRoundRobinAssignment(batchId, chatRooms[lastAssignedChatRoom + 1] ? lastAssignedChatRoom + 1 : 0);
    return await admin.auth().createCustomToken(user.uid);
    } catch (e) {
    throw new Error(e.message)
  }
}

export const createMentorAndAddToRoomChat = async (name, email, batchIds) => {
  const password = Math.random().toString().substr(2,7);
  const user = await admin.auth().createUser({
    email,
    password,
    displayName: name,
    emailVerified: true,
  });
  await admin
    .auth()
    .setCustomUserClaims(user.uid, { mentor: true });
  await admin.database().ref(`users/${user.uid}`).set({ batchIds: batchIds, chatRoomIds: batchIds });
  await admin.database().ref(`users/mentors`).push({ uid: user.uid, name: user.displayName,  });
  for (const b of batchIds) {
    await admin.database().ref(`chatrooms/${b}/mentors`).push({ user: user.uid, name: user.displayName,  });
  }
  return sendMentorJoinEmail(name, email, password);
};

export const getMentors = async () => {
  return new Promise((resolve, reject) => {
    admin.database().ref(`users/mentors`).once('value', data => {
      const query = [];
      const mentors = data.val();
      if (mentors && Object.keys(mentors).length > 0) {
        Object.keys(mentors).forEach(key => {
          query.push({ uid: mentors[key].uid });
        });
        admin.auth().getUsers(query).then(data => {
          resolve(data.users);
        });
      } else
      resolve([])
    })
  
  });

};
export const getRoundRobinNumber = async (batchId) => {
  return new Promise(resolve => {
    admin.database().ref(`batches/${batchId}/round-robin-assignment`).once('value', snap => {
      console.log(snap.val())
      if (snap.exists()) resolve(snap.val().index);
      else {
        resolve(-1);
      }
    });
  });
}
export const setRoundRobinAssignment = async (batchId, index) => {
  console.log({ batchId, index });
  await admin.database().ref(`batches/${batchId}/round-robin-assignment`).set({ index });
}
export const createChatRoomByBatchId = async (batchId, name) => {
    admin.database().ref(`batches/${batchId}/chatrooms`).push({ name }).then(snap => {
      admin.database().ref(`chatrooms/${snap.key}`).set({ name, batchId }).then(() => {
        return Promise.resolve(snap);
      });
    })
};

export const getChatRoomsByBatchId = async (batchId) => {
  return new Promise(resolve => {
    admin.database().ref(`batches/${batchId}/chatrooms`).once('value', snap => {
      if (!snap.exists()) resolve([]);
      else {
        const rooms = snap.val();
        resolve(Object.keys(rooms).map(k => ({...rooms[k], key: k})));
      }
    })
  });
}

export const getAllChatRooms = async () => {
  return new Promise(resolve => {
    admin.database().ref(`chatrooms`).once('value', snap => {
      console.log(snap.val())
      if (!snap.exists()) resolve([]);
      else {
        const rooms = snap.val();
        resolve(Object.keys(rooms).map(k => ({...rooms[k], key: k})));
      }
    })
  });
}
// createChatRoomByBatchId(
//   '6097f0f97c1bc7cda78f733f', '12345'
// ).then((d) => console.log({d})).catch(er => console.log(er))

export const createStreamFromSessionId = async (sessionId, batchId, host, isInstant, startsAt) => {
  const session = await BootcampSession.findById(sessionId).populate('day');
  const zoomClient = new Zoom();
  await zoomClient.init(host)
  console.log((await zoomClient.me()))
  const zoomMtg = await zoomClient.createMeeting({
    type: isInstant ? 1 : 2,
    topic: session.name,
    agenda: '',
    startTime: isInstant ? startsAt: null,
    preSchedule: !isInstant,
  });
  console.log({ zoomMtg })
  const stream = await LiveStream.create({
    name: session.name,
    bootcamp: session.day.bootcamp,
    day: session.day._id,
    week: session.day.week,
    batch: batchId,
    session: sessionId,
    host,
    startsAt: isInstant ? new Date(): startsAt,
    eventId: zoomMtg.id,
  });
  await admin.database().ref(`streams/${stream._id}/status`).set({
    text: 'scheduled',
    updatedAt: new Date().getTime(),
  });
  return stream;
};
// createStreamFromSessionId('60fdc0e8ea2637e0dcbe379e', '6098ec7c7c1bc7cda705c07e', '12345', false, new Date(new Date().getTime() + 1000000).toUTCString())
export const startStream = async (id, eventId) => {
  const stream = await LiveStream.findByIdAndUpdate(id, {
    eventId,
    text: 'started',
  }, {
    new: true,
  });
  await admin.database().ref(`streams/${stream._id}/status`).set({
    text: 'started',
    updatedAt: new Date().getTime(),
    eventId,
    host: stream.host,
    coHosts: stream.coHosts
  });
  return stream;
};

export const endStream = async (id) => {
  const stream = await LiveStream.findByIdAndUpdate(id, {
    text: 'ended',
    updatedAt: new Date().getTime(),
  }, {
    new: true,
  });
  
  await admin.database().ref(`streams/${stream._id}/status`).set({
    text: 'started',
    updatedAt: new Date().getTime(),
  });
  return stream;
};

export const getSessionByMentorAndBatch = async (batchId, userId) => {
  const batch = await Batch.findById(batchId);
  const scheduledSessions = await LiveStream.find({
    batch: batchId,
    host: userId,
  }).populate({
    path: 'day',
    populate: 'week'
  }).lean();
  const nonScheduledSessions = await BootcampSession.find({
    bootcamp: batch.bootcamp,
    _id: {
      $nin: scheduledSessions.map(s => s.session)
    }
  }).populate({
    path: 'day',
    populate: 'week'
  }).lean();
  return {
    scheduledSessions,
    nonScheduledSessions
  }
  // move this to frontend
  const upcomingSessions = scheduledSessions.filter(s => s.scheduledAt > new Date())
};
// getSessionByMentorAndBatch('6098ec7c7c1bc7cda705c07e', '12345').then(d => {
//   console.log(util.inspect(d, false, null, true))
// });

export const getBatchesByMentor = async (userId) => {
	return new Promise((resolve, reject) => {
		admin.database().ref(`users/${userId}`).once('value', async snap => {
			const user = snap.val();
			const batches = await Batch
				.find({ _id: user.batchIds.map(id => mongoose.Types.ObjectId(id)) })
				.populate('bootcamp')
				.select('from to bootcamp')
				.lean();
			resolve(batches)
		});
	})
}

export const getBatchesByStudent = async (userId) => {
  console.log(userId);
	return new Promise((resolve, reject) => {
		admin.database().ref(`users/${userId}`).once('value', async snap => {
			const user = snap.val();
			const batches = await Batch
				.find({ _id: user.batchId })
				.populate('bootcamp')
				.select('from to bootcamp')
				.lean();
			resolve(batches)
		});
	})
}


export const getSessionsByBatch = async (batchId) => {
  return LiveStream.find({
    batch: mongoose.Types.ObjectId(batchId)
  })
    .populate('session', 'name type')
    .populate('week', 'name')
    .populate('day', 'name')
    .lean()
}

export const getProblems = async () => {
  return Problem
    .find()
    .populate('week', 'name')
    .populate('day', 'name')
    .lean()
}


// getMentors()
// admin.database().ref(`users/mWBX6qQoICcU9VCcq9Rfv54cRis2`).set({ chatRoomIds: ['6093dbd17c1bc7cda7967cca'] });
// admin.auth().updateUser('T3nWbiAKRLR30Ce9AM39rv7FLSS2',{
//   password: 'devakumar'
// })
// createMentorAndAddToRoomChat('Devakumar NM', 'dev@write0.in', ['6093dbd17c1bc7cda7967cca']);
// admin.database().ref(`chatrooms/6093dbd17c1bc7cda7967cca`).set({ name: 'Machine Learning Batch May 19' });

//////////////////////// User problems controllers ///////////////////////////////////////////////////////////////

export const addNewProblemInUser = async (req,res,next) => {

  // const r = await UserProblems.findOneAndAndUpdate({
  //   userId: req.body.userId
  // }, {
  //   $addToSet: {
  //     problemIds: req.body.problemId,
  //   }
  // }, {
  //   new: true,
  //   upsert: true,
  // })

  const {userId,problemId} = req.body;

  let userFound;
  try{
    userFound = await UserProblems.findOne({userId: userId}); 
  }catch(err){
    console.log("error in finding user");
  }

  if(userFound){
    let problemIsPresent = userFound.problemIds.find(problem => problem===problemId);
    if(!problemIsPresent){
      userFound.problemIds.push(problemId);
      try{
        await userFound.save();
      }catch(err){
        console.log("problem is not saved in user");
      }
    }
  }
  else{
    userFound = new UserProblems({
      userId: userId,
      problemIds:[problemId]
    });

    try{
      await userFound.save();
    }catch(err){
      console.log(err);
    }
  }

  res.json({userProblems:userFound});
}

export const getUserProblems = async (req,res,next) => {
  
  let userFound;
  try{
    userFound = await UserProblems.findOne({userId: req.params.uid}); 
  }catch(err){
    console.log(err);
    return next(new Error('Something went wrong in finding user'));
  }

  if(!userFound){
    return next(new Error('User not found'));
  }

  res.json({userFound});
}