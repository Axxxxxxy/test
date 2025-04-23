const axios = require("axios");
const config = require("../config/config");
const fs = require("fs");
const path = require("path");

// リッチメニューを新規作成する
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

// 作成済みのリッチメニューに画像をアップロードする
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

// リッチメニューを全ユーザーにデフォルトで設定する
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

// クイックリプライなどの返信メッセージを送信する
const replyMessage = async (quickReply) => {
  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      quickReply,
      {
        headers: {
          Authorization: `Bearer ${config.channelAccessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error sending quick reply:", error);
    throw error;
  }
};

// 必要な関数を外部に公開
module.exports = {
  createRichMenu,
  uploadRichMenuImage,
  setDefaultRichMenu,
  replyMessage
};
