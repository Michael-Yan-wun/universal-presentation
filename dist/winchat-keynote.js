import {winChatBeat,winChatAction} from './winchat-script.js?v=winchat-stage-1';

const official='https://www.aiwin.com.tw/products/winchat';
const assets={
 knowledge:{alt:'WinChat 官方知識庫文件管理介面',label:'企業知識庫',ratio:'1280 / 635'},
 library:{alt:'WinChat 官方知識庫搜尋模式設定',label:'知識檢索設定',ratio:'1907 / 877'},
 answer:{alt:'WinChat 官方知識問答及參考來源',label:'知識問答',ratio:'1280 / 660'},
 dashboard:{alt:'WinChat 官方營運戰情室與 AI Copilot',label:'營運戰情室',ratio:'1915 / 848'},
 tools:{alt:'WinChat 官方技能管理與 NumOps 工具包',label:'技能與工具包',ratio:'1911 / 948'},
 workspace:{alt:'WinChat 官方對話工作區，可選擇 RAG 或 Agent 模式',label:'企業 AI 工作區',ratio:'1917 / 870'}
};
const button=()=>'<button class="wc-k-action" data-winchat-next><span></span><b aria-hidden="true">↗</b></button>';
const head=()=>'<header class="wc-k-head"><div><p class="wc-k-eyebrow"></p><h1></h1></div><p class="wc-k-subtitle"></p></header>';
const foot=type=>`<footer class="wc-k-foot"><span>${type==='official'?`<a href="${official}" target="_blank" rel="noopener">AIWin 官方產品介面 ↗</a> <i>展示截圖</i>`:'WINCHAT <i>應用概念演示</i>'}</span>${button()}</footer>`;
const frame=(content,type='demo',className='')=>`<section class="wc-keynote ${className}">${head()}${content}${foot(type)}</section>`;

