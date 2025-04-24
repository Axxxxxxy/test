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
    await axios.post("https://script.google.com/macros/s/AKfycbxkEgU8xjGbDOgnRx-9Ak6AgD568lj_2V86UUOAwkxzuCsl5GiUkeckPxr-UkB0QCGR_g/exec", payload, {
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
