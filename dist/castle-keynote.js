// A short, presenter-driven map of the keynote. No timed text changes.
export const castleBeats=[
 {id:'whole',line:'一座城堡，三層可以彼此協作的能力。',caption:'影像、數據與知識，連成完整的現場智慧。',note:'先讓觀眾看見完整架構。這十年，每個專案都留下一塊能力；積木代表可重複、可組合的專業。接下來用三次推進，依序點亮感知、學習、思考與行動。此頁是能力全貌，新品功能留在後段發表。'},
 {id:'sense',line:'讓每一種現場，都有進入 AI 的入口。',caption:'相機 · 感測器 · PLC · 資料庫 → WinEdge → 現場運算',note:'第一層是感知。相機、設備與資料庫把影像和數據帶進來；WinEdge 搭載 Edge 硬體，把推論與回饋接回現場。不要在此展開新品規格，後面再講整合後的工作流程。'},
 {id:'learn',line:'把專案經驗，轉成可重複的判斷。',caption:'AIWinOps：標註・訓練・驗證　｜　NumOps：AutoML ＋ 專家系統',note:'第二層是學習。AIWinOps 從影像樣本與標註學會辨識；NumOps 結合 AutoML 與專家系統理解數據規律。這些能力來自不同現場經驗。WaterOps 是後面 NumOps 章節會展開的合作例子。'},
 {id:'act',line:'讓知識與技能，成為現場真正的行動。',caption:'WinChat Agent → 領域應用 → 現場回饋',note:'第三層是思考與行動。WinChat Agent 運用 RAG 多模態知識與 SKILL 工作能力，組成各領域應用；例如現場巡檢摘要，可依需求串接 LINE、警示設備或匯出報告。光流回到現場，代表完整循環，而非自動訓練或未確認的接口。接著回到起點：這座城堡如何從感知、實戰與學習，一步步長出來？'}
];
export function createCastleProgress(){let index=0;return {get index(){return index;},reset(value=0){index=Math.max(0,Math.min(castleBeats.length-1,Number(value)||0));return index;},next(){if(index===castleBeats.length-1)return false;index++;return true;},previous(){if(index===0)return false;index--;return true;}};}
const layers=[
 {id:'sense',number:'01',title:'感知現場',product:'WinEdge',detail:'影像 × 數據 × 現場硬體',color:'#63d8c5'},
 {id:'learn',number:'02',title:'學會判斷',product:'AIWinOps × NumOps',detail:'影像模型 × AutoML × 專家系統',color:'#f2b48d'},
 {id:'act',number:'03',title:'思考與行動',product:'WinChat Agent',detail:'RAG 多模態知識 × SKILL 工作能力',color:'#c3a4ff'}
];
export function castleStoryHTML(){return `<div class="ct-heading"><p class="eyebrow"><span class="eyebrow-line"></span>THE INTELLIGENCE CASTLE</p><h1>十年累積，<br><em>築成智慧。</em></h1></div><div class="ct-layers">${layers.map(l=>`<article data-castle-layer="${l.id}" style="--layer-color:${l.color}"><span class="ct-layer-number">${l.number}</span><div><h2>${l.title}</h2><strong>${l.product}</strong><p>${l.detail}</p></div><i aria-hidden="true"></i></article>`).join('')}</div><div class="ct-thought"><span class="ct-thought-label">ONE CONNECTED SYSTEM</span><p data-castle-line>${castleBeats[0].line}</p></div>`;}
export function castleDetailHTML(){return `<div class="ct-domain-title"><span>DOMAIN INTELLIGENCE</span><p>共通能力，組合成不同領域的智慧。</p></div><div class="ct-knowledge"><span>Agent 統籌</span><b>RAG <i>＋</i> SKILL</b></div><div class="ct-stage-foot"><p data-castle-caption>${castleBeats[0].caption}</p><div><span>感知</span><i></i><span>學習</span><i></i><span>思考與行動</span><i class="ct-return"></i></div></div>`;}
export function paintCastleBeat(root,story,detail,index){const b=castleBeats[index];root.dataset.castleBeat=b.id;for(const row of story.querySelectorAll('[data-castle-layer]')){const active=index===0||row.dataset.castleLayer===b.id;row.classList.toggle('is-lit',active);if(row.dataset.castleLayer===b.id)row.setAttribute('aria-current','step');else row.removeAttribute('aria-current');}story.querySelector('[data-castle-line]').textContent=b.line;detail.querySelector('[data-castle-caption]').textContent=b.caption;}
