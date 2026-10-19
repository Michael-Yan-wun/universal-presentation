import { palette, productInk } from './product-colors.js?v=product-colors-1';
export { palette };
export const products = [
  {id:'vision',name:'AIWinOps',order:1,color:palette.vision,ink:'#ffffff',role:'AI VISION PLATFORM',verb:'看見',headline:'先讓 AI，看懂每一個細節。',description:'從影像辨識、瑕疵檢測到品質判讀，<br>把一次次的視覺專案經驗，沉澱成產品。',tags:['AI 影像辨識','AI＋AOI 瑕疵檢測','檢測與分類'],pipeline:['IMAGE','MODEL','INSIGHT'],caseId:'vision',caseTitle:'六類晶圓缺陷，從訓練到現場。',note:'第一塊：AIWinOps。從視覺檢測專案出發，把解過的影像問題沉澱為產品能力。官網列有高爾夫球、紡織、石化等應用；產品介紹順序依本次演講設定，不代表官網已確認的上市日期。'},
  {id:'analytics',name:'NumOps',order:2,color:palette.analytics,ink:'#ffffff',role:'DATA ANALYTICS PLATFORM',verb:'理解',headline:'再讓數據，說出下一步。',description:'當問題藏在訊號與趨勢裡，<br>用資料分析，將經驗轉成可理解的洞察。',tags:['AI 數據分析','預測性維護','製程最佳化'],pipeline:['DATA','ANALYZE','PREDICT'],caseId:'analytics',caseTitle:'從專家規則，走向現場溫控。',note:'第二塊：NumOps。資料與影像是不同的題目，於是將數據分析能力產品化。可提官網紀錄的工業風機維護預測、刀具數據分析與半導體空調節能分析，避免宣稱未提供的改善百分比。'},
  {id:'numeric',name:'WinEdge-N',order:3,color:palette.numeric,ink:'#ffffff',role:'DATA INFERENCE AT THE EDGE',verb:'落地',headline:'把數據模型，帶到現場。',description:'串接資料源、部署數據推論模型，<br>讓分析能力在邊緣端真正運作。',tags:['資料庫與 Modbus','模型部署','儀表板'],pipeline:['CONNECT','INFER','MONITOR'],caseId:'numeric',caseTitle:'讓設備異常，有跡可循。',note:'第三塊：WinEdge-N。介紹數據邊緣推論、資料來源與儀表板。模型的價值必須在現場被使用，這塊積木把數據能力帶到設備旁。'},
  {id:'visual',name:'WinEdge-V',order:4,color:palette.visual,ink:'#ffffff',role:'VISION INFERENCE AT THE EDGE',verb:'辨識',headline:'把視覺 AI，帶到第一線。',description:'透過影像 Pipeline 串接輸入、推論與輸出，<br>讓視覺能力在不同場域部署。',tags:['相機與影像輸入','Pipeline 編排','影像 AI 推論'],pipeline:['CAMERA','PIPELINE','RESULT'],caseId:'visual',caseTitle:'辨識金屬表面的微小刮傷。',note:'第四塊：WinEdge-V。與前一塊的資料推論呼應，這塊處理影像。用官網金屬刮傷案例說明從影像輸入到現場判讀的流程。'},
  {id:'chat',name:'WinChat',order:5,color:palette.chat,ink:'#ffffff',role:'KNOWLEDGE & AGENT COLLABORATION',verb:'協作',headline:'最後，讓知識與智慧彼此連結。',description:'企業知識中樞，連結 AI Agent 協作。<br>讓不同專業，開始說同一種語言。',tags:['企業知識中樞','AI Agent 協作','人與 AI 的對話'],pipeline:['KNOWLEDGE','AGENTS','COLLABORATE'],caseId:'chat',caseTitle:'把企業知識，帶進一段對話。',note:'第五塊：WinChat。從提供的架構圖帶出 Enterprise Knowledge Hub 與 AI Agent Collaboration。使用簡報第 38 頁的知識庫介面說明來源引用與權限。介紹完五塊後停一下，再按 → 進入新品發佈。'}
];
export const milestones = [
 {year:'2016—19',title:'在現場，累積答案',text:'從影像辨識出發，走進製造、零售與更多真實場域。'},
 {year:'2020—23',title:'讓經驗，成為產品',text:'走向 AI SaaS、Domain AI 與 WinHub.AI 平台。'},
 {year:'2024—26',title:'從 Edge，走向 Agent',text:'WinEdge 連接現場；WinChat 串起知識與多領域智慧。'}
];
export const combinations = [
 {id:'inspection',title:'Wafer Map 瑕疵分類',english:'SEMICONDUCTOR / WAFER MAP',date:'半導體 · 視覺檢測',headline:'從看懂一張圖，到看懂每一片晶圓。',fact:'辨識 Scratch、Loc、Edge-Ring 等六類晶圓缺陷，將訓練完成的視覺模型部署到現場。',flow:['AIWinOps','WinEdge-V'],products:['vision','visual'],roles:['模型訓練與驗證','現場影像推論'],caseId:'combo-inspection',image:'pitch-wafer-map.png',alt:'簡報中的 Wafer Map 六類瑕疵模型驗證畫面',proof:'6 種缺陷模式',sourceLabel:'AIWin 完整 Pitch v5 · 第 28 頁',note:'以六類 Wafer Map 缺陷為例。AIWinOps 建立並驗證模型，WinEdge-V 帶到現場。畫面為簡報中的實際模型驗證截圖。'},
 {id:'temperature',title:'智慧烤箱溫控',english:'MANUFACTURING / PROCESS CONTROL',date:'製造 · 製程控制',headline:'把老師傅的經驗，變成能運作的智慧。',fact:'將溫控經驗建立為專家規則，控制 27 個風門、觀察 15 個溫度點，透過邊緣推論協助製程調整。',flow:['NumOps','WinEdge-N'],products:['analytics','numeric'],roles:['專家系統與規則庫','現場數據推論'],caseId:'combo-temperature',image:'pitch-oven-temperature.png',alt:'簡報中的十五個溫度點趨勢圖與175至185度目標區間',proof:'27 風門 × 15 溫度點',sourceLabel:'AIWin 完整 Pitch v5 · 第 34 頁',note:'先說明烤箱需要穩定控制，而老師傅經驗難複製。NumOps 將經驗轉成專家規則；WinEdge-N 承接現場推論。圖中的紅線是 175–185℃ 目標區間，數據只代表此案例。'},
 {id:'knowledge',title:'企業知識，開始行動',english:'ENTERPRISE / KNOWLEDGE & AGENTS',date:'企業知識 · AI 協作',headline:'從找到答案，到串起下一個行動。',fact:'以 PDF、Word、Excel 建立企業知識庫，結合來源引用、助理權限與 AI Agent 工具協作。',flow:['WinChat','AI Agent'],products:['chat','domain'],roles:['企業知識與 RAG','工具調用與任務協作'],caseId:'combo-knowledge',image:'pitch-winchat.png',alt:'簡報中的 WinChat 知識庫與來源引用操作介面',proof:'知識 × 工具 × 協作',sourceLabel:'AIWin 完整 Pitch v5 · 第 20、38 頁',note:'展示簡報中的 WinChat 介面，說明知識庫、來源引用與權限；再接到第 20 頁的 Agent 工具調用概念。不同專業積木因此可以開始協作。'}
];
export const historyCases = [
 {label:'VISION / 影像',title:'Wafer Map 瑕疵分類',short:'WAFER MAP',color:palette.vision,image:'pitch-wafer-map.png',caseId:'combo-inspection',ability:'從缺陷影像，累積辨識模型',phase:'看懂每一個缺陷，累積視覺智慧。'},
 {label:'DATA / 數據',title:'智慧烤箱溫控',short:'PROCESS CONTROL',color:palette.analytics,image:'pitch-oven-temperature.png',caseId:'combo-temperature',ability:'從製程數據，沉澱專家規則',phase:'把老師傅的經驗，沉澱成專家規則。'},
 {label:'LLM / 語言',title:'企業知識問答',short:'ENTERPRISE KNOWLEDGE',color:palette.chat,image:'pitch-winchat.png',caseId:'combo-knowledge',ability:'從企業文件，建立知識資產',phase:'讓企業知識，成為可以協作的智慧。'}
];
// Five representative films embedded in the supplied Pitch v5; PoC status remains explicit.
export const visionCases = [
 {id:'vision-caps',title:'瓶蓋瑕疵檢測',english:'DEFECT INSPECTION',industry:'食品飲料',ability:'瑕疵辨識',category:'INSPECTION',image:'vision/caps.jpg',video:'vision/caps.mp4',page:46,status:'應用展示',headline:'讓每一個細節，都被看見。',description:'從產線影像辨識瓶蓋品質，將瑕疵判讀整理成可追蹤的檢測結果。',steps:['取得產線上的瓶蓋影像。','辨識外觀與瑕疵特徵。','留下檢測結果，供品質人員追蹤。']},
 {id:'vision-safety',title:'工安風險監控',english:'SAFETY MONITORING',industry:'作業現場',ability:'場域監控',category:'SAFETY',image:'vision/safety.jpg',video:'vision/safety.mp4',page:47,status:'應用展示',headline:'把現場影像，變成安全線索。',description:'以影像觀察場域與人員活動，整理需要關注的風險情境，協助現場管理。',steps:['持續觀察作業場域。','辨識影像中的風險情境。','保留事件畫面，協助人員確認與處置。']},
 {id:'vision-eggs',title:'雞蛋計數分類',english:'COUNTING & CLASSIFICATION',industry:'食品加工',ability:'追蹤與分類',category:'COUNTING',image:'vision/eggs.jpg',video:'vision/eggs.mp4',page:45,status:'技術展示',headline:'在流動的產線裡，看清每一顆。',description:'追蹤輸送帶上的雞蛋，在指定區域進行計數與分類，將連續影像轉為可理解的數量資訊。',steps:['辨識輸送帶上的個別物件。','追蹤通過指定區域的目標。','累積計數與分類結果。']},
 {id:'vision-weighing',title:'秤重 SOP 檢查',english:'WEIGHING SOP',industry:'半導體封裝',ability:'作業順序辨識',category:'SOP SEQUENCE',image:'vision/weighing.jpg',video:'vision/weighing.mp4',page:43,status:'PoC 實證',headline:'不只看動作，更看懂作業順序。',description:'以空箱、磅秤歸零與滿箱放置等影像線索，檢查秤重步驟，留下違規與事件紀錄。',steps:['辨識空箱與滿箱狀態。','檢查磅秤歸零是否完成。','依作業順序判定，保留事件紀錄。']},
 {id:'vision-assembly',title:'組裝 SOP 檢查',english:'ASSEMBLY VERIFICATION',industry:'電子組裝',ability:'檢查點辨識',category:'ASSEMBLY',image:'vision/assembly.jpg',video:'vision/assembly.mp4',page:49,status:'技術實證',headline:'把「有沒有做」，變成可檢查的畫面。',description:'追蹤組裝過程中的物件與動作，逐項確認螺絲等檢查點，讓作業完成性有跡可循。',steps:['定位組裝物件與檢查區域。','辨識動作與螺絲放置狀態。','逐項呈現檢查點的完成情形。']}
];
// The growth sequence is a narrative metaphor, not a claim about launch dates.
const growthCopy={
 visual:{order:1,verb:'感知 / 眼睛',headline:'像睜開眼睛，先看見世界。',description:'相機取得影像，WinEdge-V 在現場接收與推論。<br>每一個畫面，都是理解真實問題的起點。',tags:['相機 × 邊緣設備','影像 Pipeline','現場影像推論']},
 numeric:{order:2,verb:'感知 / 觸覺',headline:'不只看見，也感受每一次變化。',description:'感測器帶回溫度、震動與設備訊號。<br>WinEdge-N 連接資料、執行推論，讓現場可以被理解。',tags:['感測器 × PLC','Modbus · MC Protocol · Database','數據邊緣推論']},
 vision:{order:3,verb:'學習 / 視覺規律',headline:'像走進學校，開始學會分辨。',description:'依專案整理影像，標記正確與異常的特徵。<br>透過訓練、驗證與修正，把一次經驗變成可重複的能力。',tags:['分專案管理','影像標註','模型訓練與驗證'],pipeline:['ORGANIZE','LABEL','LEARN','DEPLOY']},
 analytics:{order:4,verb:'學習 / 數據規律',headline:'從看見變化，到讀懂規律。',description:'把設備訊號、製程數據與專家經驗放在一起。<br>NumOps 協助分析與建模，再交回 WinEdge-N 運作。',tags:['數據分析','專家規則','預測與製程判讀'],pipeline:['DATA','PATTERN','MODEL','FEEDBACK']},
 chat:{order:5,verb:'思考 / 記憶與行動',headline:'有了知識，還要知道怎麼做。',description:'RAG 找到企業記憶，Agent 串起任務與工具。<br>Skill 承載可重複使用的工作方法，讓知識接上行動。',tags:['RAG · 有來源的記憶','Agent · 任務與工具','Skill · 可重用的方法'],pipeline:['RAG','AGENT','SKILL','ACTION']}
};
const growthNotes={
 visual:'在感知世界中展開三款相機，讓影像匯入搭載 WinEdge-V 的 Edge 硬體，再接到數據感知。',
 numeric:'緊接影像感知，透過 Modbus、MC Protocol、Database 接收設備數字；搭載 WinEdge-N 的 Edge 硬體把資料帶進現場判讀，直接接到實戰案例。',
 vision:'五個影像案例逐案搭配硬體，再講專案整理、標註、訓練與驗證；全部經驗積木旋轉融合，誕生 AIWinOps。',
 analytics:'將資料放回情境、分析模式與專家規則、回到現場驗證，三塊經驗融合成 NumOps。銜接 WinEdge-N，形成學習與回饋的迴路。',
 chat:'依序深入 RAG 的企業記憶、Agent 的任務協作、Skill 的可重用方法，三塊能力融合為 WinChat，再進入完整智慧身體。'
};
for(const p of products)Object.assign(p,growthCopy[p.id],{note:growthNotes[p.id],uiColor:productInk[p.id]});
const productChapter=id=>{const p=products.find(p=>p.id===id);return {slug:p.id,kind:'product',accent:p.uiColor,label:p.name,product:p,stage:p.order<=2?'sense':p.order<=4?'learn':'think',note:p.note+' 本次以人的成長作為敘事比喻，產品介紹順序不等同上市年份。'}};
export const chapters = [
 {slug:'intro',kind:'intro',accent:'#dc946f',label:'開場',stage:'intro',note:'十年經驗，積累成功。如果公司的成長像一個人，我們如何從感知世界，走到理解、思考與行動？'},
 {slug:'company',kind:'company',accent:'#eda76f',label:'公司介紹',stage:'company',note:'慧穩科技 AIWin 是企業 AI 導入專家，深耕智慧製造、半導體與企業 AI 應用。依本次提供的公司簡介，累積 150+ AI 落地案例、30+ 產業服務經驗與 6 項國家專利，並跨足越南、韓國、泰國市場。WinHub.AI 融合視覺辨識、數據分析、知識中樞與邊緣運算。從這些現場經驗出發，接下來用生命的成長，說明 AI 如何感知、學習與行動。'},
 {slug:'company-history',kind:'chronicle',accent:'#f08200',label:'公司沿革',stage:'company-history',note:'依使用者提供的公司沿革資料，分為 2016–2020 扎根與產品化、2021–2025 平台與國際化。先從慧穩創立、跨域專案與專利，說到 AI SaaS 模式；再帶出 WinHub.AI、資本挹注、多模態平台與海外市場。年份沿用原資料，不將後續產品學習比喻視為上市年份。'},
 {slug:'first-contact',kind:'growth',accent:'#8cbbd7',label:'感知世界',stage:'sense',note:'像嬰兒第一次用眼睛與雙手接觸世界。感知不只有相機：鏡頭、光源與取像決定輸入的品質，串流與前處理整理畫面；感測器、PLC、資料庫與通訊帶回物理變化及設備脈絡。WinEdge-V 與 WinEdge-N 接收這些輸入，在現場串起流程、推論與回饋。接著依序展開影像入口與數據入口，兩塊 WinEdge 都由 Edge 硬體搭載；數據入口以 Modbus、MC Protocol、Database 接入，不再經過獨立三段式產品介紹。六個入口是概念說明，配置依現場而定。這是成長比喻，不是產品上市時間軸。'},
 {slug:'decade',kind:'history',accent:'#92a8c8',label:'從經驗中學習',stage:'experience',note:'承接前面的生命體：有了影像與數據的感知，就像孩子開始上學，在十年的不同專案中累積知識與判斷經驗。將現場資料依專案整理、標註，再反覆訓練與驗證，讓模型逐步學會判斷。先看五個影像案例影片，再逐案看硬體如何接收影像、在 WinEdge-V 上推論並輸出結果。五案完成後，全部經驗積木形成龍捲風，誕生 AIWinOps；硬體留下，連成現場蒐集、訓練、部署與回饋的迴路。完成後進入 NumOps，繼續學習數據中的規律。'},
 productChapter('analytics'),productChapter('chat'),
 {slug:'connected-intelligence',kind:'body',accent:'#a5c9d1',label:'協作成形',stage:'connect',note:'眼睛與觸覺接收資訊，AIWinOps 與 NumOps 學會規律，WinChat 串起記憶、任務與技能。設備與執行端像肢體，資料通道像神經。所有部位開始協作；但數據與影像還分開，為新品發佈留下問題。'},
 {slug:'winedge',kind:'launch',accent:productInk.unified,label:'WinEdge 新品',stage:'evolve',note:'完整的身體，不會把看見的與感受到的分開。揭曉 WinEdge：最貼近現場的 AI 平台。整合 WinEdge-N 與 WinEdge-V，依製造業、機台、Agent、儀表板與 Robot 等現場需求，模組化組合各式 AI 應用。名稱與定位依使用者本次確認，不加入未提供的硬體規格或效能承諾。'},
 {slug:'castle',kind:'castle',accent:productInk.unified,label:'智慧城堡',stage:'evolve',note:'WinEdge 統一現場入口，AIWinOps 與 NumOps 提供學習能力，WinChat 的 RAG、Agent、Skill 串起知識與行動，再依領域組成不同 AI 大腦。模組化的智慧身體，可以長出不同的專業組合。'},
 ...combinations.map(c=>({slug:c.id,kind:'case',accent:products.find(p=>p.id===c.products[0]).uiColor,label:c.title,stage:'practice',combination:c,note:c.note})),
 {slug:'closing',kind:'closing',accent:'#a8c4df',label:'封底',stage:'closing',note:'下一個十年，與你同行。感謝一路同行的夥伴；讓每一次累積，成為下一個智慧新章。'}
];
export const senseRoutes={visual:'cameras',numeric:'data'};
export const chapterFor=slug=>chapters.findIndex(c=>c.slug===(senseRoutes[slug]?'first-contact':slug==='one-more-thing'?'winedge':slug));
export const resolveChapterRoute=slug=>({index:chapterFor(slug),senseMode:senseRoutes[slug]});
export const growthStages=[{id:'sense',title:'感知',sub:'眼睛與觸覺'},{id:'experience',title:'實戰',sub:'接觸真實問題'},{id:'learn',title:'學習',sub:'辨識與理解規律'},{id:'think',title:'思考',sub:'記憶、任務與技能'},{id:'connect',title:'協作',sub:'神經與肢體連結'},{id:'evolve',title:'進化',sub:'WinEdge'}];
const fieldLinks=[
 {input:'瓶蓋影像',device:'相機與取像設備',output:'品質結果與檢測紀錄',feedback:'現場的新樣本，回到專案中持續標註與驗證。'},
 {input:'人員與場域影像',device:'現場攝影機',output:'事件畫面與風險提示',feedback:'將不同場域的情境留下，讓模型學習環境差異。'},
 {input:'輸送帶連續影像',device:'產線相機',output:'計數與分類結果',feedback:'從連續的作業中留下樣本，持續檢查追蹤與分類。'},
 {input:'秤重作業影像',device:'作業攝影機',output:'SOP 狀態與異常提示',feedback:'記錄正確步驟與異常情境，累積可學習的作業經驗。'},
 {input:'組裝動作與物件影像',device:'組裝站攝影機',output:'檢查點與完成紀錄',feedback:'把每次作業轉成有脈絡的影像與標記。'}
];
visionCases.forEach((c,i)=>c.hardware=fieldLinks[i]);
export const agents = [
  {id:'water-agent',title:'Smart Water',zh:'智慧水務',icon:'droplet'},
  {id:'defect-agent',title:'Defect Inspection',zh:'瑕疵檢測',icon:'scan'},
  {id:'safety-agent',title:'Safety Monitoring',zh:'安全監控',icon:'shield'},
  {id:'equipment-agent',title:'Equipment Monitoring',zh:'設備監控',icon:'gauge'},
  {id:'document-agent',title:'Document Assistant',zh:'文件助理',icon:'document'}
];
export const icons={droplet:'M12 3C10 7 5 11 5 15a7 7 0 0 0 14 0c0-4-5-8-7-12z',scan:'M8 3H3v5m13-5h5v5M3 16v5h5m13-5v5h-5M8 8h8v8H8z',shield:'M12 3 4 6v6c0 5 8 9 8 9s8-4 8-9V6z',gauge:'M4 18a9 9 0 1 1 16 0M12 14l5-7M8 18h8',document:'M6 3h9l4 4v14H6zM14 3v5h5M9 12h7m-7 4h7'};
export const cases = {
 'camera-basler':{title:'Basler ace 2：工業取像的一種選擇。',eyebrow:'INDUSTRIAL VISION / BASLER',description:'官方圖示為 ace 2 USB 3.0 工業相機。工業用途與 USB 介面可以同時成立；現場仍需搭配合適的鏡頭、光源與取像配置。',steps:['光學與照明：先讓目標的細節可被看見。','相機與取像：把畫面轉成可處理的影像。','影像流程：再按專案需求串起前處理與模型。'],image:'basler-ace2-usb.jpg',alt:'Basler ace 2 USB 3.0 工業相機的正面及背面官方產品圖',source:'https://docs.baslerweb.com/a2a1920-160ucbas',footnote:'產品圖片來源：Basler AG · ace 2 USB 3.0。3D 取像鏈為概念示意。'},
 vision:{title:'Wafer Map：讓 AI 看懂晶圓缺陷。',eyebrow:'AIWINOPS / VISION INTELLIGENCE',description:'以 Scratch、Loc、Edge-Ring、Edge-Loc、Donut、Center 六類晶圓缺陷建立辨識能力，再由 WinEdge-V 承接現場推論。',steps:['AIWinOps：影像與標註資料準備。','訓練與驗證六類 Wafer Map 模型。','WinEdge-V：將視覺模型部署到現場。'],image:'pitch-wafer-map.png',alt:'簡報中的六類 Wafer Map 模型驗證介面',footnote:'來源：AIWin 完整 Pitch v5，第 28 頁。圖片為簡報原始驗證畫面。'},
 analytics:{title:'把老師傅經驗，變成可運作的規則。',eyebrow:'NUMOPS / EXPERT SYSTEM',description:'智慧烤箱案例利用專家系統建立規則庫，將 27 個風門與 15 個溫度點的調控經驗產品化，再由 WinEdge-N 承接現場推論。',steps:['將溫度與風門角度建立成規則。','透過 NumOps 專家系統進行推論。','觀察現場溫度，協助製程調整。'],image:'pitch-oven-temperature.png',alt:'簡報中的十五個溫度點趨勢圖',footnote:'來源：AIWin 完整 Pitch v5，第 34 頁。圖中 175–185℃ 為此案例的目標範圍。'},
 numeric:{title:'設備異常偵測',eyebrow:'WINEDGE-N / OFFICIAL APPLICATION',description:'WinEdge-N 官方案例透過感測資料辨識設備異常行為，協助現場人員掌握潛在問題。',steps:['接收溫度、震動、水壓與運轉狀態。','在邊緣端執行數據 AI 推論。','透過儀表板呈現資訊，供人員判讀。'],image:'winedge-n.png',alt:'WinEdge-N 官方數據儀表板介面',source:'https://winhub.ai/zh-Hans/winedge-n',footnote:'產品介面與應用描述依 WinEdge-N 官網。'},
 visual:{title:'金屬刮傷檢查',eyebrow:'WINEDGE-V / OFFICIAL APPLICATION',description:'WinEdge-V 官方應用以 AI 檢查金屬零件表面刮傷、凹痕與瑕疵。',steps:['相機與影像輸入。','透過 Pipeline 進行預處理與模型推論。','輸出結果，協助判斷品質。'],image:'metal-inspection.png',alt:'WinEdge-V 官方金屬刮傷檢查案例',source:'https://winhub.ai/zh-Hans/winedge-v',footnote:'圖片與應用依 WinEdge-V 官網；未宣稱特定客戶或準確率。'},
 chat:{title:'讓知識走進每一次工作對話。',eyebrow:'WINCHAT / KNOWLEDGE & AGENTS',description:'從企業文件建立知識庫，透過來源引用與助理權限，協助人員查找知識，再延伸至 AI Agent 的工具與任務協作。',steps:['解析 PDF、Word 與 Excel 文件。','建立企業知識庫與 RAG 檢索。','引用來源、控制助理權限，連結 Agent 工具。'],image:'pitch-winchat.png',alt:'WinChat 企業知識庫與來源引用介面',footnote:'來源：AIWin 完整 Pitch v5，第 19、20、38 頁。圖片為簡報中的產品介面。'},
 ecosystem:{title:'每一塊專業，都有自己的位置。',eyebrow:'THE INTELLIGENCE CASTLE',description:'WinEdge 是整合數據與影像的現場入口，AIWinOps 與 NumOps 承接視覺與數據能力；WinChat 與 AI Agent 則串起企業知識與協作。',steps:['現場：設備、感測器、PLC 與相機。','WinEdge：整合數據與影像，依需求擴充模組。','AIWinOps、NumOps：專業能力；WinChat、AI Agent：知識與協作。'],type:'agents',footnote:'依本次產品策略繪製的概念架構，不代表正式技術部署拓樸。'},
 decade:{title:'每一個專案，都留下一塊能力。',eyebrow:'AIWIN / 2016—2026',description:'慧穩從 2016 年成立後投入產業 AI，並在 2020—2022 年逐步發展 AI SaaS、Domain AI SaaS 與 WinHub.AI。',steps:['先在真實的產業問題中累積能力。','再把反覆被需要的能力產品化。','讓不同能力能再次組合，回到更多現場。'],image:'aiwin-2020-tie-exhibition.png',alt:'慧穩科技 2020 台灣創新技術博覽會展會合影',source:'https://aiwin.com.tw/archives/3690',footnote:'歷程與 150+ 專案、30+ 產業數據：簡報第 5–6 頁。照片：2020 台灣創新技術博覽會。'},
};
for(const c of combinations){cases[c.caseId]={title:c.title,eyebrow:c.english,description:c.fact,steps:c.flow.map((p,i)=>p+' · '+c.roles[i]),image:c.image,alt:c.alt,footnote:c.sourceLabel+'。圖片與案例資料來自使用者提供簡報。'};}
for(const c of visionCases){cases[c.id]={title:c.title,eyebrow:c.category+' / '+c.industry,description:c.description,steps:c.steps,image:c.image,alt:c.title+'的實際平台驗證畫面',footnote:'AIWin 完整 Pitch v5 · 第 '+c.page+' 頁。畫面來自使用者提供簡報。'};}
const domainContent={
 'water-agent':{description:'把水質、流量與水壓訊號，放進水務知識裡理解。',steps:['接收水質、流量與設備訊號。','結合水務領域知識，判讀趨勢與異常。','透過 WinChat 彙整資訊，協助維運人員處置。']},
 'defect-agent':{description:'將視覺檢測結果，連結到品質判讀與缺陷知識。',steps:['接收 AIWinOps 與 WinEdge 的影像判讀。','結合瑕疵分類與品質規範理解問題。','透過 WinChat 查找相關知識，協助品質追蹤。']},
 'safety-agent':{description:'把現場影像與安全規範，連結成情境判讀。',steps:['觀察現場事件與作業情境。','結合 SOP 與安全規範，協助辨識風險。','整理事件資訊，交由人員確認與處置。']},
 'equipment-agent':{description:'理解設備的訊號變化，也理解維護工作中的經驗。',steps:['透過 WinEdge 接收設備與感測資料。','結合 NumOps 分析與設備知識辨識異常。','透過 WinChat 查找維護紀錄，協助人員排查。']},
 'document-agent':{description:'將散落的企業文件，整理成可查找、有來源的知識。',steps:['由 WinChat 建立企業文件與知識庫。','以 RAG 檢索相關內容，保留來源引用。','依權限回應問題，協助人員完成工作。']}
};
for(const a of agents){cases[a.id]={title:a.zh+' AI Agent',eyebrow:a.title.toUpperCase()+' / DOMAIN INTELLIGENCE',...domainContent[a.id],type:'agents',footnote:'領域協作情境依架構圖與簡報第 20–21 頁呈現；動畫為概念說明。'};}
