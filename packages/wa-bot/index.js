const { create, Client, ev } = require('@open-wa/wa-automate');
const fs = require('fs')
const Queue = require('bull');
// or
// import { create, Client } from '@open-wa/wa-automate';
const express = require('express');
const app = express();

const MessageQueue = new Queue('Message-Queue', process.env.REDIS || 'redis://127.0.0.1:6379', {
  limiter: {
    max: 6,
    duration: 1000,
  },
})
let waClient;
function start(client) {
  waClient = client;
  // client.kill();
  let groupChats = [];
  MessageQueue.process(async (job, done) => {
    console.log('job');
  });
  
  client.getAllGroups().then(groupChats => {
    groupChats.forEach(gc => {
      if (gc.name === "Test") {
        client.sendText(gc.id, 'Hii automated text to whatsapp group').then(() => {
          console.log('done')
        })
      }
    })
  })
  client.onMessage(async message => {
    if (message.body === 'Hi') {
      await client.sendText(message.from, '👋 Hello!');
    }
  });
  app.listen(5656, () => console.log('wa-bot running'))
}
ev.on('qr.**', async qrcode => {
  //qrcode is base64 encoded qr code image
  //now you can do whatever you want with it
  console.log('eeeeeeeeeeeeeeeeeee',typeof qrcode)
  const imageBuffer = Buffer.from(
    qrcode.replace('data:image/png;base64,', ''),
    'base64'
  );
  fs.writeFileSync('qr_code.png', imageBuffer);
});

create({
  headless: true,
  skipSessionSave: true,
  sessionId: 'hj',
  cacheEnabled: false,
}).then(start);

app.use(express.static('public'));
app.post('/message-batch', async (req, res) => {
  const { filter, message } = req.body;
  waClient.getAllGroups().then(groups => {
    const targetGroups = groups.filter(gc => filter.some(f => gc.name.includes(f)));
    console.log({ targetGroups });
  });
});

