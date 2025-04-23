const lineService = require("../services/lineService");
// messageController.js
const { saveConversationLog } = require("./logService");
// messageController.js
const { saveConversationLog } = require("./logService");

// メッセージ受信処理内などに追加
await saveConversationLog({
  userId,
  category: "FAQ", // or "その他" or テキスト分類
  messageText: event.message.text,
  botReply: replyText,
});

// メッセージ受信処理内などに追加
await saveConversationLog({
  userId,
  category: "FAQ", // or "その他" or テキスト分類
  messageText: event.message.text,
  botReply: replyText,
});

const sendQuickReply = async (replyToken) => {
  const quickReply = {
    replyToken,
    messages: [
      {
        type: "text",
        text: "ご質問は何ですか？",
        quickReply: {
          items: [
            { type: "action", action: { type: "message", label: "支払い方法", text: "支払い方法" } },
            { type: "action", action: { type: "message", label: "返品ポリシー", text: "返品ポリシー" } },
          ],
        },
      },
    ],
  };
  await lineService.replyMessage(quickReply);
};

module.exports = { sendQuickReply };
