# 素材來源與使用範圍

以下保留原製作時的來源與查閱日期，未於本次 GitHub 同步重新查證外部網站。

## 內容與圖像來源

使用者提供：`AIWin_WinHub.AI_完整Pitch_v5_20260821.pptx`。原始 PPT 保留在本機，不納入網站或來源庫。

- 第 5–6 頁：2016 成立、150+ 交付 AI 專案、30+ 產業及十年歷程。數據依此份 2026.08 簡報，沒有另行驗證。
- 第 19–21 頁：WinChat、RAG、Agent 工具與多領域協作。
- 第 23、25 頁：訓練平台與邊緣推論產品定位、配色與部署關係。
- 第 28 頁：`pitch-wafer-map.png`，AIWinOps + WinEdge-V、六類 Wafer Map 缺陷。
- 第 29–31 頁：`pitch-hose-detection.png`、`pitch-mesh-anomaly.png`、`pitch-tooth-segmentation.png`，分別為膠管偵測、鐵網異常、牙齒分割。由 PPT 直接取出原圖；保留為後續可用素材。
- 第 43、45–47、49 頁：五個代表案例影片，依序為瓶蓋瑕疵、工安監控、雞蛋計數分類、秤重 SOP、組裝 SOP。從 PPT 內嵌影片抽取、轉為 H.264 MP4，保留全長；秤重標示 PoC，其餘依簡報標示應用展示或技術實證，不把技術提案當作正式交付。詳細對應見 [Vision 影片來源](../dist/assets/vision/CREDITS.md)。背景小積木為累積經驗的象徵，數量不代表已交付影像專案統計。
- 第 34 頁：`pitch-oven-temperature.png`，NumOps + WinEdge-N、27 個風門、15 個溫度點。175–185℃ 僅為此案例目標範圍。
- 第 38 頁：`pitch-winchat.png`，企業知識管理與 WinChat 介面。Agent 工具協作另參第 20 頁。
- 五個領域名稱來自使用者原始架構圖：智慧水務、瑕疵檢測、安全監控、設備監控、文件助理。領域工作流與城堡為架構概念，沒有宣稱全部已完成客戶導入。
- 不引用簡報中未確認的客戶名稱、通用準確率、ROI 或 PoC 效果作為正式生產承諾。

新增取像參考（2026-09-20）：`basler-ace2-usb.jpg` 為 Basler AG 官方 ace 2 USB 3.0 工業相機圖片，原圖未修改，點選相機介紹可展開。來源：https://docs.baslerweb.com/a2a1920-160ucbas ；原圖：https://docs.baslerweb.com/images/image-ace-2-bas-usb-color.jpg 。相機 3D 模型依產品照片重塑外觀，不代表工程尺寸重建；工業用途與 USB 介面不是互斥分類，亦不宣稱特定型號的 WinEdge 相容性認證或合作關係。

### 真實相機造型參考（2026-09-20）

`dist/camera-models.js` 依下列官方照片建立三款程序化 3D 模型，外殼、接環、接頭、收音孔與支架為獨立幾何結構。出場時先展開部件，再裝配定位，停留時緩慢擺動；減少動態效果模式直接呈現完整模型。尺寸為舞台可讀性調整，不是廠商 CAD 或相容性認證。

