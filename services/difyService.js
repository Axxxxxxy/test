const axios = require('axios'); // ← 1回だけ宣言でOK！

// Dify API に質問を送る関数
const callDify = async (userMessage, userId) => {
  try {
    const response = await axios.post(
      `${process.env.DIFY_API_URL}/workflows/run`,
      {
        inputs: {
          LLM_input: userMessage
        },
        response_mode: 'blocking',
        user: userId
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.DIFY_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // 安全にテキスト抽出
    const aiText = response?.data?.data?.outputs?.text;
    return aiText || "該当内容については、当窓口では対応が難しい内容でございます。詳細はオペレーター（9:00〜20:00／年中無休）までお問い合わせください。";

  } catch (error) {
    const msg = error?.response?.data?.message || error.message;
    console.error("Dify API 呼び出しエラー:", msg);
    return "該当内容については、当窓口では対応が難しい内容でございます。詳細はオペレーター（9:00〜20:00／年中無休）までお問い合わせください。";
  }
};

module.exports = { callDify };
