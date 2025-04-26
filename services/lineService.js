const axios = require("axios");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");
const { callDify } = require("./difyService");
const { handleMessage } = require("../controllers/messageController");

// --- pushMessageを追加 ---
const pushMessage = async (userId, text) => {
  try {
    return await axios.post(
      "https://api.line.me/v2/bot/message/push",
      {
        to: userId,
        messages: [{ type: "text", text }]
      },
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("LINEへのPush失敗:", error.response?.data || error.message);
  }
};

const replyMessage = async (body) => {
  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      body,
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("LINEへの返信失敗:", error.response?.data || error.message);
    throw error;
  }
};

// -------------------- イベントルーティング --------------------

const handleLineEvent = async (event) => {
  // FAQクイックリプライ
  if (event.type === "postback" && event.postback.data.includes("show_faq")) {
    return replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: "text",
        text: "よくある質問からお選びください！",
        quickReply: {
          items: [
            {
              type: "action",
              action: { type: "message", label: "返品について", text: "返品について教えて" }
            },
            {
              type: "action",
              action: { type: "message", label: "支払い方法", text: "支払い方法を教えて" }
            }
          ]
        }
      }]
    });
  }

  // 商品検索 → Flexメッセージ
  if (event.type === "postback" && event.postback.data === "action=search_product") {
    try {
      const carouselJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../assets/json/sample.json"), "utf-8"));
      return replyMessage({
        replyToken: event.replyToken,
        messages: [{
          type: "flex",
          altText: "おすすめ商品はこちら！",
          contents: carouselJson
        }]
      });
    } catch (err) {
      console.error("Flexメッセージ送信エラー:", err.message);
      return replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: "text", text: "商品の読み込みに失敗しました。" }]
      });
    }
  }

  // テキスト → 即時返信 → 非同期Dify → pushで送信
  if (event.type === "message" && event.message.type === "text") {
    const { replyToken, source, message } = event;

    // ① 即時仮返信
    replyMessage({
      replyToken,
      messages: [{ type: "text", text: "AIが回答を作成中です…" }]
    });

    // ② 非同期処理
    callDify(message.text, source.userId)
      .then(async (aiResponse) => {
        await handleMessage(event, aiResponse); // ログ保存
        await pushMessage(source.userId, aiResponse); // 本回答をPush送信
      })
      .catch(async (err) => {
        console.error("Dify解読不可:", err.message);
        await pushMessage(source.userId, "当窓口では対応が難しい内容でございます。詳細はオペレーター（9:00〜20:00／年中無休）までお問い合わせください。");
      });

    return; // 即応済みなので終了
  }
};

module.exports = {
  handleLineEvent,
  replyMessage,
  pushMessage
};