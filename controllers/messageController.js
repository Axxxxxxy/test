const lineService = require("../services/lineService");
const { saveConversationLog } = require("../services/logService");

// クイックリプライ送信用関数
const sendQuickReply = async (replyToken) => {
  const quickReply = {
    replyToken,
    messages: [
      {
        type: "text",
        text: "ご質問は何ですか？",
        quickReply: {
          items: [
            {
              type: "action",
              action: { type: "message", label: "支払い方法", text: "支払い方法" },
            },
            {
              type: "action",
              action: { type: "message", label: "返品ポリシー", text: "返品ポリシー" },
            },
          ],
        },
      },
    ],
  };
  await lineService.replyMessage(quickReply);
};

// Botのメッセージ応答処理内で呼び出す用（例）
const handleMessage = async (event, replyText) => {
  const userId = event.source.userId;
  const messageText = event.message.text;

  // 会話ログ保存
  await saveConversationLog({
    userId,
    category: "FAQ", // 仮で「FAQ」だが分類ロジックあれば置き換え
    messageText,
    botReply: replyText,
  });
};

module.exports = {
  sendQuickReply,
  handleMessage, // ← Botからの返信処理などで使う用
};
