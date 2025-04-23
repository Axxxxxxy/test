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
      { bounds: { x: 0, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_a", data: "switch_to_service" } },
      { bounds: { x: 1250, y: 0, width: 1250, height: 201 }, action: { type: "richmenuswitch", richMenuAliasId: "menu_b", data: "switch_to_chat" } },
      { bounds: { x: 0, y: 201, width: 1486, height: 1485 }, action: { type: "uri", uri: "https://www.mothersgroup.jp/" } },
      { bounds: { x: 1486, y: 201, width: 1014, height: 495 }, action: { type: "uri", uri: "https://paypay.ne.jp/" } },
      { bounds: { x: 1486, y: 696, width: 1014, height: 495 }, action: { type: "uri", uri: "https://www.softbank.jp/" } },
      { bounds: { x: 1486, y: 1191, width: 1014, height: 495 }, action: { type: "uri", uri: "https://developers.line.biz/ja/" } }
    ]
  };
  const result = await lineService.createRichMenu(richMenu);
  await lineService.uploadRichMenuImage(result.richMenuId, path.resolve(__dirname, "../assets/richmenuA.png"));
  await lineService.setDefaultRichMenu(result.richMenuId);
  return result.richMenuId;
};

// B面のリッチメニュー作成
const setupRichMenuB = async () => {
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
  const result = await lineService.createRichMenu(richMenu);
  await lineService.uploadRichMenuImage(result.richMenuId, path.resolve(__dirname, "../assets/richmenuB.png"));
  return result.richMenuId;
};

// 必要な関数をエクスポート
module.exports = {
  setupRichMenuA,
  setupRichMenuB
};
