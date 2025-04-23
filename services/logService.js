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
    await axios.post("https://script.google.com/macros/s/AKfycbyrDXJCn1NPU_u3uZvIFyVa0KW5aO34uCC3zxDADekB9O2Z0-5fea9za-cR1eXoYxoEDw/exec", payload, {
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
