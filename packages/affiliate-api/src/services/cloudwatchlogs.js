import aws from 'aws-sdk';

const cloudwatchLogs = new aws.CloudWatchLogs({
  accessKeyId: process.env.AWS_MAIN_KEY,
  secretAccessKey: process.env.AWS_MAIN_SECRET,
  region: 'ap-south-1',
});

export const logError = async ({ logGroupName, logStreamName, errMessage }) => {
  try {
    await cloudwatchLogs.createLogStream({
      logGroupName,
      logStreamName,
    }).promise();
  } catch (e) {
    if (e.code === 'ResourceNotFoundException') {
      await cloudwatchLogs.createLogGroup({
        logGroupName,
      }).promise();
    }
  }
  return (await cloudwatchLogs.putLogEvents({
    logEvents: [
      {
        message: errMessage,
        timestamp: new Date().getTime(),
      }
    ],
    logGroupName: logGroupName,
    logStreamName: logStreamName,
  }).promise()).nextSequenceToken;
};

