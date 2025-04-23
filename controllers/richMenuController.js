const path = require("path");
const lineService = require("../services/lineService");

// A面のリッチメニュー作成
const setupRichMenuA = async () => {
  const richMenu = {
    name: "メニューA",
    chatBarText: "メニューを開く",
    size: { width: 2500, height: 1686 },
    selected: true,
    areas: [
      // 上部：タブ切り替え
      { bounds: { x: 0, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_a", data: "switch_to_service" } },
      { bounds: { x: 1250, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_b", data: "switch_to_chat" } },
      // 下部：リンクエリア
      { bounds: { x: 0, y: 201, width: 1486, height: 1485 }, action: { type: "uri", uri: "https://www.mothersgroup.jp/" } },
      { bounds: { x: 1486, y: 201, width: 1014, height: 495 }, action: { type: "uri", uri: "https://paypay.ne.jp/" } },
      { bounds: { x: 1486, y: 696, width: 1014, height: 495 }, action: { type: "uri", uri: "https://www.softbank.jp/" } },
      { bounds: { x: 1486, y: 1191, width: 1014, height: 495 }, action: { type: "uri", uri: "https://developers.line.biz/ja/" } }
    ]
  };

  // リッチメニュー作成
  const result = await lineService.createRichMenu(richMenu);
  const richMenuId = result.richMenuId;
  console.log("RichMenu A created:", richMenuId);

  // 画像ファイルをアップロード（assets/richmenuA.png）
  const uploadResult = await lineService.uploadRichMenuImage(
    richMenuId,
    path.resolve(__dirname, "../assets/richmenuA.png")
  );
  console.log("Image uploaded for RichMenu A:", uploadResult);

  // このリッチメニューをデフォルト設定（全ユーザーに表示）
  const defaultResult = await lineService.setDefaultRichMenu(richMenuId);
  console.log("Default RichMenu set for all users (A):", defaultResult);

  return richMenuId;
};

// B面のリッチメニュー作成
const setupRichMenuB = async () => {
  const richMenu = {
    name: "メニューB",
    chatBarText: "メニューを開く",
    size: { width: 2500, height: 1686 },
    selected: true,
    areas: [
      // 上部：タブ切り替え
      { bounds: { x: 0, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_a", data: "switch_to_service" } },
      { bounds: { x: 1250, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_b", data: "switch_to_chat" } },
      // 下部：リンクおよびFAQアクション
      { bounds: { x: 0, y: 201, width: 833, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 833, y: 201, width: 833, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 1666, y: 201, width: 834, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 0, y: 944, width: 833, height: 743 }, action: { type: "postback", data: "action=show_faq" } },
      { bounds: { x: 833, y: 944, width: 833, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } },
      { bounds: { x: 1666, y: 944, width: 834, height: 743 }, action: { type: "uri", uri: "https://example.com/no-action" } }
    ]
  };

  // リッチメニュー作成
  const result = await lineService.createRichMenu(richMenu);
  const richMenuId = result.richMenuId;
  console.log("RichMenu B created:", richMenuId);

  // 画像ファイルをアップロード（assets/richmenuB.png）
  const uploadResult = await lineService.uploadRichMenuImage(
    richMenuId,
    path.resolve(__dirname, "../assets/richmenuB.png")
  );
  console.log("Image uploaded for RichMenu B:", uploadResult);

  // デフォルト設定はA側で実施済みの想定
  return richMenuId;
};

// エクスポート
module.exports = {
  setupRichMenuA,
  setupRichMenuB
};
