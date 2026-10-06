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

## 設計參考與授權

參考 Shopify Winter 2026、oryzo.ai、sidewave.it 的章節節奏及立體主體，LEGO 官方產品照片的積木結構；沒有複製網站程式碼或使用 LEGO 標誌。

Three.js 0.180.0：MIT，授權見 [Three.js MIT 授權](../dist/vendor/THREE-LICENSE.txt)。品牌簡報與官網圖像僅用於本次品牌演講網站。

`dist/vendor/Reflector.js` 取自 Three.js 0.180.0 官方套件的 `examples/jsm/objects/Reflector.js`（https://cdn.jsdelivr.net/npm/three@0.180.0/examples/jsm/objects/Reflector.js），僅將模組匯入改為本機路徑；沿用上述 MIT 授權。


## 星空與地球

貼圖原始連結、署名及授權見 [Universe 素材說明](../dist/assets/universe/CREDITS.md)。
