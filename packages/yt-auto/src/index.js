import 'dotenv/config';
import express from "express";
import axios from 'axios';
import Queue from 'bull'
import redisClient from "./redis-client";
import { createBullBoard } from 'bull-board';
import { BullAdapter } from  'bull-board/bullAdapter'

import cron from 'node-cron';
const app = express();
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
const googleAPIKey = process.env.GOOGLE_API_KEY;
const redirectUri = process.env.REDIRECT_URI;

const tokenAPI = () => axios.create({
  baseURL: 'https://oauth2.googleapis.com',
});

const DeletingQueue = new Queue('Delete-Queue', process.env.REDIS_URI, {
  limiter: {
    max: 11,
    duration: 1000,
  },
});

const getAccessToken = async () => {
  let accessToken = await redisClient.getAsync('accessToken');
  console.log({ accessToken });
  if (!accessToken || accessToken === 'null') {
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: googleClientId,
      client_secret: googleClientSecret,
      refresh_token: await redisClient.getAsync('refreshToken'),
      grant_type: 'refresh_token'
    });
    const { access_token, expires_in } = data;
    console.log('use refresh tokee', access_token);
    await redisClient.setexAsync('accessToken', expires_in - 90, access_token);
    return access_token;
  }
  return accessToken;
  
  
}

DeletingQueue.process(async (job, done) => {
  try {
    const { id } = job.data;
    await deleteComment(id, await getAccessToken());
    done(null, true);
  } catch (e) {
    if ('response' in e) done(new Error(JSON.stringify(e.response.data)));
    else done(e);
    console.log(new Date().getTime(), e);
  }
  
});

const { router } = createBullBoard([
  new BullAdapter(DeletingQueue),
])

const youtubeApi = () => axios.create({
  baseURL: 'https://www.googleapis.com/youtube/v3'
});

const fetchComments = async (nextPageToken) => {
  const params = {
    key: googleAPIKey,
    maxResults: 100,
    part: 'snippet',
    allThreadsRelatedToChannelId: process.env.YOUTUBE_CHANNEL_ID,
  }
  if (nextPageToken) params['nextPageToken'] = nextPageToken;
  return (await youtubeApi().get('/commentThreads', { params })).data
};

const deleteComment = async (id, accessToken) => {
  console.log({id, accessToken
  });
  return (await youtubeApi().delete('/comments', {
    params: { id, key: googleAPIKey },
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  })).status === 204;
}

const filterCommentsToProcessAndAddToQueue = (lastProcessedCommentIndex, comments) => comments
  .slice(lastProcessedCommentIndex)
  .filter(i => /\d/.test(i.snippet.topLevelComment.snippet.textOriginal))
  .forEach(i => {
    console.log(i.snippet.topLevelComment.snippet.textOriginal);
    DeletingQueue.add({
      id: i.snippet.topLevelComment.id,
      comment: i.snippet.topLevelComment.snippet.textOriginal
    });
  });

app.get('/link', async (req, res) => {
  const link = `https://accounts.google.com/o/oauth2/v2/auth?state=bleh&access_type=offline&prompt=consent&client_id=${googleClientId}&scope=https://www.googleapis.com/auth/youtube.force-ssl https://www.googleapis.com/auth/youtube.readonly openid email profile&include_granted_scopes=true&response_type=code&redirect_uri=${redirectUri}`;
  res.redirect(link);
});

app.get('/google', async (req, res) => {
  try {
    const { code } = req.query;
    const tokenRes = await tokenAPI().post('/token', {
      client_id: googleClientId,
      client_secret: googleClientSecret,
      code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    });
    if (tokenRes.status !== 200)
      throw new Error('Google API fail while fetching access_token');
    console.log(tokenRes.data);
    await redisClient.setexAsync('accessToken', tokenRes.data.expires_in - 100, tokenRes.data.access_token);
    await redisClient.setAsync('refreshToken', tokenRes.data.refresh_token);
    res.send('<h1>Account Linked</h1>')
  } catch (e) {
    console.log(e);
    throw e;
  }
});


const cronJob = async () => {
  const lastProcessedCommentTime = await redisClient.getAsync('lastProcessedCommentTime');
  const { items } = await fetchComments();
  let commentsToProcess = [];
    let lastProcessedCommentIndex = items.findIndex(c =>  new Date(c.snippet.topLevelComment.publishedAt) >= new Date(lastProcessedCommentTime));
    if (lastProcessedCommentIndex === items.length - 1)
      return console.log('No new comments to process');
    if (lastProcessedCommentIndex !== -1) {
      filterCommentsToProcessAndAddToQueue(lastProcessedCommentIndex,items);
      await redisClient.setAsync('lastProcessedCommentTime', new Date(items[items.length - 1].snippet.topLevelComment.publishedAt).getTime());
    } else {
      filterCommentsToProcessAndAddToQueue(0,items);
      await redisClient.setAsync('lastProcessedCommentTime', new Date(items[items.length - 1].snippet.topLevelComment.publishedAt).getTime());
    }
};
cronJob()
app.use('/bullMonitor', router);
app.listen(5005, () => {
  console.log("YT Running");
  cron.schedule('*/1 * * * *', () => {
    console.log(new Date().getTime(), 'cron started');
    cronJob()
      .then(() => console.log(new Date().getTime(), 'cron finished'))
      .catch(e => console.log(new Date().getTime(), 'cron errored', e))
  });
  
});