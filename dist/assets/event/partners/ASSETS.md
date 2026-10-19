# 頒獎 Logo 素材與透明處理

原始品牌圖由使用者於 2026-10-19 提供，原圖保留，不覆寫。

- 承羽：`cheng-yu.png`，來源 `/Users/laura/Downloads/承羽.png`，原檔已含透明背景，直接使用。
- 基士德：`gsd.png`，來源 `/Users/laura/Desktop/截圖 2026-10-19 下午4.45.08.png`。在網頁中以原圖的橢圓輪廓透明裁切，保留白色內部字形與原始 GSD 色彩，排除旁邊的文字及白底。
- 維田：`aplex-black-blue-v1.png`，來源使用者新提供的 `/var/folders/vr/k4gq0q212j5dzx64f_svfhfw0000gn/T/TemporaryItems/NSIRD_screencaptureui_ZljKo2/截圖 2026-10-19 晚上9.05.08.png`，黑色字樣與藍色 X。直接使用原圖，於霧銀承載面上以混色去除白底痕跡，沒有重畫字形。舊白色字版本保留但不再使用。
- 豐康：`fong-con-cutout-v1.png`。使用內建 ImageGen 圖片編輯功能從 `fong-con.png`（使用者提供之 `/Users/laura/Desktop/截圖 2026-10-19 下午4.47.34.png`）去除白底。PNG 含透明 alpha；原始生成檔保留於 `/Users/laura/.codex/generated_images/01a11946-4ec9-7f33-8e18-b04845aa9d51/exec-22171fae-2136-4c4d-b4f6-3a15f36e39ef.png`。

豐康去背實際提示詞：

> Use case: background-extraction. Edit target: supplied 豐康 Fong Con company logo. Remove all white background to genuine transparency, outside and inside the circular swooshes and around/between text strokes. Preserve the exact red and blue gradient curved swooshes, original navy calligraphy 豐康 and original Fong Con script with every stroke unchanged. No redesign, no added text, no border, no glow, no shadow. Center tightly with small transparent margin. Genuine transparent PNG.

`gsd-cutout-v2.png`、`aplex-cutout-v2.png` 是未採用的生圖比較稿；正式畫面使用原圖及網頁透明裁切（維田已改用使用者後續提供的黑字版本），以保留品牌字形。沒有將使用者 Logo 改成新的設計。

中央入場、停留及移動由 `event-partner-stage.js` 控制；公司全名由 HTML 文字呈現，不烘焙進 Logo 圖片。
