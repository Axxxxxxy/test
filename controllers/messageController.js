const lineService = require("../services/lineService");

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