function perception({icon,drawing}){
 return frame(`<div class="wc-perception"><div class="wc-giant-document"><div class="wc-doc-meta">${icon('document')}<span>設備維修手冊</span><b>KNOWLEDGE / 01</b></div><div class="wc-doc-spread"><div class="wc-text-page"><span class="wc-page-no">01 — CONTEXT</span><h2>現場的經驗，<br>寫在每一頁。</h2><p>操作說明 / 保養紀錄 / 零件圖解</p><div class="wc-paragraphs"><i></i><i></i><i></i><i></i><i></i></div><div class="wc-doc-quote">文字，保留了做法。<br>圖像，保留了關係。</div></div><div class="wc-image-page"><span class="wc-page-no">02 — VISUAL</span><div class="wc-diagram">${drawing()}<i class="wc-manual-scan" data-reveal-at="1"></i><span class="wc-detect-label label-a" data-reveal-at="1">部件位置</span><span class="wc-detect-label label-b" data-reveal-at="1">圖文脈絡</span></div><div class="wc-image-question">這個部件，對應哪份說明？</div></div></div></div><div class="wc-perception-insight"><span class="wc-large-step">01</span><div class="wc-perception-message"><p>ENTERPRISE MEMORY</p><h2>看懂圖像，<br>知識才完整。</h2></div><div class="wc-interpretation" data-reveal-at="1"><div>${icon('image')}<strong>VLM</strong><span>圖像與圖表</span></div><div data-reveal-at="2">${icon('document')}<strong>LLM</strong><span>文字與脈絡</span></div></div><div class="wc-index-result" data-reveal-at="2"><div class="wc-index-beads">${Array.from({length:22},(_,i)=>`<i style="--i:${i};--bar:${25+i*29%75}%"></i>`).join('')}</div><b>Embedding</b><p>建立知識索引，連回引用來源。</p><span>${icon('database')}企業知識庫</span></div></div></div>`,'demo','wc-perception-frame');
}
function screen(asset){
 const a=assets[asset];
 return frame(`<div class="wc-product-cinema"><div class="wc-window-bar"><span class="wc-window-dots"><i></i><i></i><i></i></span><strong>WinChat <span>/ ${a.label}</span></strong><span>PRODUCT EXPERIENCE</span></div><div class="wc-camera-viewport"><div class="wc-camera-image" style="--source-ratio:${a.ratio}"><img src="./assets/winchat/${asset}.webp" alt="${a.alt}" loading="eager" decoding="sync"/><span class="wc-source-highlight" aria-hidden="true"></span></div><div class="wc-cinema-focus" aria-hidden="true"><span></span><strong></strong><i></i></div></div></div>`,'official','wc-screen-frame');
}
function mission({icon}){
 return frame(`<div class="wc-mission"><div class="wc-mission-goal"><span>工作目標</span><h2>今天的現場，<br>哪些地方需要留意？</h2><div class="wc-goal-orb">${icon('brain')}<i></i><i></i><i></i></div></div><div class="wc-mission-route" data-reveal-at="1">${[['search','查知識','SOP / 歷史紀錄'],['database','連資料','資料庫 / 企業系統'],['brain','做分析','關係 / 脈絡 / 判讀']].map((a,i)=>`<article style="--i:${i}"><span>0${i+1}</span>${icon(a[0])}<h3>${a[1]}</h3><p>${a[2]}</p><div class="wc-route-dots"></div></article>`).join('')}</div><div class="wc-mission-delivery" data-reveal-at="2"><div class="wc-delivery-stamp">${icon('check')}<span>WORK SUMMARY</span></div><div><h3>把資料與知識，整理在一起。</h3><p>運轉紀錄 · 關注項目 · 相關規範 · 後續判讀</p></div><svg class="wc-delivery-chart" viewBox="0 0 360 100" aria-hidden="true"><path d="M0 85L30 72 60 78 90 48 120 59 150 35 180 49 210 21 240 33 270 15 300 24 330 7 360 17"/></svg></div></div>`,'demo','wc-mission-frame');
}
function modules({icon}){
 return frame(`<div class="wc-module-world"><div class="wc-module-orbits"><i></i><i></i></div><svg class="wc-module-wires" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><path d="M150 110Q230 350 500 350 M500 65V350 M850 110Q770 350 500 350"/></svg>${[['database','KNOWLEDGE','知識檢索'],['chart','ANALYSIS','資料分析'],['document','WORKFLOW','工作彙整']].map((a,i)=>`<article class="wc-skill-block block-${i}"><div class="wc-block-studs"><i></i><i></i><i></i></div><span>0${i+1}</span>${icon(a[0])}<h2>${a[2]}</h2><p>${a[1]}</p></article>`).join('')}<div class="wc-agent-dock"><span class="wc-dock-symbol">W</span><div><span>WINCHAT</span><h2>Agent</h2></div><div class="wc-dock-ports"><i></i><i></i></div></div><div class="wc-module-result" data-reveal-at="1"><span>KNOWLEDGE</span><b>＋</b><span>SYSTEMS</span><b>＋</b><span>EXPERTISE</span><p>依任務調用，依企業需求組合。</p></div></div>`,'demo','wc-modules-frame');
}
function applications({icon}){
 const data=[['chat','CUSTOMER SERVICE','客服與維修','這個部件，<br>該怎麼查？','圖像 × 文件 × 問答','找回圖解與相關知識','圖文回答，附上參考來源。'],['people','ONBOARDING','新人與培訓','第一次做，<br>該從哪開始？','SOP × 經驗 × 導讀','把流程與經驗傳下去','依問題找到規範與操作說明。'],['chart','FIELD OPERATIONS','現場與巡檢','今天的現場，<br>有什麼要注意？','數據 × 知識 × 工具','把狀況整理成巡檢摘要','結合資料與紀錄，協助判讀。']];
 return frame(`<div class="wc-application-stage">${data.map((a,i)=>`<article style="--i:${i}"><div class="wc-app-top"><span>0${i+1}</span>${icon(a[0])}</div><p class="wc-app-english">${a[1]}</p><h2>${a[2]}</h2><p class="wc-app-question">${a[3]}</p><div class="wc-app-recipe">${a[4]}</div><div class="wc-app-outcome" data-reveal-at="1">${icon('check')}<h3>${a[5]}</h3><p>${a[6]}</p></div></article>`).join('')}</div>`,'demo','wc-application-frame');
}
function hero(){
 return `<section class="wc-product-reveal"><div class="wc-reveal-light"></div><p>MEMORY. REASONING. ACTION.</p><h1>WinChat<span>讓企業知識，<br>成為工作的力量。</span></h1><div class="wc-reveal-formula"><span>RAG</span><b>＋</b><span>Agent</span><b>＋</b><span>Skill</span></div><footer><span>企業知識 AI 協作平台</span>${button()}</footer></section>`;
}
export function winChatKeynote(state,helpers){
 if(state.phase==='born'){
  if(!state.beat)return {key:'chat-product-hero',story:'',detail:hero(),layout:'hero',fullStage:true,note:'建議 30 秒。三塊能力融合成 WinChat。先停留讓產品出現，再收束：記憶、思考與技能，組成企業工作的力量。',action:'走進 WinChat 工作區'};
  return {key:'chat-product-workspace',story:'',detail:screen('workspace'),layout:'full',fullStage:true,note:'建議 40 秒。以官方完整工作區收尾：從 RAG 到 Agent，接上企業知識、技能與系統。再回到整體積木與協作成形。',action:'前往協作成形'};
 }
 const beat=winChatBeat(state);
 const builders={perception,mission,modules,applications};
 return {key:`chat-${beat.scene}-${beat.asset||state.selected}`,story:'',detail:beat.scene==='screen'?screen(beat.asset):builders[beat.scene](helpers),layout:'full',fullStage:true,note:`建議 ${beat.seconds} 秒。${beat.note}`,action:winChatAction(state)};
}
export function syncWinChatKeynote(container,state){
 const born=state.phase==='born';
 const beat=born?{title:'WinChat，企業的 AI 工作區。',subtitle:'RAG × Agent × Skill / 本地與私有環境部署',action:state.beat?'前往協作成形':'走進 WinChat 工作區',view:'workspace',asset:'workspace'}:winChatBeat(state);
 if(!beat)return;
 const stage=container.querySelector('.wc-keynote, .wc-product-reveal');if(!stage)return;
 stage.dataset.reveal=beat.reveal||0;stage.dataset.view=beat.view||'';stage.dataset.asset=beat.asset||'';
 const set=(selector,text)=>{const node=stage.querySelector(selector);if(node&&node.textContent!==text)node.textContent=text;};
 set('.wc-k-eyebrow',born?'WINCHAT / ENTERPRISE AI WORKSPACE':`${['RAG / 企業的記憶','AGENT / 思考與協作','SKILL / 可組合的技能'][state.selected]}`);
 set('.wc-k-head h1',beat.title);set('.wc-k-subtitle',beat.subtitle);set('.wc-k-action>span',born?beat.action:winChatAction(state));
 stage.querySelectorAll('[data-reveal-at]').forEach(el=>{const visible=Number(el.dataset.revealAt)<=(beat.reveal||0);el.classList.toggle('is-revealed',visible);el.setAttribute('aria-hidden',String(!visible));});
 const labels={citation:['SOURCE CITATIONS','引用，讓答案可以被查核。'],search:['KNOWLEDGE RETRIEVAL','語意、關鍵字、知識關係。'],copilot:['AI COPILOT','關注現場的變化。'],tools:['COMPOSABLE SKILLS','工具包與單項啟用控制。'],workspace:['RAG + AGENT','企業知識，連到工作流程。']};
 const label=labels[beat.view];set('.wc-cinema-focus>span',label?.[0]||'');set('.wc-cinema-focus>strong',label?.[1]||'');
 stage.querySelectorAll('[data-winchat-next]').forEach(button=>button.disabled=['selecting','fusing'].includes(state.phase));
}
