const axios = require("axios");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");
const { callDify } = require("./difyService");

// -------------------- リッチメニュー管理 --------------------

// リッチメニュー作成
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
    return response.data;
  } catch (error) {
    console.error("Error creating rich menu:", error);
    throw error;
  }
};

// リッチメニュー画像アップロード
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
    console.error("Error uploading rich menu image:", error);
    throw error;
  }
};

// デフォルトリッチメニューを設定
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
    console.error("Error setting default rich menu:", error);
    throw error;
  }
};

// リッチメニューのエイリアスを作成
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
    console.error(`Error creating alias '${aliasId}':`, error);
    throw error;
  }
};

// リッチメニューのエイリアス削除
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
    console.error(`Error deleting alias '${aliasId}':`, error);
    throw error;
  }
};

// LINEへの返信
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
    console.error("Error sending message to LINE:", error);
    throw error;
  }
};

// -------------------- イベントルーティング本体 --------------------

// LINEイベントを処理する（postback, message）
const handleLineEvent = async (event) => {
  if (event.type === "postback" && event.postback.data.includes("show_faq")) {
    // クイックリプライ応答
    return replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: "text",
        text: "よくある質問からお選びください！",
        quickReply: {
          items: [
            {
              type: "action",
              action: {
                type: "message",
                label: "返品について",
                text: "返品について教えて"
              }
            },
            {
              type: "action",
              action: {
                type: "message",
                label: "支払い方法",
                text: "支払い方法を教えて"
              }
            }
          ]
        }
      }]
    });
  }

  if (event.type === "message" && event.message.type === "text") {
    // Difyへ問い合わせて応答を取得 → LINEに返す
    const aiResponse = await callDify(event.message.text, event.source.userId);

    return replyMessage({
      replyToken: event.replyToken,
      messages: [{
        type: "text",
        text: aiResponse
      }]
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
