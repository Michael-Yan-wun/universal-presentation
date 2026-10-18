// Manual keynote beats. Durations are rehearsal guidance, never auto-advance timers.
// Agent orchestrates RAG knowledge and SKILL methods/tools, then demonstrates applications.
export const winChatScript = [
 [
  {scene:'perception',title:'企業的知識，不只在文字裡。',subtitle:'RAG / 給 Agent 可查證的知識',action:'看圖像如何被理解',seconds:35,note:'先看文件與圖解。RAG 是 Agent 可使用的知識能力，不是另一個與 Agent 並列的大腦。'},
  {scene:'vlm',title:'PDF 裡的架構，也能讀懂。',subtitle:'VLM / 架構圖、流程圖與元件關係',action:'建立多模態知識索引',seconds:40,note:'以 PDF 中的系統架構圖為例：VLM 看懂方塊代表的元件、箭頭方向與上下層級，再結合頁面文字形成圖像描述。也可用流程圖與元件圖說明，並保留原圖、文件、頁碼與圖號。本頁為概念示意，不是模型實測。'},
  {scene:'indexing',title:'讓圖文，進入同一份知識脈絡。',subtitle:'理解 → 整理 → Embedding → 索引',action:'走進企業知識庫',seconds:45,note:'文字與圖像走各自理解路徑，內容整理後建立檢索表示。VLM 看圖，LLM 理解文字；Embedding 的具體輸入依產品實作，本圖不限定特定拓撲。'},
  {scene:'screen',asset:'knowledge',view:'wide',title:'把經驗，整理成企業知識。',subtitle:'WinChat / 多知識庫與文件管理',action:'看 Agent 如何找回知識',seconds:35,note:'大型官網知識庫介面。企業可按部門、產品與任務整理內容，讓前面積木的經驗有地方留下。'},
  {scene:'retrieval',title:'Agent 提問，RAG 找回依據。',subtitle:'問題 → 檢索 → 相關片段 → 回答',action:'查看官方問答介面',seconds:35,note:'問題帶出相關內容與來源，再回到 Agent 的上下文。Vector、Hybrid、GraphRAG 是可配置的檢索方式，不代表每次都同時使用。'},
  {scene:'screen',asset:'answer',view:'wide',title:'知識問答，帶著引用來源。',subtitle:'WinChat / 官方產品介面',action:'展開來源追溯',seconds:30,note:'官方問答畫面，只看介面與引用機制，不逐條解說截圖中的法規內容。不是即時連線。'},
  {scene:'citations',title:'每一份回答，都能回到依據。',subtitle:'回答 ↔ 知識片段 ↔ 原始文件',action:'讓 Agent 使用 SKILL 工作能力',seconds:35,note:'用追溯圖示意答案、引用片段與原文頁碼的連結。知識建立時讀圖，回答時保留證據脈絡。下一段介紹 Agent 如何取得現況。'}
 ],
 [
  {scene:'recipe',title:'SKILL，把專業做法留下來。',subtitle:'工作方法 · 工具使用 · 輸出要求',action:'看 SKILL 如何使用工具',seconds:30,note:'SKILL 是 Agent 可使用的工作能力。以現場巡檢摘要說明任務輸入、作業步驟、可使用的工具與輸出格式；不把它講成某種連接協定。'},
  {scene:'skilldispatch',title:'Agent 調用 SKILL，使用現場能力。',subtitle:'依工作需要，組合資料與分析工具。',action:'讓工具結果回到 Agent',seconds:40,note:'Agent 依工作選擇 SKILL，由方法與工具組合取得資料、使用分析能力。圖中系統為應用示意，可用工具依實際部署配置。'},
  {scene:'returns',title:'工具回傳結果，Agent 整理脈絡。',subtitle:'查詢紀錄 · 分析結果 · 知識依據',action:'查看 WinChat 工具管理',seconds:35,note:'工具回傳運轉紀錄與分析，RAG 提供相關知識。結果回到 Agent 整理；請沿著資料流介紹，示意內容不是現場即時資料。'},
  {scene:'screen',asset:'tools',view:'wide',title:'Agent 可用的工具，由企業管理。',subtitle:'WinChat / 工具包、單項工具與啟用控制',action:'讓 Agent 按工作方法執行',seconds:40,note:'官方工具管理介面，指出工具包、單項工具與啟用控制。SKILL 的工作方法與可用工具一起構成工作能力，這張截圖僅呈現既有工具管理功能。'},
  {scene:'execution',title:'按工作方法，完成每一個步驟。',subtitle:'SKILL 定義做法，Agent 調用知識與工具。',action:'走進實際工作情境',seconds:35,note:'依次顯示讀方法、RAG 查規範、工具取紀錄、Agent 產出摘要。SKILL 說明怎麼做，工具負責取得資料或執行能力；Agent 統籌與檢視。'}
 ],
 [
  {scene:'mission',title:'把現場資訊，整理成巡檢摘要。',subtitle:'理解目標 · 選擇能力 · 檢視結果',action:'走進營運戰情室',seconds:30,note:'提出整理今日現場巡檢摘要的工作目標。Agent 使用 RAG 的知識與 SKILL 的方法及工具，最後產出現場巡檢摘要，可依場域需求串接 LINE、警示設備，或匯出報告。'},
  {scene:'screen',asset:'dashboard',view:'wide',title:'讓現況，進入同一個工作視野。',subtitle:'WinChat / 營運戰情室與 AI Copilot',action:'把狀況整理成現場巡檢摘要',seconds:40,note:'展示官方戰情室的指標、趨勢、事件與 Copilot。數字來自官網展示，並非本場即時紀錄；下一頁用資料流說明如何形成摘要。'},
  {scene:'report',title:'從現場資料，到有依據的摘要。',subtitle:'現況 + 知識 → 分析 → 工作輸出',action:'讓現場巡檢摘要送到需要的地方',seconds:35,note:'工具取得的現場資料與 RAG 的 SOP 合流。Agent 依 SKILL 的方法整理觀察、依據、待確認事項，交回人員使用。'},
  {scene:'delivery',title:'現場巡檢摘要，送到需要的地方。',subtitle:'LINE 通知 · 現場警示設備 · 報告匯出',action:'揭曉 WinChat',seconds:35,note:'現場巡檢摘要形成後，透過 SKILL 與已配置的工具選擇輸出：LINE 通知相關人員、依規則連動現場警示設備，或匯出留存報告。三條連線依序亮起，停留展示成果；下一步直接凝聚並揭曉 WinChat，不再重複架構總結或應用列表。本頁為串接概念示意，不會實際發送訊息或操作設備。'},
 ]
];
export const winChatBeatCounts=winChatScript.map(topic=>topic.length);
export const winChatFinalBeats=2;
export const winChatTravelSeconds=2.2;
export function winChatBeat(state){return winChatScript[state.selected]?.[state.beat||0];}
export function winChatAction(state){
 if(state.selected===2&&state.beat===winChatBeatCounts[2]-1&&!state.canFuse)return (state.visited||[]).includes(0)?'深入 SKILL 工作能力':'深入 RAG 企業知識';
 return winChatBeat(state)?.action;
}
