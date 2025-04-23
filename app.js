require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { sendQuickReply } = require('./controllers/messageController');
const { setupRichMenuA, setupRichMenuB } = require('./controllers/richMenuController');

const app = express();
app.use(bodyParser.json());

// Webhookエントリポイント（postback・message 両対応）
app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events || [];

    for (const event of events) {
      console.log("Received event:", JSON.stringify(event)); // ← ログ出力追加

      if (event.type === 'postback' && event.postback?.data === 'action=show_faq') {
        if (event.replyToken) {
          await sendQuickReply(event.replyToken);
        }
      } else if (event.type === 'message' && event.replyToken) {
        await sendQuickReply(event.replyToken);
      }
    }

    res.status(200).end(); // 必ず200 OKを返す
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).end();
  }
});

// A面メニューの初期化
app.get('/setup-richmenu-a', async (_, res) => {
  const id = await setupRichMenuA();
  res.send(`Rich menu A created: ${id}`);
});

// B面メニューの初期化
app.get('/setup-richmenu-b', async (_, res) => {
  const id = await setupRichMenuB();
  res.send(`Rich menu B created: ${id}`);
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
