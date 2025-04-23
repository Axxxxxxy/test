require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const { setupRichMenuA, setupRichMenuB } = require('./controllers/richMenuController');
const { handleLineEvent, createRichMenuAlias } = require('./services/lineService');

const app = express();
app.use(bodyParser.json());

// LINE Webhookエンドポイント
app.post('/webhook', async (req, res) => {
  try {
    const events = req.body.events || [];
    for (const event of events) {
      // 各イベントを処理（分岐ロジックはlineService内に集約）
      await handleLineEvent(event);
    }
    res.status(200).end();
  } catch (error) {
    console.error("Webhook error:", error.message);
    res.status(500).end();
  }
});

// A面リッチメニューを作成
app.get('/setup-richmenu-a', async (_, res) => {
  try {
    const id = await setupRichMenuA();
    res.send(`Rich menu A created: ${id}`);
  } catch (err) {
    console.error("Error in /setup-richmenu-a:", err);
    res.status(500).send("Failed to create RichMenu A");
  }
});

// B面リッチメニューを作成
app.get('/setup-richmenu-b', async (_, res) => {
  try {
    const id = await setupRichMenuB();
    res.send(`Rich menu B created: ${id}`);
  } catch (err) {
    console.error("Error in /setup-richmenu-b:", err);
    res.status(500).send("Failed to create RichMenu B");
  }
});

// A/B面のリッチメニューとエイリアスを作成
app.get('/setup-richmenu-alias', async (_, res) => {
  try {
    const idA = await setupRichMenuA();
    const idB = await setupRichMenuB();

    await createRichMenuAlias("menu_a", idA);
    await createRichMenuAlias("menu_b", idB);

    res.send(`RichMenu A/B created & aliases set. A: ${idA}, B: ${idB}`);
  } catch (err) {
    console.error("Alias setup error:", err.message);
    res.status(500).send("Failed to create alias");
  }
});

const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
