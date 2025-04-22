const lineService = require("../services/lineService");

const createRichMenu = async () => {
  try {
    // メニューの作成
    const richMenu = {
      name: "オリジナルリッチメニュー",
      size: { width: 2500, height: 1686 },
      selected: true,
      areas: [
        // 上部2つの領域：メニュー切り替え
        { x: 0, y: 0, width: 1250, height: 201, action: { type: "message", label: "メニューA", text: "メニューA" } },
        { x: 1250, y: 0, width: 1250, height: 201, action: { type: "message", label: "メニューB", text: "メニューB" } },
        // 他の領域も追加
      ],
    };
    await lineService.createRichMenu(richMenu);
  } catch (error) {
    console.error("Error creating rich menu: ", error);
  }
};

module.exports = { createRichMenu };
