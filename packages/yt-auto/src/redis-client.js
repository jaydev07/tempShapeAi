import bluebird from 'bluebird';
import redis from 'redis';

const redisUri = process.env.REDIS_URI;
bluebird.promisifyAll(redis);
const redisClient = redis.createClient(redisUri);

redisClient.on('error', (error) => {
  console.log('Redis :', error);
});

export default redisClient;