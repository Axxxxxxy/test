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
    await axios.post("https://script.google.com/macros/s/AKfycbwP93HLd-SvRq5c9J-UsmTlR0VZUeeLBhAJkAaGhDJQU4Htmp_jvwkhnhZ3UKvD4LF_Ww/exec", payload, {
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
