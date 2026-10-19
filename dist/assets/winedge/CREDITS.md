# WinEdge 產品介面來源

來源：使用者於 2026-10-19 提供 `winedge-screenshot.zip`，授權用於本次 WinEdge 簡報整合。沒有從外部網站抓取本組圖片。

全部 10 張 PNG 皆為 2555 × 1288，原始位元組保留，只有檔名改為英文。中文原檔名對照見 [manifest.json](manifest.json)。macOS `__MACOSX` 的資源檔未收錄。

| 檔案 | 舞台用途 |
| --- | --- |
| workflow-editor.png | 將 RTSP、物件偵測、Live Preview 三個節點節選放大，依原流程順序組合；完整原圖另有影像寫入分支 |
| industrial-connectors.png | 工業輸入與輸出的原生節點標題，節選後分欄放大 |
| ai-model-nodes.png | AIWin 與 NumOps 模型節點標題，節選後依序放大，不突出單一 SAM 模型 |
| execution-interval.png | 固定間隔設定，保留供技術補充，不在舞台播放 |
| execution-schedule.png | 排程規則設定，保留供技術補充，不在舞台播放 |
| input-channels.png | 輸入通道原始設定，保留供技術補充；舞台改以節奏動畫表達 |
| live-preview.png | 八個影像處理節點與各自預覽 |
| node-hot-update.png | 單節點控制；另一個節選呈現 WinChat Agent 節點入口 |
| dashboard-designer.png | 圖層／畫布，以及樣式面板的兩個視窗 |
| plugin-catalog.png | 僅呈現左側可載入節點目錄 |

以 SVG viewBox 與 clipPath 顯示圖片局部，保留長寬比例、原始文字與示範值。光流、入場與串接圖是額外演講動畫，不是即時控制、影片或產品效能測試。Plugin 原圖中央為 MC 連線中斷訊息；該段選用目錄說明擴充性，不將原圖描述成正常執行中的整合案例。

工作流程連線是演講圖解：RTSP `frame` → 模型 `image_1`，模型 `out_image_1` → Live Preview `slot_1`。端點直接貼齊原圖節點，隨尺寸更新；節奏示意則完全由 SVG／CSS 繪製，未生成或改造產品介面。
