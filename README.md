# Universal Presentation · AIWin 10 週年

**From Edge to Agent — 十年經驗，積累成功。**

慧穩科技十週年活動使用的互動式 3D 演講網站。以「生命體的成長」串起感知、專案學習、知識與行動；以積木呈現產品能力，最後揭曉整合影像與數據、可模組化擴充的 **WinEdge Ultra**。

- [正式展示網站](https://winedge-anniversary-experience.yanwun1214.chatgpt.site/)
- 使用情境：桌面、16:9 投影、講者手動推進。
- 技術：原生 HTML / CSS / JavaScript、Three.js **0.180.0**、本機圖片與 H.264 MP4。
- 執行不需要 npm 安裝、編譯、API Key、資料庫或後端服務；所需的 Three.js 與展示素材皆已收錄。

本倉庫保存目前的 AIWin 演講版本。修改內容與動畫需編輯原始碼，目前沒有通用簡報編輯器或即時 AI 訓練功能。

## 快速啟動

需求：Git、Python 3，以及支援 WebGL 2 的桌面瀏覽器。

```sh
git clone https://github.com/Michael-Yan-wun/universal-presentation.git
cd universal-presentation
python3 -m http.server 8765 --bind 127.0.0.1 --directory dist
```

開啟 [http://127.0.0.1:8765/](http://127.0.0.1:8765/)。在終端按 `Ctrl+C` 停止伺服器。

請透過 HTTP 開啟；直接雙擊 `index.html` 的 `file://` 方式無法可靠載入 ES Modules 與素材。若 8765 已被使用，可改成 8766 等其他連接埠，並使用對應網址。

> **`dist/` 就是此專案的原始網站檔案，也同時是發布目錄。** 它不是自動生成的建置產物；修改後需要保留並提交。

## 目前完成的進度

| 區塊 | 已實作內容 |
| --- | --- |
| 開場 | 金色積木「10」落下組裝、太空站地板、倒影、地球曙光背景 |
| 公司介紹 | AIWin Logo、150+ 專案、30+ 產業、6 項國家專利、海外市場與 WinHub.AI 四項產品展示舞台 |
| 公司沿革 | 2016–2025 十個年份，分為扎根與產品化、平台與國際化兩段；可點年份區間或用原有箭頭切換 |
| 感知世界 | 小機器人、六種感知入口、眼睛展開 Basler / IP / USB 相機；影像匯入 WinEdge-V，Modbus / MC Protocol / Database 匯入 WinEdge-N；兩者搭載 Edge 硬體 |
| 十年專案與學習 | 「有了感知，開始學習」；同一個機器人接收積木光流、知識節點亮起；深入 Vision 後探索五個實際案例影片及硬體流程 |
| AIWinOps 誕生 | 五案完成後，呈現整理、標註、訓練與驗證；全部專案積木形成龍捲風，融合誕生 AIWinOps，再連回部署硬體 |
| NumOps / WinChat | 各有三塊能力積木與逐段重點；完成該輪內容後融合為產品；WinChat 以 RAG、Agent、Skill 組成 |
| 協作與新品 | 產品連成完整智慧身體；One more thing 揭曉 WinEdge Ultra 與 VISION / DATA / EXTEND 模組 |
| 城堡與實績 | 實體積木底座、完整產品城堡、五個領域大腦，以及 Wafer Map、烤箱溫控、企業知識三組應用 |

| 封底 | 地球曙光地平線、「下一個十年，與你同行」、品牌收尾 |

**目前的範圍：** Vision 已有完整「五案影片 → 每案硬體 → 學習 → 融合」流程。十年總覽的 Data、LLM 按鈕目前開啟案例說明；後續 NumOps、WinChat 使用各自的三段能力流程，尚未擴成與 Vision 相同的五案影片流程。手機不是本案驗收範圍。

## 故事線與章節入口

首頁左下方顯示 `00 / 12`，表示章節編號 0–12，合計 **13 個章節**。感知、案例及產品章節內還有由講者推進的子階段。

| 編號 | 章節 | 網址片段 | 重點 |
| --- | --- | --- | --- |
| 00 | 序章 | `#intro` | From Edge to Agent、金色積木 10 |
| 01 | 公司介紹 | `#company` | 企業 AI 導入專家、交付實績、海外市場、WinHub.AI 四大能力 |
| 02 | 感知世界 | `#first-contact` | 初生機器人 → 影像入口 → 數據入口 |
| 03 | 實戰與學習 | `#decade` | 十年專案是成長課堂；案例累積成 AIWinOps |
| 04 | 數據規律 | `#analytics` | 情境、模式與專家規則、現場驗證 → NumOps |
| 05 | 知識與行動 | `#chat` | RAG 記憶、Agent 任務、Skill 方法 → WinChat |
| 06 | 協作成形 | `#connected-intelligence` | 感官、學習、神經與肢體共同運作 |
| 07 | One more thing | `#one-more-thing` | WinEdge-N + WinEdge-V → WinEdge Ultra |
| 08 | 智慧城堡 | `#castle` | 現場、產品、WinChat 與五個 Domain AI 大腦 |
| 09 | Wafer Map | `#inspection` | AIWinOps + WinEdge-V |
| 10 | 智慧烤箱 | `#temperature` | NumOps + WinEdge-N |
| 11 | 企業知識 | `#knowledge` | WinChat + AI Agent |
| 12 | 封底 | `#closing` | 下一個十年，與你同行 |

公司介紹提供三款版型預覽：開啟 [版型比較](http://127.0.0.1:8765/?company-layout=stage#company)，用右上角切換「環形展台」、「懸浮星軌」與「進化階梯」。網址參數 `company-layout=stage|orbit|steps` 保留選擇；一般網址不顯示比較工具列。

公司介紹後新增 [公司沿革](http://127.0.0.1:8765/#company-history)。先呈現 2016–2020，再按 → 顯示 2021–2025；再次按 → 接到感知世界，按 ← 可依序返回。也可點頁面上方的年份區間直接切換。

例如直接開啟 [學習章節](http://127.0.0.1:8765/#decade)。舊入口 `#visual`、`#numeric` 仍有效，分別對應「感知世界」中的影像與數據段，不會新增重複章節。

正式背景已套用使用者選定的混搭：**封面與封底使用地球曙光，所有內頁使用精簡版深空銀河**。一般網址即可顯示，不需查詢參數；背景比較工具已移除。舊背景預覽網址會轉入相應的正式章節並清除背景參數。封底接在企業知識實績之後，可由章節列、`End` 或 [封底網址](http://127.0.0.1:8765/#closing) 直接進入；底部箭頭返回前一幕。

文字配色提供四套實頁比較：開啟 [文字配色預覽](http://127.0.0.1:8765/?text-theme=platinum#company)，以右上角切換鉑銀極簡、冰藍科技、青玉未來、星紫雅白。`text-theme=platinum|ice|jade|violet` 只控制文字預覽；章節切換與重新整理會保留選擇，宇宙背景和產品四色固定。一般無此參數的網址保留目前正式版。

人的成長是演講比喻，順序不代表產品上市時間。學習光流、知識節點、硬體模型與連線是概念展示；WinEdge Ultra 名稱與定位依本次演講產品規劃呈現。

## 演講操作

| 操作 | 功能 |
| --- | --- |
| `→` / `PageDown` / 下方右箭頭 | 推進當前動畫或子階段；完成後進入下一章 |
| `←` / `PageUp` / 下方左箭頭 | 回到前一個子階段或章節 |
| 空白鍵 | 推進；一般模式下若焦點在按鈕，依按鈕原生行為執行 |
| `P` | 切換演講模式，停用滾輪切幕，空白鍵直接推進 |
| `F` | 切換瀏覽器全螢幕，需瀏覽器支援 |
| `N` | 顯示／隱藏講者提示；提示出現在同一畫面，**會一起投影** |
| `Home` / `End` | 開場／封底 |
| 下方章節名稱 | 直接切換章節；重新進入互動章節會重設該輪完成狀態 |
| 點選積木／案例／領域大腦 | 進入重點、影片或情境；可互動的場景支援拖曳旋轉 |
| `Esc` | 關閉案例視窗 |

右上方的「演講模式」與「全螢幕」按鈕已移除，鍵盤快捷鍵仍保留。正式演講前可按 `P`，避免滾輪誤切；再使用瀏覽器全螢幕或 `F`。

### Vision 一輪的順序

1. 在 `#decade` 觀看落下組裝與機器人學習動畫，按「從影像專案開始學習」。
2. 鏡頭深入積木，停留於立體 **VISION** 字幕，再帶出五案（進場約 8.8 秒）。
3. 點選案例後，該積木移至前景（約 1.85 秒），開啟影片與右側解說。
4. 按「看看硬體如何接起來」，呈現相機 → WinEdge-V 邊緣設備 → 輸出。**完成硬體段落才計入已看過。**
5. 五案都完成後，按「把經驗化為訓練」，觀看機器人累積知識，以及整理、標註、訓練驗證三個重點。
6. 按「誕生 AIWinOps」，五案、底座與完整專案陣列一起旋轉融合（約 8.2 秒）；產品落下後停留，等待講者繼續。

影片預設靜音、循環播放，使用播放器控制暫停與拖曳；關閉即停止播放。若瀏覽器阻擋自動播放，使用畫面上的播放按鈕。轉場期間前後切換會暫時鎖定。One more thing 也需講者手動啟動，不會自動跳到下一章。

## 專案結構與修改位置

```text
.
├── README.md
├── .openai/hosting.json          # 既有 Sites 網站識別與 dist 發布設定
├── docs/
│   ├── ASSETS.md                 # 簡報、官網、相機照片與授權來源
│   └── VISUAL-DESIGN.md          # 材質、配色、構圖、背景與動畫設計
└── dist/                        # 原始網站檔案；直接由 HTTP 伺服器提供
    ├── index.html / style.css    # 頁面骨架、首頁文字與版面
    ├── app.js                    # 鍵盤、章節、彈窗、互動狀態與揭曉
    ├── company.js / company.css # 公司介紹文案、Logo 與四大能力積木
    ├── company-history.js / .css # 公司沿革文案、兩段時間軸與響應式排版
    ├── content.js                # 產品、案例、章節、領域大腦、講者提示
    ├── scene.js                  # Three.js 場景、積木與共用渲染迴圈
    ├── stage-layout.js           # 桌面舞台構圖及模型間距
    ├── anniversary.js            # 金色 10、太空站地板與倒影
    ├── cosmic-background.js / .css # 正式背景配置、響應式裁切與封底樣式
    ├── universe.js               # 舊版動態背景，保留原始碼但不載入
    ├── growth-scene.js           # 感知與完整智慧身體的場景銜接
    ├── sense-scene.js            # 感知全貌、影像與數據子階段
    ├── robot-seed.js             # 小機器人外殼、表情與關節動畫
    ├── learning-life.js          # 學習中的機器人、知識節點與專案光流
    ├── camera-scene.js           # 眼睛到相機的展開動畫
    ├── camera-models.js          # Basler / IP / USB 相機幾何模型
    ├── data-scene.js             # Modbus / MC Protocol / Database 數據入口
    ├── edge-host.js              # 承載 WinEdge 積木的實體 Edge 硬體
    ├── history-wall.js           # 十年積木、案例空間、硬體、學習與龍捲風
    ├── history-ui.js             # 學習段文字、案例影片與導覽
    ├── field-kit.js              # 案例中的相機、感測器、邊緣與輸出設備
    ├── product-journey.js        # NumOps / WinChat 三段能力與產品誕生
    ├── narrative-ui.js           # 感知、產品與協作文字
    ├── assets/                  # 圖片、影片與來源說明
    └── vendor/                  # Three.js、Reflector 與授權
```

### 常見修改

- **改產品與案例內容：** `content.js`；`history-ui.js` 是十年與 Vision 專用文案，`narrative-ui.js` 是感知與其他產品文案。
- **改首頁主標：** `index.html`。首頁內容會在初始化時由 `app.js` 保存並重用。
- **調整位置、大小：** 先看 `stage-layout.js` 與 `style.css`；Vision 的鏡頭與案例位置在 `history-wall.js`。
- **替換影片：** 將 MP4 與封面放入 `assets/vision/`，更新 `content.js` 的 `visionCases` 與對應來源紀錄。目前 Vision 五案布局與導覽含固定數量邏輯；增加案例時需一起調整，不能只新增陣列項目。
- **調整動畫：** 在對應場景模組修改；保留減少動態效果模式，以及講者手動推進與轉場鎖定。
- **更新後仍看到舊內容：** 重新載入頁面；發布時同步更新 `index.html` 的樣式／入口版本與變動模組的匯入查詢版本（例如 `?v=learning-life-1`）。此專案沒有熱重載。

## 檢查與發布

此版本沒有 npm 建置程序、測試框架或 GitHub Actions 自動部署。若已安裝 Node.js，可先做 JavaScript 語法檢查：

```sh
for file in dist/*.js; do node --check "$file" || exit 1; done
git diff --check
```

內容或動畫修改後，以本機 HTTP 預覽檢查：

- 桌面 1920 × 1080 下文字、積木、按鈕與頁尾無遮擋。
- 感知世界依序展開影像、數據，再進入十年學習。
- 五案影片可開關，每案可切到硬體；未完成五案時不提前誕生 AIWinOps。
- 學習場景、龍捲風與 AIWinOps 落下完整銜接，章節返回與重播可用。
- NumOps、WinChat、One more thing、城堡與實績能繼續操作。
- 瀏覽器主控台沒有模組或素材載入錯誤；系統開啟減少動態效果時仍可閱讀與推進。

上一輪功能修改已檢查 16:9 舞台、五案與硬體流程、學習與產品揭曉，以及 JavaScript 語法與本機模組引用。本次 GitHub 整理主要補齊文件與來源庫，不代表新增跨瀏覽器效能認證。

### 部署方式

任何可提供靜態檔案的 HTTP 主機都能使用 `dist/`，需完整保留相對目錄。章節採 URL hash，不需要伺服器端路由重寫。展示本身不呼叫外部 API；外部資料來源連結仍需網路。

目前正式版由 **Sites** 託管，`.openai/hosting.json` 指向既有 AIWin 網站，發布目錄是 `dist`。**推送 GitHub 本身不會更新正式網站。** 維護既有網站時沿用其設定；若要建立另一個網站，需使用新網站自己的識別設定。

## 素材、來源與使用範圍

- [完整素材來源與案例依據](docs/ASSETS.md)
- [視覺、配色與動畫設計](docs/VISUAL-DESIGN.md)
- [五支 Vision 影片來源與案例狀態](dist/assets/vision/CREDITS.md)
- [地球與星空貼圖來源](dist/assets/universe/CREDITS.md)
- [Three.js MIT 授權](dist/vendor/THREE-LICENSE.txt)

150+ 專案、30+ 產業等數字取自提供的 2026.08 簡報，保留其資料時點；案例分別標為應用展示、技術展示或 PoC。影像與數據動畫沒有連接實際客戶設備或訓練服務。

原始 `AIWin_WinHub.AI_完整Pitch_v5_20260821.pptx` 保留於本機並由 `.gitignore` 排除。本倉庫包含網站目前使用及保留的圖片、案例影片、程式與授權文件；GitHub 初次匯入採目前版本的乾淨快照，不包含本機舊歷史中的原始 PPT。

Three.js 與相關第三方檔案依各自授權使用。AIWin 品牌、簡報截圖、案例影片及廠商商標保留各權利人的權利；本倉庫未為整體專案授予開源再利用授權，請勿將第三方 MIT 授權延伸解讀為所有品牌素材的使用許可。
