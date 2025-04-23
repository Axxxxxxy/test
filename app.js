require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const { sendQuickReply } = require('./controllers/messageController');
const { setupRichMenuA, setupRichMenuB } = require('./controllers/richMenuController');
const lineService = require('./services/lineService');

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events || [];

    for (const event of events) {
      console.log("Received event:", JSON.stringify(event));

      // ✅ FAQ用postbackボタンのみクイックリプライを返す
      if (event.type === 'postback' && event.postback?.data === 'action=show_faq') {
        if (event.replyToken) {
          await sendQuickReply(event.replyToken);
        }
      }

      // ✅ 通常メッセージはここで何も返さない（反応しない）
      // if (event.type === 'message' && event.replyToken) {
      //   await sendQuickReply(event.replyToken);
      // }

      // ✅ Makeへの転送（中継）
      await axios.post('https://hook.us2.make.com/xj6w0fnoiefa8o5xafdxqi12wstk5b1y', event);
    }

    res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error.response?.data || error.message);
    res.status(500).end();
  }
});

app.get('/setup-richmenu-a', async (_, res) => {
  try {
    const id = await setupRichMenuA();
    res.send(`Rich menu A created: ${id}`);
  } catch (err) {
    console.error("Error in /setup-richmenu-a:", err);
    res.status(500).send("Failed to create RichMenu A");
  }
});

app.get('/setup-richmenu-b', async (_, res) => {
  try {
    const id = await setupRichMenuB();
    res.send(`Rich menu B created: ${id}`);
  } catch (err) {
    console.error("Error in /setup-richmenu-b:", err);
    res.status(500).send("Failed to create RichMenu B");
  }
});

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
