const axios = require('axios');

const callDify = async (userMessage, userId) => {
    try {
      const response = await axios.post(
        `${process.env.DIFY_API_URL}/workflows/run`,  // ← 🔴 ここが足りてなかった！
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

    return response.data.data.outputs.text;
  } catch (error) {
    console.error("❌ Dify API 呼び出しエラー:", error.response?.data || error.message);
    return "申し訳ありません、ただいまAIの応答に失敗しました。";
  }
};

module.exports = { callDify };
