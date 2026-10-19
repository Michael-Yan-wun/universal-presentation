# WinChat 官方介面素材

來源：[慧穩科技 WinChat 產品頁](https://www.aiwin.com.tw/products/winchat)，2026-10-18 取得。

| 本地檔案 | 官方原始 URL | 內容 |
| --- | --- | --- |
| `answer.webp` | https://www.aiwin.com.tw/products/winchat/timeline/04.webp | RAG 問答與參考來源 |
| `skills.webp` | https://www.aiwin.com.tw/products/winchat/timeline/02.webp | 技能工具包與啟用控制 |

圖片未重新繪製或改動產品內容。用於使用者授權的 AIWin 十週年簡報；品牌與原始介面權利歸原權利人所有。本地檔案不代表即時產品連線。

`winchat-story.js` 的文件圖解、問答與任務流程由程式繪製，是演講情境示意；多模態 RAG 中的 VLM 讀圖能力依使用者於本次對話的產品補充，其他產品能力以官方頁面為依據。沒有引入客戶名稱、成效數字或推理正確率。

## 舞台版新增素材（2026-10-18）

| 本地檔案 | 官方原始 URL | 內容 |
| --- | --- | --- |
| `workspace.webp` | https://www.aiwin.com.tw/products/winchat/features/01.webp | 對話工作區、RAG／Agent 模式 |
| `tools.webp` | https://www.aiwin.com.tw/products/winchat/features/02.webp | 工具包、單項工具與 NumOps 分析工具 |
| `dashboard.webp` | https://www.aiwin.com.tw/products/winchat/features/03.webp | 營運戰情室與 AI Copilot |
| `library.webp` | https://www.aiwin.com.tw/products/winchat/features/04.webp | 知識庫檢索模式設定 |
| `knowledge.webp` | https://www.aiwin.com.tw/products/winchat/timeline/01.webp | 文件與多知識庫管理 |

原檔保留，舞台透過 CSS 鏡頭平移與放大展示重點，並加上獨立的講解標籤。介面截圖不會執行工具或更動產品設定；畫面中的數字、帳戶及問題來自官網公開展示，並非本次新增客戶實績。

## Agent 敘事與資料流更新

`winchat-flows.js` 的圖解皆為程式繪製示意，不新增客戶數據或圖片。Agent 使用 RAG 與 SKILL 工作方法／工具能力的定位依使用者補充；工作方法的概念參考 [Agent Skills](https://agentskills.io/home)，不宣稱相容特定檔案格式。工具管理截圖僅呈現既有產品介面。

舞台目前每張主要官方介面圖只展示一次，細節以資料流圖解說明；舊有放大設定與備用圖片保留於素材檔案。

## Hardware deployment

2026-10-19：依使用者指定，WinChat 同頁呈現小團隊的 **NVIDIA DGX Spark**，以及搭載 **RTX PRO 6000** 的大型工作站。

- [NVIDIA DGX Spark 官方頁](https://www.nvidia.com/en-us/products/workstations/dgx-spark/)
- [官方 Spark 產品系列照片](https://www.nvidia.com/content/dam/en-zz/Solutions/dgx-spark/nvidia-dgx-spark-family-bm-lg580-offset-left-d.jpg)
- [NVIDIA RTX PRO 6000 Blackwell Workstation Edition 官方頁](https://www.nvidia.com/en-us/products/workstations/professional-desktop-gpus/rtx-pro-6000/)
- [官方 RTX PRO 6000 外觀參考](https://www.nvidia.com/content/dam/en-zz/Solutions/data-center/rtx-pro-6000-blackwell-workstation-edition/nvidia-geforce-rtx-pro-6000-bm-l580-d.jpg)

`product-hardware.js` 以原生 Three.js 建模。Spark 參考金色圓角機殼、前側網孔與深色直條；工作站為原創剖面機殼，內部單張顯示卡參考 RTX PRO 6000 的雙散熱區與交叉骨架。主機相對大小經舞台視覺調整，未代表實際比例或 OEM 成品。官方照片僅供外觀參考，不隨網站載入。

小團隊／企業部署定位依使用者的產品規劃，未新增並行人數、模型容量、推論效能或已完成相容性認證等宣稱。
