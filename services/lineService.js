const axios = require("axios");
const config = require("../config/config");

const createRichMenu = async (richMenu) => {
  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/richmenu",
      richMenu,
      {
        headers: {
          "Authorization": `Bearer ${config.channelAccessToken}`,
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

const replyMessage = async (quickReply) => {
  try {
    const response = await axios.post(
      "https://api.line.me/v2/bot/message/reply",
      quickReply,
      {
        headers: {
          "Authorization": `Bearer ${config.channelAccessToken}`,
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

module.exports = { createRichMenu, replyMessage };
