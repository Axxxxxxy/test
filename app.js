// import 'dotenv/config';              // ① 環境変数
// import express from 'express';       // ② express 本体
// import bodyParser from 'body-parser';

// ↓ こちらだけ残す（CommonJS 形式）
require('dotenv').config();      // 環境変数読み込み
const express = require('express');
const bodyParser = require('body-parser');

// import { sendQuickReply }   from './controllers/messageController.js';
// import { createRichMenu }   from './controllers/richMenuController.js';
const { sendQuickReply } = require('./controllers/messageController');
const { createRichMenu } = require('./controllers/richMenuController');

const app = express();
app.use(bodyParser.json());

// LINE から Webhook が届く入り口
app.post('/webhook', async (req, res) => {
  const events = req.body.events || [];
  for (const event of events) {
    if (event.replyToken) {
      await sendQuickReply(event.replyToken);
    }
  }
  res.status(200).end();
});

// （初回だけ）リッチメニュー作りたいときに叩く
app.get('/setup-richmenu', async (_, res) => {
  await createRichMenu();
  res.send('Rich menu created!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
