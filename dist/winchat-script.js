// Manual keynote beats. Durations are rehearsal guidance only; no automatic advance.
export const winChatScript = [
  [
    {scene:'perception',reveal:0,title:'企業的知識，不只在文字裡。',subtitle:'一張圖、一份手冊，都是經驗。',action:'讓 VLM 看懂圖像',seconds:35,note:'先停在手冊：企業知識不只有段落，還有零件圖、表格與操作圖示。請觀眾想像維修人員拿到這張圖，最需要知道什麼。'},
    {scene:'perception',reveal:1,title:'讓 VLM，看懂圖像。',subtitle:'辨識圖像內容，保留文件脈絡。',action:'連起文字與圖像',seconds:40,note:'按下後掃描圖解，揭曉圖像區域和圖文關係。說明 VLM 讀圖是這次產品策略補充；圖解為演講示意，不是實測辨識結果。'},
    {scene:'perception',reveal:2,title:'把看見的，連成可檢索的記憶。',subtitle:'VLM × LLM × Embedding',action:'走進企業知識庫',seconds:45,note:'分清楚三件事：VLM 看圖，LLM 理解文字與脈絡，Embedding 建立檢索表示。檢索再把相關知識帶回回答；這是概念流程，不限定內部實作拓撲。'},
    {scene:'screen',asset:'knowledge',view:'wide',title:'把經驗，放進企業自己的知識庫。',subtitle:'文件整理 · 多知識庫 · 內容管理',action:'看知識如何被找回',seconds:35,note:'官網真實介面，放大展示多知識庫與文件管理。可以指出 WinEdge、NumOps、AIWinOps 手冊如何被收進知識庫，連回先前積木故事。'},
    {scene:'screen',asset:'library',view:'search',title:'用適合的方式，找回知識。',subtitle:'Vector · Hybrid · GraphRAG',action:'看看問答結果',seconds:35,note:'放大官方搜尋設定：語意、關鍵字及知識關係是不同檢索方式。說明依企業資料特性選擇，避免宣稱任一方式永遠最好。'},
    {scene:'screen',asset:'answer',view:'wide',title:'回答，要有依據。',subtitle:'知識問答，連著企業文件。',action:'展開引用來源',seconds:30,note:'這是官網公開的法規問答展示，用來看介面與引用機制。不要把畫面中的內容當作本場法律建議，也不宣稱即時連線。'},
    {scene:'screen',asset:'answer',view:'citation',title:'沿著引用，回到原文。',subtitle:'讓答案能被查核，也能繼續追問。',action:'從知識走向任務',seconds:35,note:'按下後鏡頭推向回答和參考來源，帶出可追溯性。接著轉場：如果問題不只要一句答案，而是要完成一份工作呢？'}
  ],
  [
    {scene:'mission',reveal:0,title:'如果問題，是一份工作呢？',subtitle:'AGENT / 從回答，走向協作',action:'展開任務步驟',seconds:30,note:'先只讓觀眾看工作目標：整理設備狀況與關注事項。停留，說明任務通常跨越知識、資料與分析。'},
    {scene:'mission',reveal:1,title:'把目標，拆成可以協作的步驟。',subtitle:'查知識 → 連資料 → 做分析',action:'彙整工作結果',seconds:40,note:'按下後三個步驟依序展開。說明 Agent 依任務使用知識庫與企業系統，並非單純把問題丟給模型。流程為示意。'},
    {scene:'mission',reveal:2,title:'從零散訊息，形成工作摘要。',subtitle:'知識、現況與判讀，放在同一個脈絡。',action:'走進營運戰情室',seconds:35,note:'按下後結果展開。強調整理可供人員判讀的資訊，不宣稱已自動控制機台；將任務能力連到戰情室實際畫面。'},
    {scene:'screen',asset:'dashboard',view:'wide',title:'從對話，走進營運現場。',subtitle:'WinChat / 營運戰情室',action:'聚焦 AI Copilot',seconds:40,note:'官網高解析度戰情室介面。先說全景：指標、趨勢、事件流及右側 AI Copilot。畫面上的數字為官方展示資料，非本場即時營運數據。'},
    {scene:'screen',asset:'dashboard',view:'copilot',title:'把變化，整理成需要關注的事。',subtitle:'從看見指標，到掌握工作脈絡。',action:'讓能力可以組合',seconds:35,note:'鏡頭推向 AI Copilot 與告警摘要。可舉巡檢工作情境：先看狀況，再回到 SOP 與紀錄，讓人決定下一步。'}
  ],
  [
    {scene:'modules',reveal:0,title:'每一項專業，都是可調用的能力。',subtitle:'SKILL / 可組合的企業技能',action:'連起大腦的技能',seconds:30,note:'三個神經能力節點圍繞企業大腦：知識檢索、資料分析、工作彙整。先講每種能力的角色，最後才回歸產品積木。'},
    {scene:'modules',reveal:1,title:'依照任務，把技能組合起來。',subtitle:'知識、系統、分析，接到同一個 Agent。',action:'看看實際工具管理',seconds:40,note:'按下後能力節點向大腦靠攏，神經連線亮起。說明工具需依企業系統、參數與權限配置，這裡是組合概念演示。'},
    {scene:'screen',asset:'tools',view:'wide',title:'技能，是可以管理的能力。',subtitle:'WinChat / 工具包與單項工具',action:'聚焦工具啟用與範圍',seconds:35,note:'展示官網高解析度技能介面。先聚焦知識庫與系統工具，說明各項專業如何成為 Agent 可調用的能力。'},
    {scene:'screen',asset:'tools',view:'tools',title:'哪些工具可用，由企業掌握。',subtitle:'工具包 · 單項工具 · 啟用控制',action:'組成三種企業應用',seconds:35,note:'鏡頭放大知識庫工具與啟用控制。說明可管理工具參數和存取範圍；不把動畫當成真的修改正式系統。'},
    {scene:'applications',reveal:0,title:'同一個 WinChat，不同的工作現場。',subtitle:'客服維修 / 新人培訓 / 現場巡檢',action:'展開三種工作成果',seconds:35,note:'先講三個問題：零件圖怎麼查、新人流程怎麼學、現場異常怎麼整理。每個情境都需要不同的知識與工具組合。'},
    {scene:'applications',reveal:1,title:'讓企業知識，走進每一天的工作。',subtitle:'把經驗留下，把能力組合。',action:'融合為 WinChat',seconds:45,note:'按下後揭曉三種應用成果：圖文知識答覆、SOP 導讀、巡檢摘要。這些是應用示意，不是新客戶實績。最後準備把大腦累積的智慧凝聚成產品積木。'}
  ]
];
export const winChatBeatCounts=winChatScript.map(topic=>topic.length);
export const winChatFinalBeats=2;
export function winChatBeat(state){return winChatScript[state.selected]?.[state.beat||0];}
export function winChatAction(state){
 const beat=winChatBeat(state);
 if(state.selected===2&&state.beat===winChatBeatCounts[2]-1&&!state.canFuse){
  return (state.visited||[]).includes(0)?'深入 Agent 任務協作':'深入 RAG 企業知識';
 }
 return beat?.action;
}
