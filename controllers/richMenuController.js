const path = require("path");
const lineService = require("../services/lineService");

// A面のリッチメニュー作成
const setupRichMenuA = async () => {
  console.log("STEP 1: リッチメニューA作成処理 開始");

  const richMenu = {
    name: "メニューA",
    chatBarText: "メニューを開く",
    size: { width: 2500, height: 1686 },
    selected: true,
    areas: [
      { bounds: { x: 0, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_a", data: "switch_to_service" } },
      { bounds: { x: 1250, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_b", data: "switch_to_chat" } },
      { bounds: { x: 0, y: 201, width: 1486, height: 1485 }, action: { type: "uri", uri: "https://www.mothersgroup.jp/" } },
      { bounds: { x: 1486, y: 201, width: 1014, height: 495 }, action: { type: "uri", uri: "https://paypay.ne.jp/" } },
      { bounds: { x: 1486, y: 696, width: 1014, height: 495 }, action: { type: "uri", uri: "https://www.softbank.jp/" } },
      { bounds: { x: 1486, y: 1191, width: 1014, height: 495 }, action: { type: "uri", uri: "https://developers.line.biz/ja/" } }
    ]
  };

  try {
    const result = await lineService.createRichMenu(richMenu);
    const richMenuId = result.richMenuId;
    console.log("STEP 2: RichMenu A 作成完了:", richMenuId);

    const imagePath = path.resolve(__dirname, "../assets/richmenuA.png");
    console.log("STEP 3: 画像パス:", imagePath);

    const uploadResult = await lineService.uploadRichMenuImage(richMenuId, imagePath);
    console.log("STEP 4: RichMenu A 画像アップロード成功:", uploadResult);

    const defaultResult = await lineService.setDefaultRichMenu(richMenuId);
    console.log("STEP 5: RichMenu A デフォルト設定完了:", defaultResult);

    return richMenuId;
  } catch (error) {
    console.error("❌ RichMenu A 作成中にエラー:", error.response?.data || error.message || error);
    throw error;
  }
};

// B面のリッチメニュー作成
const setupRichMenuB = async () => {
  console.log("STEP 1: リッチメニューB作成処理 開始");

  const richMenu = {
    name: "メニューB",
    chatBarText: "メニューを開く",
    size: { width: 2500, height: 1686 },
    selected: true,
    areas: [
      { bounds: { x: 0, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_a", data: "switch_to_service" } },
      { bounds: { x: 1250, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_b", data: "switch_to_chat" } },
      { bounds: { x: 0, y: 201, width: 833, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 833, y: 201, width: 833, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 1666, y: 201, width: 834, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 0, y: 944, width: 833, height: 743 }, action: { type: "postback", data: "action=show_faq" } },
      { bounds: { x: 833, y: 944, width: 833, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 1666, y: 944, width: 834, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } }
    ]
  };

  try {
    const result = await lineService.createRichMenu(richMenu);
    const richMenuId = result.richMenuId;
    console.log("STEP 2: RichMenu B 作成完了:", richMenuId);

    const imagePath = path.resolve(__dirname, "../assets/richmenuB.png");
    console.log("STEP 3: 画像パス:", imagePath);

    const uploadResult = await lineService.uploadRichMenuImage(richMenuId, imagePath);
    console.log("STEP 4: RichMenu B 画像アップロード成功:", uploadResult);

    return richMenuId;
  } catch (error) {
    console.error("❌ RichMenu B 作成中にエラー:", error.response?.data || error.message || error);
    throw error;
  }
};

// モジュールエクスポート
module.exports = {
  setupRichMenuA,
  setupRichMenuB
};