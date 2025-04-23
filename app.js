require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { sendQuickReply } = require('./controllers/messageController');
const { setupRichMenuA, setupRichMenuB } = require('./controllers/richMenuController');
const lineService = require('./services/lineService'); // ← alias登録用に追加

const app = express();
app.use(bodyParser.json());

// Webhookエントリポイント（postback・message 両対応）
app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events || [];

    for (const event of events) {
      console.log("Received event:", JSON.stringify(event)); // ログ出力

      if (event.type === 'postback' && event.postback?.data === 'action=show_faq') {
        if (event.replyToken) {
          await sendQuickReply(event.replyToken);
        }
      } else if (event.type === 'message' && event.replyToken) {
        await sendQuickReply(event.replyToken);
      }
    }

    res.status(200).end(); // LINEに必ず応答
  } catch (error) {
    console.error("Webhook error:", error);
    res.status(500).end();
  }
});

// A面メニューの初期化
app.get('/setup-richmenu-a', async (_, res) => {
  try {
    const id = await setupRichMenuA();
    res.send(`Rich menu A created: ${id}`);
  } catch (err) {
    console.error("Error in /setup-richmenu-a:", err);
    res.status(500).send("Failed to create RichMenu A");
  }
});

// B面メニューの初期化
app.get('/setup-richmenu-b', async (_, res) => {
  try {
    const id = await setupRichMenuB();
    res.send(`Rich menu B created: ${id}`);
  } catch (err) {
    console.error("Error in /setup-richmenu-b:", err);
    res.status(500).send("Failed to create RichMenu B");
  }
});

// A/B面の作成＋エイリアス登録を同時に行う
app.get('/setup-richmenu-alias', async (_, res) => {
  try {
    const idA = await setupRichMenuA();
    const idB = await setupRichMenuB();

    await lineService.createRichMenuAlias("menu_a", idA);
    await lineService.createRichMenuAlias("menu_b", idB);

    res.send(`RichMenu A/B created & aliases set. A: ${idA}, B: ${idB}`);
  } catch (err) {
    console.error("Alias setup error:", err.response?.data || err.message);
    res.status(500).send("Failed to create alias");
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
