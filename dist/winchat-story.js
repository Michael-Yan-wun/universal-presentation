import {winChatBrain} from './winchat-brain.js?v=winchat-launch-1';
import {winChatKeynote} from './winchat-keynote.js?v=winchat-launch-1';
// Keynote visuals: official WinChat capabilities + the user's multimodal RAG brief.
// All question/answer and workflow examples below are illustrative, not a live product session.
export const winChatSource='https://www.aiwin.com.tw/products/winchat';
const symbols={document:'M7 3h7l4 4v14H7z M14 3v5h5 M10 12h5 M10 16h5',image:'M3 4h18v16H3z M3 16l6-6 4 4 3-3 5 6 M15 8h.01',brain:'M12 5c-3-5-7-1-6 2-5 0-5 8-1 9-1 5 6 6 7 2V5z M12 5c3-5 7-1 6 2 5 0 5 8 1 9 1 5-6 6-7 2 M7 10c3-1 4 2 2 4 M17 10c-3-1-4 2-2 4',search:'M15 15l6 6 M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0',database:'M4 6c0-5 16-5 16 0s-16 5-16 0v12c0 5 16 5 16 0V6 M4 12c0 5 16 5 16 0',skill:'M9 3h6v5h6v7h-6v6H9v-6H3V8h6z',check:'M4 12l5 5L20 6',shield:'M12 2l8 4v6c0 5-8 10-8 10S4 17 4 12V6z M8 12l3 3 5-6',chat:'M3 4h18v13H9l-6 4z M7 9h10 M7 13h6',chart:'M3 3v18h18 M6 15l4-6 4 3 6-8',arrow:'M4 12h16 M14 6l6 6-6 6',globe:'M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20 M2 12h20 M12 2c-6 5-6 15 0 20 6-5 6-15 0-20',people:'M9 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M2 22v-4c0-7 14-7 14 0v4 M17 3a4 4 0 0 1 0 8 M18 14c4 0 4 4 4 8'};
const icon=id=>`<svg class="wc-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${symbols[id]||symbols.brain}"/></svg>`;
const kicker=text=>`<p class="wc-kicker"><i></i>${text}</p>`;
const tag=(name,sub)=>`<div class="wc-topic-mark"><b>${name}</b><span>${sub}</span></div>`;
const topics=[
 {tag:'RAG',label:'知識與依據'},
 {tag:'SKILL',label:'方法與工具'},
 {tag:'WORK',label:'應用與成果'}
];
export const winChatTopics=topics;
const applications=()=>`<div class="wc-applications">${[['chat','客服與維修','找知識 · 查圖解'],['people','新人與培訓','學流程 · 問規範'],['chart','現場與巡檢','看狀態 · 做摘要']].map(a=>`<div>${icon(a[0])}<strong>${a[1]}</strong><small>${a[2]}</small></div>`).join('')}</div>`;
function drawing(){return `<svg class="wc-drawing" viewBox="0 0 300 190" aria-hidden="true"><g stroke="#8196bc" stroke-width="1.5" fill="none"><path d="M55 122L130 153 243 91 167 57z M55 122V68l76 31v54 M55 68l112-62 76 30v55 M131 99l112-63 M80 79v56 M109 92v54 M159 84v54 M186 69v54 M214 53v54"/><path d="M87 38l73 30 52-29-73-29z M87 38V59l73 30V68 M160 89l52-29V39"/><circle cx="202" cy="90" r="9"/><path d="M211 90h53v47"/></g><rect class="wc-image-target" x="180" y="68" width="44" height="44" rx="6"/><circle cx="202" cy="90" r="3" fill="#b998f6"/></svg>`;}
function overview(){
 return {key:'brain-overview',layout:'brain',action:'展開 WinChat 多模態 RAG',story:`${kicker('WINCHAT / THE THINKING CHAPTER')}<h1 class="wc-heading">從理解問題，<br>到完成<em>一份工作。</em></h1><p class="wc-intro-copy">Agent 根據任務，<br>結合 RAG 知識與 SKILL 工作能力。</p><p class="wc-agent-caption">AI AGENT / 企業的工作大腦</p><div class="wc-topic-list">${topics.map((t,i)=>`<div><span>0${i+1}</span><b>${t.tag}</b><strong>${t.label}</strong></div>`).join('')}</div><p class="wc-worlds">客服維修 / 新人培訓 / 現場巡檢</p>`,detail:`<div class="wc-overview-visual"><div class="wc-brain-heading"><span>KNOWLEDGE. CAPABILITY. OUTCOME.</span><strong>Agent 統籌，讓能力一起工作</strong></div>${winChatBrain()}</div>`,note:'以企業大腦接續生命體的成長。用下一步進入記憶區域，依序介紹 RAG 知識、SKILL 工作能力與應用成果；最後才將智慧凝聚成 WinChat 積木。'};
}

export function winChatUI(state){
 if(state.phase==='overview')return overview();
 if(['selecting','focus','born'].includes(state.phase))return winChatKeynote(state,{icon,drawing});
 if(state.phase==='fusing')return {key:'fusing',layout:'fusion',story:'',detail:`<div class="wc-fusion"><p class="wc-kicker">INTELLIGENCE TAKES SHAPE</p><h1>讓知識，<br><em>開始行動。</em></h1><div class="wc-mind-condense">${winChatBrain({mode:'fusion'})}</div><div class="wc-fusion-halo"><i></i><i></i><i></i><i></i></div><div class="wc-fusion-words"><span>Agent</span><b>←</b><span>RAG</span><b>·</b><span>SKILL</span></div></div>`,note:'大腦與神經訊號聚光收攏，再揭曉 WinChat 積木。此時才將記憶、思考與技能回歸整體積木故事。'};
}

export function winChatEvidence(view='answer'){
 const skills=view==='skills';
 return `<div class="wc-proof"><div class="wc-proof-top"><span>WINCHAT / OFFICIAL PRODUCT VIEW</span><h2 id="case-heading">${skills?'技能與工具包管理':'知識問答，附上引用來源。'}</h2><p>AIWin 官方產品介面</p><div><button data-winchat-evidence="answer" aria-pressed="${!skills}">RAG 知識問答</button><button data-winchat-evidence="skills" aria-pressed="${skills}">SKILL 工具管理</button></div></div><img src="./assets/winchat/${skills?'skills':'answer'}.webp" alt="${skills?'WinChat 技能管理：知識工具、系統工具與啟用控制':'WinChat RAG 知識問答與參考來源'}"/><a href="${winChatSource}" target="_blank" rel="noopener">資料來源：慧穩科技 WinChat 產品頁 ↗</a></div>`;
}
