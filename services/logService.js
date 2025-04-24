// logService.js
const axios = require("axios");

async function saveConversationLog({ userId, category, messageText, botReply }) {
  const payload = {
    userId,
    category,
    messageText,
    botReply,
  };

  try {
    await axios.post("https://script.google.com/macros/s/AKfycbzZapLZm99lVDdF2KWlcjQmY_u-1E-ITOCWa1s4oskC35gavb6uCUoEsImaAEww7R2Uqg/exec", payload, {
      headers: { "Content-Type": "application/json" },
    });
    console.log("✅ 会話ログ送信完了");
  } catch (error) {
    console.error("❌ 会話ログ送信失敗:", error.message);
  }
}

module.exports = {
  saveConversationLog,
};
