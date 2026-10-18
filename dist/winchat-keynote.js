import {winChatFlow} from './winchat-flows.js?v=winchat-skills-3';
import {winChatBeat,winChatAction} from './winchat-script.js?v=winchat-skills-3';

const assets={
 knowledge:{alt:'WinChat 官方知識庫文件管理介面',label:'企業知識庫',ratio:'1280 / 635'},
 library:{alt:'WinChat 官方知識庫搜尋模式設定',label:'知識檢索設定',ratio:'1907 / 877'},
 answer:{alt:'WinChat 官方知識問答及參考來源',label:'知識問答',ratio:'1280 / 660'},
 dashboard:{alt:'WinChat 官方營運戰情室與 AI Copilot',label:'營運戰情室',ratio:'1915 / 848'},
 tools:{alt:'WinChat 官方技能管理與 NumOps 工具包',label:'技能與工具包',ratio:'1911 / 948'},
 workspace:{alt:'WinChat 官方對話工作區，可選擇 RAG 或 Agent 模式',label:'企業 AI 工作區',ratio:'1917 / 870'}
};
const head=()=>'<header class="wc-k-head"><div><p class="wc-k-eyebrow"></p><h1></h1></div><p class="wc-k-subtitle"></p></header>';
const foot=type=>`<footer class="wc-k-foot"><span>${type==='official'?`AIWin 官方產品介面 <i>展示截圖</i>`:'WINCHAT <i>應用概念演示</i>'}</span></footer>`;
const frame=(content,type='demo',className='')=>`<section class="wc-keynote ${className}">${head()}${content}${foot(type)}</section>`;

function perception({icon,drawing}){
 return frame(`<div class="wc-perception"><div class="wc-giant-document"><div class="wc-doc-meta">${icon('document')}<span>設備維修手冊</span><b>KNOWLEDGE / 01</b></div><div class="wc-doc-spread"><div class="wc-text-page"><span class="wc-page-no">01 — CONTEXT</span><h2>現場的經驗，<br>寫在每一頁。</h2><p>操作說明 / 保養紀錄 / 零件圖解</p><div class="wc-paragraphs"><i></i><i></i><i></i><i></i><i></i></div><div class="wc-doc-quote">文字，保留了做法。<br>圖像，保留了關係。</div></div><div class="wc-image-page"><span class="wc-page-no">02 — VISUAL</span><div class="wc-diagram">${drawing()}<i class="wc-manual-scan" data-reveal-at="1"></i><span class="wc-detect-label label-a" data-reveal-at="1">部件位置</span><span class="wc-detect-label label-b" data-reveal-at="1">圖文脈絡</span></div><div class="wc-image-question">這個部件，對應哪份說明？</div></div></div></div><div class="wc-perception-insight"><span class="wc-large-step">01</span><div class="wc-perception-message"><p>ENTERPRISE MEMORY</p><h2>看懂圖像，<br>知識才完整。</h2></div></div></div>`,'demo','wc-perception-frame');
}
function screen(asset){
 const a=assets[asset];
 return frame(`<div class="wc-product-cinema"><div class="wc-window-bar"><span class="wc-window-dots"><i></i><i></i><i></i></span><strong>WinChat <span>/ ${a.label}</span></strong><span>PRODUCT EXPERIENCE</span></div><div class="wc-camera-viewport"><div class="wc-camera-image" style="--source-ratio:${a.ratio}"><img src="./assets/winchat/${asset}.webp" alt="${a.alt}" loading="eager" decoding="sync"/><span class="wc-source-highlight" aria-hidden="true"></span></div><div class="wc-cinema-focus" aria-hidden="true"><span></span><strong></strong><i></i></div></div></div>`,'official','wc-screen-frame');
}
function hero(){
 return `<section class="wc-product-reveal"><div class="wc-reveal-light"></div><p>MEMORY. REASONING. ACTION.</p><h1>WinChat<span>讓企業知識，<br>成為工作的力量。</span></h1><div class="wc-reveal-formula"><span>Agent</span><b>←</b><span>RAG</span><b>·</b><span>SKILL</span></div><footer><span>企業知識 AI 協作平台</span></footer></section>`;
}
export function winChatKeynote(state,helpers){
 if(state.phase==='born'){
  if(!state.beat)return {key:'chat-product-hero',story:'',detail:hero(),layout:'hero',fullStage:true,note:'建議 30 秒。大腦與神經訊號凝聚成 WinChat 積木。先停留讓產品出現，再收束：Agent 結合 RAG 知識與 SKILL 工作方法及工具能力，組成企業工作的力量。',action:'走進 WinChat 工作區'};
  return {key:'chat-product-workspace',story:'',detail:screen('workspace'),layout:'full',fullStage:true,note:'建議 40 秒。以官方完整工作區收尾：從 RAG 到 Agent，接上企業知識、技能與系統。再回到整體積木與協作成形。',action:'前往協作成形'};
 }
 const beat=winChatBeat(state);
 const content=beat.scene==='screen'?screen(beat.asset):beat.scene==='perception'?perception(helpers):frame(winChatFlow(beat.scene),'demo','wc-flow-frame');
 return {key:`chat-${beat.scene}-${beat.asset||state.selected}`,story:'',detail:content,layout:'full',fullStage:true,note:`建議 ${beat.seconds} 秒。${beat.note}`,action:winChatAction(state)};
}
export function syncWinChatKeynote(container,state){
 const born=state.phase==='born';
 const beat=born?{title:'WinChat，企業的 AI 工作區。',subtitle:'Agent × RAG × SKILL / 企業 AI 協作',action:state.beat?'前往協作成形':'走進 WinChat 工作區',view:'workspace',asset:'workspace'}:winChatBeat(state);
 if(!beat)return;
 const stage=container.querySelector('.wc-keynote, .wc-product-reveal');if(!stage)return;
 stage.dataset.reveal=beat.reveal||0;stage.dataset.view=beat.view||'';stage.dataset.asset=beat.asset||'';
 const set=(selector,text)=>{const node=stage.querySelector(selector);if(node&&node.textContent!==text)node.textContent=text;};
 set('.wc-k-eyebrow',born?'WINCHAT / ENTERPRISE AI WORKSPACE':`${['AGENT CAPABILITY / RAG 知識','AGENT CAPABILITY / SKILL 工作能力','AGENT AT WORK / 應用與成果'][state.selected]}`);
 set('.wc-k-head h1',beat.title);set('.wc-k-subtitle',beat.subtitle);
 stage.querySelectorAll('[data-reveal-at]').forEach(el=>{const visible=Number(el.dataset.revealAt)<=(beat.reveal||0);el.classList.toggle('is-revealed',visible);el.setAttribute('aria-hidden',String(!visible));});
 const labels={citation:['SOURCE CITATIONS','引用，讓答案可以被查核。'],search:['KNOWLEDGE RETRIEVAL','語意、關鍵字、知識關係。'],copilot:['AI COPILOT','關注現場的變化。'],tools:['COMPOSABLE SKILLS','工具包與單項啟用控制。'],workspace:['RAG + AGENT','企業知識，連到工作流程。']};
 const label=labels[beat.view];set('.wc-cinema-focus>span',label?.[0]||'');set('.wc-cinema-focus>strong',label?.[1]||'');
}
