const axios = require("axios");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");
const { callDify } = require("./difyService");
const { handleMessage } = require("../controllers/messageController"); // ✅ 追加！

// -------------------- リッチメニュー管理 --------------------

const createRichMenu = async (richMenu) => {
  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/richmenu",
      richMenu,
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = response.data;

    if (!data || !data.richMenuId) {
      console.error("❗ richMenuIdが取得できません。レスポンス:", data);
      throw new Error("LINE APIから richMenuId が返されませんでした。");
    }

    console.log("✅ RichMenu作成成功:", data.richMenuId);
    return data;
  } catch (error) {
    const msg = error?.response?.data || error.message;
    console.error("❌ LINE createRichMenu エラー:", msg);
    throw error;
  }
};

const uploadRichMenuImage = async (richMenuId, imagePath) => {
  try {
    const response = await axios.post(
      `https://api-data.line.me/v2/bot/richmenu/${richMenuId}/content`,
      fs.readFileSync(imagePath),
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "image/png",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ 画像アップロード失敗:", error.response?.data || error.message);
    throw error;
  }
};

const setDefaultRichMenu = async (richMenuId) => {
  try {
    const response = await axios.post(
      `https://api.line.me/v2/bot/user/all/richmenu/${richMenuId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("❌ デフォルトリッチメニュー設定失敗:", error.response?.data || error.message);
    throw error;
  }
};

const createRichMenuAlias = async (aliasId, richMenuId) => {
  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/richmenu/alias",
      {
        richMenuAliasId: aliasId,
        richMenuId: richMenuId,
      },
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ エイリアス作成失敗 (${aliasId}):`, error.response?.data || error.message);
    throw error;
  }
};

const deleteRichMenuAlias = async (aliasId) => {
  try {
    const response = await axios.delete(
      `https://api.line.me/v2/bot/richmenu/alias/${aliasId}`,
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`❌ エイリアス削除失敗 (${aliasId}):`, error.response?.data || error.message);
    throw error;
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
    console.error("❌ LINEへの返信失敗:", error.response?.data || error.message);
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
      console.error("❌ Flexメッセージ送信エラー:", err.message);
      return replyMessage({
        replyToken: event.replyToken,
        messages: [{ type: "text", text: "商品の読み込みに失敗しました。" }]
      });
    }
  }

  // テキスト → Dify応答 → ログ保存
  if (event.type === "message" && event.message.type === "text") {
    const aiResponse = await callDify(event.message.text, event.source.userId);

    // ✅ 会話ログ保存をここで呼び出す
    await handleMessage(event, aiResponse);

    return replyMessage({
      replyToken: event.replyToken,
      messages: [{ type: "text", text: aiResponse }]
    });
  }
};

module.exports = {
  handleLineEvent,
  createRichMenu,
  uploadRichMenuImage,
  setDefaultRichMenu,
  replyMessage,
  createRichMenuAlias,
  deleteRichMenuAlias
};