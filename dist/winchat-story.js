import {winChatBrain} from './winchat-brain.js?v=winchat-brain-1';
import {winChatKeynote} from './winchat-keynote.js?v=winchat-brain-1';
// Keynote visuals: official WinChat capabilities + the user's multimodal RAG brief.
// All question/answer and workflow examples below are illustrative, not a live product session.
export const winChatSource='https://www.aiwin.com.tw/products/winchat';
const symbols={document:'M7 3h7l4 4v14H7z M14 3v5h5 M10 12h5 M10 16h5',image:'M3 4h18v16H3z M3 16l6-6 4 4 3-3 5 6 M15 8h.01',brain:'M12 5c-3-5-7-1-6 2-5 0-5 8-1 9-1 5 6 6 7 2V5z M12 5c3-5 7-1 6 2 5 0 5 8 1 9 1 5-6 6-7 2 M7 10c3-1 4 2 2 4 M17 10c-3-1-4 2-2 4',search:'M15 15l6 6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',database:'M4 6c0-5 16-5 16 0s-16 5-16 0v12c0 5 16 5 16 0V6 M4 12c0 5 16 5 16 0',skill:'M9 3h6v5h6v7h-6v6H9v-6H3V8h6z',check:'M4 12l5 5L20 6',shield:'M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6z M8 12l3 3 5-6',chat:'M3 4h18v13H9l-6 4z M7 9h10 M7 13h6',chart:'M3 3v18h18 M6 15l4-6 4 3 6-8',arrow:'M4 12h16 M14 6l6 6-6 6',globe:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M2 12h20 M12 2c-6 5-6 15 0 20 6-5 6-15 0-20',people:'M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M2 22v-4c0-7 14-7 14 0v4 M17 3a4 4 0 0 1 0 8 M18 14c4 0 4 4 4 8'};
const icon=id=>`<svg class="wc-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${symbols[id]||symbols.brain}"/></svg>`;
const kicker=text=>`<p class="wc-kicker"><i></i>${text}</p>`;
const tag=(name,sub)=>`<div class="wc-topic-mark"><b>${name}</b><span>${sub}</span></div>`;
const topics=[
 {tag:'RAG',label:'企業的記憶',title:'不只讀文字。<br><em>也看懂圖像。</em>',copy:'文字、圖片、圖表與文件脈絡，<br>一起成為可檢索的企業知識。',points:[['VLM','讀懂圖片、圖表與頁面內容'],['LLM + Embedding','理解文字，建立知識索引'],['來源引用','讓回答有依據，也能回到原文']],note:'重點為使用者補充的多模態 RAG：VLM 處理圖像，LLM 理解文字，Embedding 建立檢索表示。動畫的維修文件、問題與答案均為情境示意，不是客戶資料或實測。官網支持文件解析、多知識庫、Vector／Hybrid／GraphRAG 與引用來源。'},
 {tag:'AGENT',label:'思考與協作',title:'從一個問題，<br><em>走向完整任務。</em>',copy:'把知識、即時資料與工具連起來，<br>協助分析、整理與決策。',points:[['理解目標','把工作需求拆成可執行的步驟'],['串接系統','結合知識庫、資料庫與企業流程'],['彙整結果','產出摘要與看板，交回人員使用']],note:'以現場狀況摘要示意 Agent 任務協作，強調檢索、資料查詢、整理回覆。官網支持 AI Agent 多步推理、MySQL／PostgreSQL／CSV 資料源、監控看板與 Web API。示意不是即時監控，不宣稱自動控制設備或保證推理正確。'},
 {tag:'SKILL',label:'可組合的技能',title:'把專業做法，<br><em>變成可用的技能。</em>',copy:'知識工具與系統工具，<br>讓 Agent 依任務調用所需能力。',points:[['工具包管理','依工作需求開啟對應技能'],['權限範圍','設定工具參數與可存取資源'],['重複組合','把專業能力用在不同企業情境']],note:'官網技能頁支持工具包與單項工具啟停、工具參數及權限範圍。用客服維修、新人培訓、現場巡檢呈現組合方向，不宣稱可自行學會技能、保證所有外部系統現成支援。'}
];
export const winChatTopics=topics;
const applications=()=>`<div class="wc-applications">${[['chat','客服與維修','找知識 · 查圖解'],['people','新人與培訓','學流程 · 問規範'],['chart','現場與巡檢','看狀態 · 做摘要']].map(a=>`<div>${icon(a[0])}<strong>${a[1]}</strong><small>${a[2]}</small></div>`).join('')}</div>`;
function drawing(){return `<svg class="wc-drawing" viewBox="0 0 300 190" aria-hidden="true"><g stroke="#8196bc" stroke-width="1.5" fill="none"><path d="M55 122L130 153 243 91 167 57z M55 122V68l76 31v54 M55 68l112-62 76 30v55 M131 99l112-63 M80 79v56 M109 92v54 M159 84v54 M186 69v54 M214 53v54"/><path d="M87 38l73 30 52-29-73-29z M87 38V59l73 30V68 M160 89l52-29V39"/><circle cx="202" cy="90" r="9"/><path d="M211 90h53v47"/></g><rect class="wc-image-target" x="180" y="68" width="44" height="44" rx="6"/><circle cx="202" cy="90" r="3" fill="#b998f6"/></svg>`;}
function overview(state){
 const active=state.phase==='selecting'?state.selected:-1;
 const portalTitles=['讓經驗，<br>成為<em>企業記憶。</em>','連起知識，<br>開始<em>思考協作。</em>','連起專業，<br>學會<em>調用技能。</em>'];
 return {key:`brain-${active}`,layout:'brain',action:active>=0?`進入 ${topics[active].tag}`:'展開 WinChat 多模態 RAG',story:`${kicker('WINCHAT / THE THINKING CHAPTER')}<h1 class="wc-heading">${active<0?'從記住，<br>到知道<em>怎麼做。</em>':portalTitles[active]}</h1><p class="wc-intro-copy">學會看見與分析之後，<br>讓企業擁有記憶、思考與技能。</p><div class="wc-topic-links">${topics.map((t,i)=>`<button data-journey="select" data-topic="${i}" ${active>=0?'disabled':''}><span>0${i+1}</span><div><b>${t.tag}</b><strong>${t.label}</strong></div><i>↗</i></button>`).join('')}</div><p class="wc-worlds">客服維修 / 新人培訓 / 現場巡檢</p>`,detail:`<div class="wc-overview-visual ${active>=0?'is-entering':''}"><div class="wc-brain-heading"><span>MEMORY. REASONING. ACTION.</span><strong>逐漸成熟的企業大腦</strong></div>${winChatBrain({interactive:active<0,active})}</div>`,note:'以企業大腦接續生命體的成長：RAG 是記憶，Agent 是思考，Skill 是可調用的技能。三段內容講完，才把累積的智慧凝聚成 WinChat 積木。'};
}
export function winChatUI(state){
 if(['overview','selecting'].includes(state.phase))return overview(state);
 if(['focus','born'].includes(state.phase))return winChatKeynote(state,{icon,drawing});
 if(state.phase==='fusing')return {key:'fusing',layout:'fusion',story:'',detail:`<div class="wc-fusion"><p class="wc-kicker">INTELLIGENCE TAKES SHAPE</p><h1>讓累積的智慧，<br><em>凝聚成一塊能力。</em></h1><div class="wc-mind-condense">${winChatBrain({mode:'fusion'})}</div><div class="wc-fusion-halo"><i></i><i></i><i></i><i></i></div><div class="wc-fusion-words"><span>RAG</span><b>＋</b><span>Agent</span><b>＋</b><span>Skill</span></div></div>`,note:'大腦與神經訊號聚光收攏，再揭曉 WinChat 積木。此時才將記憶、思考與技能回歸整體積木故事。'};
}

export function winChatEvidence(view='answer'){
 const skills=view==='skills';
 return `<div class="wc-proof"><div class="wc-proof-top"><span>WINCHAT / OFFICIAL PRODUCT VIEW</span><h2 id="case-heading">${skills?'技能與工具包管理':'知識問答，附上引用來源。'}</h2><p>AIWin 官方產品介面</p><div><button data-winchat-evidence="answer" aria-pressed="${!skills}">RAG 知識問答</button><button data-winchat-evidence="skills" aria-pressed="${skills}">Skill 工具管理</button></div></div><img src="./assets/winchat/${skills?'skills':'answer'}.webp" alt="${skills?'WinChat 技能管理：知識工具、系統工具與啟用控制':'WinChat RAG 知識問答與參考來源'}"/><a href="${winChatSource}" target="_blank" rel="noopener">資料來源：慧穩科技 WinChat 產品頁 ↗</a></div>`;
}
