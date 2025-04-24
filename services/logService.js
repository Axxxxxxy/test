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
    await axios.post("https://script.google.com/macros/s/AKfycbwGQK4xKmFi3DlufqVPAjVUyiashQc8fATIy8GpCNdcwVQgx26-GOyzQTtpvd7hIwmfQw/exec", payload, {
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
