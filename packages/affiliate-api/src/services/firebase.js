// import env from 'dotenv';
// env.config({
//   path: require('path').join(__dirname, '../../.env')
// })
import * as admin from 'firebase-admin';

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://doubt-app-default-rtdb.asia-southeast1.firebasedatabase.app',
});
export default admin;

export const isPaymentIdAlreadyUsed = (paymentId) => {
  return new Promise((resolve, reject) => {
    admin.database().ref(`paymentsMap/${paymentId}`).once('value', data => {
      resolve(Boolean(data.val()));
    }).catch(er => reject(er));
  })
};

export const getMentorsByBatch = (batchId) => {
  return new Promise((resolve, reject) => {
    admin.database().ref(`chatrooms/${batchId}/mentors`).once('value', data => {
      const mentors = data.val();
      resolve(Object.keys(mentors).map(k => mentors[k]));
    }).catch(er => reject(er));
  })

}
//

// admin.auth().createUser({
//   email: 'abish3e2k@studymonk.in',
//   password: 'devakumar@123',
//   emailVerified: true,
//   displayName: 'Devakumar NM',
// }).then(async u => {
//   const batchId = '224';
//   const token = await admin.auth().createCustomToken(u.uid);
//   console.log({ token });
//   const r1 = await admin.database().ref(`users/${u.uid}`).set({ chatRoomId: batchId });
//   console.log(r1);
//   const r2 = await admin.database().ref(`chatrooms/${batchId}`).push({ user: u.uid });
// })
// admin.database().ref('paymentsMap/123').push({
//   user: 'Dev',
// })