- **Basler ace 2 USB 3.0**：黑色方形機身、銀色前後框、開放 C-mount 接環及感光元件、後部 Micro-B / I/O 接頭。沿用上列官方圖；鏡頭需另配，故模型保留照片中的無鏡頭機身。
- **AXIS P1465-LE**：[官方產品頁](https://www.axis.com/products/axis-p1465-le/support)。照片觀察重點為白色筒型機身、弧形遮陽罩、黑色光學前窗、可調支臂及圓形壁掛底座。參考原圖：https://www.axis.com/sites/axis/files/styles/square_500x500_/public/2022-11/p1465le_p1467le_p1468le_wall_angle_left_2112-Productimage.png.webp?itok=ieQv_jR_
- **Logitech C920 HD Pro**：[官方產品頁](https://www.logitech.com/en-au/shop/p/c920-pro-hd-webcam)。寬形黑色外殼、中央光學鏡片、兩側網孔及藍色細條、折疊螢幕夾座。USB 線與插頭依官方安裝指南補充為可辨識介面的示意。參考原圖：https://resource.logitech.com/c_fill,q_auto,f_auto,dpr_1.0/d_transparent.gif/content/dam/logitech/en/products/webcams/c920/gallery/c920-gallery-1.png ；[安裝指南](https://www.logitech.com/assets/42685/c920-quickstart-guide.pdf)。
- AXIS、Logitech 照片僅在本機參考，不納入網站資產；畫面使用自行建立的立體模型。商標屬各廠商，未宣稱合作關係。參考廠商圖片規則：[Axis](https://www.axis.com/dam/public/e9/35/3c/guidelines-for-using-axis-trademarks-and-copyrights-en-US-186188.pdf)、[Logitech](https://www.logitech.com/en-ae/tos/logitech-assets-license)。

官方資料（查閱 2026-09-15）：

- 公司歷程：https://aiwin.com.tw/track-record
- 官方案例：https://aiwin.com.tw/actual-case
- 平台發展背景：https://www.aiwin.com.tw/en/archives/15696
- WinEdge-N 定位與設備儀表板 `winedge-n.png`：https://winhub.ai/zh-Hans/winedge-n
- WinEdge-V 定位與金屬檢測圖 `metal-inspection.png`：https://winhub.ai/zh-Hans/winedge-v
- `aiwin-2020-tie-exhibition.png`：https://aiwin.com.tw/archives/3690 ，2020 台灣創新技術博覽會合影。
- `ai-aoi-inspection.jpg`、`ai-data-water-operations.jpg`：官方案例拼版，保留為後續可用素材。

## 公司介紹素材（2026-10-08）

- 使用者提供 `Logo去背.png`，原樣保留為 `dist/assets/aiwin-company-logo.png`，供公司介紹章節使用。
- 公司簡介來自使用者提供的「About AIWin」截圖（頁碼 4）：企業 AI 導入專家，深耕智慧製造、半導體與企業 AI 應用；150+ AI 專案交付、30+ 產業服務經驗、6 項國家專利；越南、韓國、泰國海外市場；WinHub.AI 融合視覺辨識、數據分析、知識中樞與邊緣運算。
- 數據依本次提供資料呈現；選定版型以四項產品的螢幕素材取代能力積木。

### WinHub.AI 產品展示素材（2026-10-08）

- 使用者提供 `WinHub.png`、`AIWinOps空白.png`、`NumOps空白.png`、`WinChat空白.png`、`WinEdge空白.png`；原檔分別複製至 `dist/assets/company-products/*-original.png`。
- `*-cutout-v1.png` 使用內建 `image_gen`，以對應原檔為參考並設定透明背景。WinHub 僅保留中央符號與字標；其餘移除白底、標題框和外框，保留螢幕及底座。
- AI 去背衍生圖供概覽展示，螢幕細節可能與原稿有差異；每項產品的放大視窗附原始素材連結。原始檔未覆寫。
- AIWin 為公司品牌；WinHub.AI 為融合式 AI 平台。舞台由 AIWinOps、NumOps、WinChat、WinEdge 四項產品組成，使用者提供的橘／紫／藍／青配色用於產品識別。
- 完整生成提示與來源對應見 [company-image-prompts.json](company-image-prompts.json)。

## 設計參考與授權

參考 Shopify Winter 2026、oryzo.ai、sidewave.it 的章節節奏及立體主體，LEGO 官方產品照片的積木結構；沒有複製網站程式碼或使用 LEGO 標誌。

Three.js 0.180.0：MIT，授權見 [Three.js MIT 授權](../dist/vendor/THREE-LICENSE.txt)。品牌簡報與官網圖像僅用於本次品牌演講網站。

`dist/vendor/Reflector.js` 取自 Three.js 0.180.0 官方套件的 `examples/jsm/objects/Reflector.js`（https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/objects/Reflector.js），僅將模組匯入改為本機路徑；沿用上述 MIT 授權。


## 星空與地球

貼圖原始連結、署名及授權見 [Universe 素材說明](../dist/assets/universe/CREDITS.md)。

以下比較、套組與第二版段落為設計歷程；目前正式使用的素材以最後一節為準。

### 宇宙背景比較預覽（2026-10-08）

- 使用內建 `image_gen` 製作四款藝術背景：地球曙光、深空銀河、極光星海、月境鉑銀；不是天文實景紀錄。
- 四款原圖均為 1672 × 941 PNG，保存在 `dist/assets/cosmic-backgrounds/`；同名 WebP 以 quality 92 編碼，未變更像素尺寸。頁面載入 WebP，四張合計約 352 KiB。
- [完整生成提示](cosmic-background-prompts.json)與[資產對照](cosmic-background-assets.json)保留供後續精修。
- 公司介紹頁以 `?background=earth#company`、`galaxy`、`aurora`、`lunar` 提供比較；切換會保留其他查詢參數與章節。未帶 `background` 參數時保留原本動態宇宙背景。
- 背景沿用全視窗固定座標並等比例裁切；手機把圖像收至下半部，以漸隱保護文字區。比較控制列不參與正文排版。

### 封面／內頁／封底完整套組（2026-10-08）

- 依使用者補充，每一主題各自搭配不同的封面、內頁、封底背景，共 4 套、12 張；原先四張作為內頁，新生成八張為 `*-cover-v1` 與 `*-closing-v1`。
- 八張新增圖使用同一內建 `image_gen` 模式，均為 1672 × 941 PNG；未裁切或改色，另存 quality 92 WebP 供網頁使用。完整提示見 [cosmic-suite-prompts.json](cosmic-suite-prompts.json)，來源與存檔對應見 [cosmic-suite-assets.json](cosmic-suite-assets.json)。
- `background-page=cover` 顯示既有開場；`interior` 顯示公司介紹；`closing` 顯示獨立封底預覽，搭配新擬收尾文案「下一個十年，與你同行」。三種頁型共用同一組主題選擇器；一般章節導覽也會自動選擇封面或內頁背景。
- 封底只加入背景比較模式，尚未變更正式章節順序。選定套組後再整合正式封底與預設背景。

### 地球曙光第二版（2026-10-08）

- 依使用者選擇，原先內頁的 `earth-v1.webp` 改用於封面；內頁另以內建 `image_gen` 生成 `earth-interior-v2.png`，搭配同尺寸、quality 92 的 WebP。新內頁以大面積深藍留白與右下緣低對比銀河為主，不含月球或行星。
- 封底繼續使用 `earth-closing-v1.webp`。已移除月境鉑銀的預覽選項，舊月境網址自動回到地球曙光；舊素材保留為歷史稿，網頁不再引用。
- 現在預覽提供地球曙光、深空銀河、極光星海三套。[本次來源、生成提示與現行素材對應](earth-background-revision-v2.json)。

### 深空銀河、極光星海內頁第二版（2026-10-08）

- 依使用者要求，另以內建 `image_gen` 製作 `galaxy-interior-v2` 與 `aurora-interior-v2`，只替換第 2、3 套的內頁背景。銀河降低星點與星帶密度；極光收斂成右側、右下緣的淡青藍光霧，中央和左侧保留深色閱讀空間。
- 原始 PNG 均為 1672 × 941，另存相同尺寸 quality 92 WebP 供頁面載入；未裁切、改色或拉伸原圖。兩套封面與封底繼續使用原有素材。
- [本次來源、生成提示與素材對照](galaxy-aurora-interior-revision-v2.json)。


### 正式套用：地球曙光 × 深空銀河（2026-10-08）

使用者確認封面與封底選地球曙光、內頁選精簡版深空銀河，現在一般網址直接套用此組合。

| 頁型 | 使用素材（位於 `dist/assets/cosmic-backgrounds/`） | 章節 |
| --- | --- | --- |
| 封面 | `earth-v1.webp` | `#intro`，原地球內頁改作封面 |
| 內頁 | `galaxy-interior-v2.webp` | 公司介紹、感知、學習、產品、新品、城堡及所有實績 |
| 封底 | `earth-closing-v1.webp` | 正式最後一章 `#closing` |

- 保留選定圖片原有色調、全視窗固定座標、等比例裁切、亮度／飽和度設定，以及手機下半部漸隱處理。沒有重新生成或修改圖片。
- 三張皆為 1672 × 941，同名 PNG 原稿與 WebP 同時保留。網頁僅載入 WebP，三張合計約 192 KiB。
- 背景選擇器及其比較專用程式已移除。未選定的 PNG／WebP 草稿移至 `docs/design-archive/cosmic-backgrounds/`，退出發布目錄，供日後設計參考；上方歷程中的旧素材位置請對應此封存目錄。
- 原始生成提示、來源對照 JSON 與舊版動態宇宙原始碼保留。新版不再載入 `universe.js` 或其動態貼圖。


### 產品識別色更新（2026-10-08）

- 使用者最新四張產品頁截圖確認：AIWinOps 橘、NumOps 藍、WinChat 紫、WinEdge 青綠。這組對應取代較早素材中的 NumOps 紫／WinChat 藍，以及原有產品積木配色。
- 以 PNG 內嵌色彩描述檔轉換至 sRGB 後讀取產品名稱主色，映射見 `dist/product-colors.js` 與 [視覺設計說明](VISUAL-DESIGN.md)。截圖中的行銷數據未新增至簡報。
- 所有使用者原始產品圖片與既有去背圖完整保留；平台全貌彈窗改由既有去背圖和可編輯 HTML 產品名稱組成，採用最新色系。WinHub.AI 品牌及其 5px 圖文間距保留。


### 公司沿革（2026-10-09）

- 依據使用者提供的「截圖 2026-10-09 下午2.31.01.png」，整理 2016–2025 年里程碑；原始參考保留於 `docs/design-archive/company-history-reference.png`。
- 以可編輯 HTML 文字重新排版，逐年保留成立、專案、專利、SaaS、WinHub.AI、資本、平台及海外市場的重點，不把後續的產品成長故事當作上市年表。
- 新頁位於 `#company-history`，背景沿用精簡深空銀河。線性圖示以 SVG 繪製，未新增第三方圖片或頁首 Logo。


### WinEdge 實際產品介面（2026-10-19）

- 使用者提供 `winedge-screenshot.zip`，共 10 張 2555 × 1288 PNG，收錄至 `dist/assets/winedge/`，排除 macOS metadata；英文檔名對應見該目錄 `manifest.json`。
- 保留原始 PNG 位元組；網頁以 SVG viewBox 與 clipPath 節選重要區域，沒有重繪介面、變更數值或生成替代截圖。
- 三主題共六幕手動展示，包含流程、通訊與模型、節奏控制示意、預覽與維運、看板、Plugin / Agent。流程頁節選三個實際節點放大，動畫直接連到輸出／輸入端口。七張原圖用於舞台，三張細部設定原圖留作技術補充；連線與節奏示意屬舞台動畫，非產品操作錄影。
- Plugin 截圖聚焦左側節點目錄；原圖中央連線中斷狀態沒有被改成成功。模型目錄聚焦 AIWin 與 NumOps 節點，不突出原圖的單一 SAM 模型名稱。
- 詳細對照與範圍見 [WinEdge CREDITS](../dist/assets/winedge/CREDITS.md)。
