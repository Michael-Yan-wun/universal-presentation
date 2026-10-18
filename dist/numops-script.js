// Speaker-controlled beats. Timing is rehearsal guidance, never an auto-advance timer.
export const numOpsScript = [
 [
  {scene:'signals',title:'讓每個數字，回到它的現場。',subtitle:'設備 · 製程 · 時間',seconds:35,note:'承接生命體的成長：我們已能接收影像與數據，現在開始從經驗找出規律。不同訊號先對應到設備、時間與工作目標。光流與表格為示意。'},
  {scene:'screen',asset:'prepare',title:'準備好資料，學習才有起點。',subtitle:'資料預處理 / 官方產品介面',seconds:40,note:'用放大的 NumOps 官方畫面說明資料來源、預處理方式與資料集。平台支援資料清理、轉換與特徵工程；不是在台上操作正式系統。'},
  {scene:'tasks',title:'一份數據，不只一種答案。',subtitle:'依工作目標，選擇學習方式。',seconds:40,note:'以三個問題帶出能力：判斷狀態對應分類、異常偵測；預測變化對應回歸、時間序列；發現相似性對應分群。專家系統留到後面用不同畫面展示。圖形為能力示意，沒有客戶效能數據。'}
 ],
 [
  {scene:'automl',title:'把反覆嘗試，交給 AutoML。',subtitle:'多模型訓練 → 比較 → 選擇',seconds:45,note:'資料與預測目標送入 AutoML，候選模型分路訓練再匯回比較。這是建模流程動畫，不是即時訓練或速度保證；沒有捏造準確率。'},
  {scene:'screen',asset:'training',title:'選擇目標，開始建立模型。',subtitle:'No-Code / 官方產品介面',seconds:35,note:'展示官方建立模型畫面，指出分類、回歸、時序、異常與分群入口及 AutoML。只需掌握場域問題，也能以視覺介面建立模型。'},
  {scene:'screen',asset:'analysis',title:'模型好不好，用結果說話。',subtitle:'模型排行 · 評估指標 · 特徵重要性',seconds:45,note:'展示官方模型排行榜與評估入口。截圖數字是官網示範資料，不是本次客戶結果，不將指標泛化為效能承諾。依任務檢視測試集與評估指標。'},
  {scene:'expert',title:'數據會學習，經驗也能留下。',subtitle:'AutoML ＋ 專家系統',seconds:40,note:'資料走模型訓練，老師傅經驗走規則庫。歷史資料不足時可先建立專家規則，不代表無資料就能訓練出有效機器學習模型。兩條路依場域組合使用。'}
 ],
 [
  {scene:'oven',title:'把製程經驗，變成控制依據。',subtitle:'實際應用 / 智慧烤箱溫控',seconds:40,note:'沿用使用者 Pitch v5 第 34 頁案例：27 個風門與 15 個溫度點，結合 NumOps 與 WinEdge-N。右側動畫呈現多點量測與調整流程，非即時控制或節能成效實測。'},
  {scene:'waterops',title:'當 AI，遇見水務專家。',subtitle:'GSD 基士德 × 慧穩科技',seconds:45,note:'WaterOps 是與 GSD 基士德合作的智慧水務平台，結合水務領域知識與慧穩 AI 建模及落地經驗。以合作的數據 AutoML 平台介紹，不把它說成 NumOps 的改名或單方擁有。官網說明可輸入水質數據、訓練模型、模擬成效與納入環工專家知識。'},
  {scene:'waterflow',title:'從水質數據，到現場決策。',subtitle:'WaterOps / 智慧水務應用',seconds:45,note:'水質與流量送入 WaterOps，結合模型與專家知識，再透過 WinEdge-N 對接現場。公開合作資料提及智慧加藥與曝氣控制；本圖合併呈現可依場域配置的應用方向，不宣稱同一客戶同時具備所有配置。'},
  {scene:'deploy',title:'學到的規律，回到設備旁。',subtitle:'模型 → WinEdge-N → 現場回饋',seconds:40,note:'完成訓練與驗證後依授權部署至 WinEdge-N；亦可透過 API 或批次預測使用。現場新資料供後續檢視與再訓練，沒有宣稱無人審核的自動重訓。下一步將這些能力融合，揭曉 NumOps。'}
 ]
];
export const numOpsBeatCounts=numOpsScript.map(group=>group.length);
export const numOpsTravelSeconds=1.8;
export const numOpsBeat=state=>numOpsScript[state.selected]?.[state.beat||0];
