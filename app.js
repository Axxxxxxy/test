require('dotenv').config();      // 環境変数読み込み
const express = require('express');
const bodyParser = require('body-parser');

const { sendQuickReply } = require('./controllers/messageController');
const { setupRichMenuA, setupRichMenuB } = require('./controllers/richMenuController');

const app = express();
app.use(bodyParser.json());

// LINE から Webhook が届く入り口
app.post('/webhook', async (req, res) => {
  const events = req.body.events || [];

  for (const event of events) {
    // STEP 4: postbackアクション（例：FAQ）を判定
    if (event.type === 'postback' && event.postback?.data === 'action=show_faq') {
      await sendQuickReply(event.replyToken);
    }

    // それ以外の通常メッセージ応答
    else if (event.type === 'message' && event.replyToken) {
      await sendQuickReply(event.replyToken); // 今回は統一的にクイックリプライを返す仕様
    }
  }

  res.status(200).end();
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

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
