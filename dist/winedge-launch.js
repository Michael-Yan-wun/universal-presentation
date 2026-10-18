import {ecosystemHTML,ecosystemNote} from './winedge-ecosystem.js?v=ecosystem-1';
// Presenter-controlled product launch. Product claims come from the supplied launch brief.
export const launchFeatures = [
 {id:'connect',label:'工業串接',en:'CONNECT EVERYTHING',title:'讓現場，接上同一條線。',description:'從相機、設備到資料庫，影像與數據在 WinEdge 匯流。',points:['IP Camera / RTSP、Web Camera / USB、Basler 工業相機','Modbus · OPC UA · MC Protocol','SQL 資料庫與多種輸入輸出'],summary:'IP / Web / Basler 相機、設備、資料庫。',note:'先把現場帶進來。介紹影像、工業通訊與 SQL；各項為支援形式，實際配置依設備與專案需求。'},
 {id:'flow',label:'視覺化流程',en:'BUILD THE FLOW',title:'把想法，連成工作流程。',description:'用節點與連線組成作業藍圖，串起輸入、推論與輸出。',points:['在畫布上組合節點','把資料處理與 AI 接成完整流程','工程師不必從零撰寫整段腳本'],summary:'輸入 → 推論 → 輸出，畫出即可串起。',note:'以一條影像流程為例，節點依序入場，再接起資料流。這是功能概念動畫，不是實際編輯器錄影。'},
 {id:'inference',label:'雙路 AI 推論',en:'VISION MEETS DATA',title:'一邊看見，一邊理解。',description:'影像與數據推論並行，在同一平台完成現場判斷。',points:['視覺：VLM、物件偵測、分類、影像分割','數據：分類、迴歸、時序模型','內建模型節點，接入同一套工作流程'],summary:'VLM、偵測、分類 × 數據推論。',note:'上下兩路同步前進，表現視覺與數據模型可並行。視覺能力包含 VLM、物件偵測、分類與影像分割，不突出單一模型名稱，也不附加未提供的效能數字。'},
 {id:'rhythm',label:'通道與節奏',en:'CONTROL EVERY SIGNAL',title:'每筆資料，都有自己的節奏。',description:'從輸入佇列到執行排程，精準安排資料如何對齊、何時開跑。',points:['輸入佇列與背壓：保完整 / 保最新','多來源時序對齊','全速、固定間隔、日 / 週排程'],summary:'佇列、背壓、時序與排程，畫布上調整。',note:'保完整與保最新是兩種取捨。上方展示保留佇列，下方展示只取最新；再依時序對齊與排程送入節點。'},
 {id:'iterate',label:'即時驗證與維運',en:'ITERATE WITHOUT STARTING OVER',title:'邊設計，邊驗證。持續進化。',description:'調整參數，即時預覽與建置。<br>流程運作中，也能靈活維護。',points:['即時預覽與建置執行','執行中熱更新、重建設定','單一節點暫停 / 恢復'],summary:'即時預覽、熱更新、單節點暫停與恢復。',note:'合併原提案的即時預覽與熱更新。動畫中只有中間節點暫停並更新，其餘節點保持運作；不宣稱所有配置均零停機或沒有資料損失。'},
 {id:'dashboard',label:'自由設計看板',en:'DESIGN WHAT YOU NEED',title:'你的產線，你的儀表板。',description:'像設計軟體一樣編排現場資訊，設計完成，一鍵發布。',points:['拖拉元件、圖層分組、對齊與縮放','CSS 與素材客製化','所見即所得，設計完直接發布'],summary:'拖拉排版、CSS 客製，完成即可發布。',note:'看板元件從散開位置進入畫布，對齊、分組後完成發布。畫面以示意數據展示排版能力。'},
 {id:'plugins',label:'Plugin 擴充',en:'READY TO GROW',title:'能力，持續長出來。',description:'節點與看板元件皆可外掛擴充，讓平台跟著現場需求成長。',points:['流程節點與看板元件外掛','延伸既有產線邏輯與客製模型','加入第三方整合'],summary:'節點與看板元件，皆可外掛擴充。',note:'四個模組從外圍接入共用核心，說明可模組化擴充；不加入未提供的外掛市場或 SDK 規格。'},
 {id:'agent',label:'本地 AI Agent',en:'FROM MONITORING TO UNDERSTANDING',title:'讓監控，開始理解。',description:'透過 WinChat 的 RAG、Agent 與 SKILL，打造本地端的 Agent 監控系統。',points:['RAG 連結現場知識與操作脈絡','Agent 串接巡檢任務','SKILL 重用儀表板與資料統計巡檢方法'],summary:'WinChat RAG + Agent + SKILL，本地巡檢。',note:'知識、任務與方法匯入 Agent，再連接 WinEdge 看板與數據巡檢。避免延伸為未授權的自主產線控制。'}
];
// Product positioning supplied by AIWin: compose AI around the needs of each site.
export const launchPositioning = {
 headline:'最貼近現場的 AI 平台。',
 eyebrow:'AI, BUILT FOR THE FIELD.',
 domains:[{label:'製造業',icon:'factory'},{label:'機台',icon:'plc'},{label:'Agent',icon:'agent'},{label:'儀表板',icon:'dashboard'},{label:'Robot',icon:'robot'}]
};
// Three stories drive the talk; the eight capabilities remain independent in the bento.
export const launchChapters = [
 {id:'compose',en:'CONNECT. COMPOSE. INFER.',title:'接上現場，組合 AI。',description:'從資料進來，到 AI 做出判斷。<br>在同一張畫布，接成完整流程。',points:['相機、設備、資料庫，一站串接','影像與數據模型，雙路並行','資料怎麼對齊、何時執行，自由掌握'],features:['connect','flow','inference','rhythm'],note:'這一幕一次講完「串接 → 畫流程 → 雙路推論 → 控制節奏」。先指左側相機、設備與資料庫，再帶到中間視覺與數據模型，最後指向輸出及底部時序。以一個現場需求貫穿，不逐條念規格。'},
 {id:'operate',en:'DESIGN. VERIFY. EVOLVE.',title:'設計到維運，一氣呵成。',description:'把現場資訊，做成看得懂的看板。<br>邊設計、邊驗證，持續調整。',points:['拖拉排版，所見即所得','即時預覽與建置，一鍵發布看板','熱更新、單節點暫停與恢復'],features:['dashboard','iterate'],note:'把看板設計與即時驗證、維運合成一次完整操作故事：元件組裝 → 預覽結果 → 發布，再看下方單一節點如何暫停、更新與恢復。圖層分組、對齊縮放、CSS 與素材客製可口頭補充。'},
 {id:'extend',en:'EXTEND. UNDERSTAND. ACT.',title:'擴充能力，交給 Agent。',description:'用 Plugin 延伸現場能力，<br>讓 WinChat 接手知識與巡檢。',points:['客製模型、產線邏輯與元件持續擴充','RAG ＋ Agent ＋ SKILL，串起知識與任務','打造本地端的看板與數據巡檢'],features:['plugins','agent'],note:'外圍模組接入 WinEdge，代表現場能力能持續擴充；WinChat 的 RAG、Agent、SKILL 結合這些資訊，進行儀表板與資料統計巡檢。以「能力長出來，再交給 Agent 理解」收尾，接實際案例。'}
].map(chapter=>({...chapter,note:[chapter.note,...chapter.features.map(id=>{const f=launchFeatures.find(f=>f.id===id);return `${f.label}：${f.points.join('；')}。\n${f.note}`})].join('\n\n')}));
export const launchCaseStep = launchChapters.length + 1;
export const launchSummaryStep = launchCaseStep + 1;
export const launchLastStep = launchSummaryStep + 1;

// Local SVG artwork stays crisp on stage; each scene has its own motion grammar.
const paths={
 factory:'M3 21V10l6-4v5l6-4v6h6v8H3 M17 13V3h3v10 M6 16v2 M10 16v2 M14 16v2 M18 16v2',
 robot:'M4 21h16 M7 21v-4h8v4 M11 17l-4-5 5-7 6 4-4 6 M10 5a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M5 12a2 2 0 1 0 4 0 2 2 0 0 0-4 0 M18 9l3-1 1 3 M18 9l1 3 3-1',
 camera:'M4 7h4l2-3h4l2 3h4v13H4z M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 plc:'M5 4h14v16H5z M8 8h8 M8 12h3 M8 16h3 M15 12h1 M15 16h1 M2 8h3 M19 8h3',
 database:'M4 6c0-4 16-4 16 0s-16 4-16 0v12c0 4 16 4 16 0V6 M4 12c0 4 16 4 16 0',
 network:'M9 3h6v6H9z M3 16h6v5H3z M15 16h6v5h-6z M12 9v4H6v3 M12 13h6v3',
 chip:'M6 6h12v12H6z M9 9h6v6H9z M9 2v4 M15 2v4 M9 18v4 M15 18v4 M2 9h4 M2 15h4 M18 9h4 M18 15h4',
 input:'M4 4h16v16H4 M2 12h13 M11 8l4 4-4 4',
 sliders:'M5 3v18 M12 3v18 M19 3v18 M2 8h6 M9 15h6 M16 6h6',
 output:'M14 4H4v16h10 M10 12h12 M18 8l4 4-4 4',
 branch:'M5 3v12a4 4 0 0 0 4 4h10 M5 9h10a4 4 0 0 0 4-4V3 M16 16l3 3-3 3',
 chart:'M3 3v18h18 M6 15l4-5 4 3 6-8',
 clock:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0 M12 6v6l4 3',
 refresh:'M3 10a9 9 0 0 1 15-6l3 3 M21 2v5h-5 M21 14A9 9 0 0 1 6 20l-3-3 M3 22v-5h5',
 dashboard:'M3 3h18v18H3z M3 9h18 M10 9v12 M14 17v-4 M18 17v-6',
 plugin:'M9 3h6v5h4v6h-4v7H9v-7H5V8h4z',
 book:'M12 6C8 3 5 3 2 4v15c3-1 6-1 10 2 4-3 7-3 10-2V4c-3-1-6-1-10 2v15',
 agent:'M7 8h10a4 4 0 0 1 4 4v6H3v-6a4 4 0 0 1 4-4 M12 3v5 M8 12v2 M16 12v2 M8 21h8',
 skill:'M13 2 4 14h7l-1 8 10-13h-7z',
 check:'M4 12l5 5L20 6',
 layers:'m12 2 10 5-10 5L2 7z M2 12l10 5 10-5 M2 17l10 5 10-5'
};
const icon=(id,cls='')=>`<svg class="wl-icon ${cls}" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[id]||paths.chip}"/></svg>`;
const graph=()=>`<svg class="wl-chart" viewBox="0 0 500 160" aria-hidden="true"><path class="wl-chart-grid" d="M0 25H500M0 65H500M0 105H500M0 145H500M80 0V160M180 0V160M280 0V160M380 0V160M480 0V160"/><path class="wl-chart-fill" d="M0 130L30 113L60 120L90 68L120 85L150 62L180 78L210 30L240 55L270 44L300 73L330 37L360 50L390 20L420 32L450 12L500 27V160H0Z"/><path class="wl-chart-line" pathLength="1" d="M0 130L30 113L60 120L90 68L120 85L150 62L180 78L210 30L240 55L270 44L300 73L330 37L360 50L390 20L420 32L450 12L500 27"/></svg>`;
const node=(title,sub,ico,cls='',style='')=>`<div class="wl-node ${cls}" style="${style}"><span class="wl-node-icon">${icon(ico)}</span><strong>${title}</strong><small>${sub}</small><i class="wl-socket in"></i><i class="wl-socket out"></i></div>`;
const chip=(name='WinEdge',sub='VISION + DATA')=>`<div class="wl-chip"><div class="wl-chip-pins"></div><div class="wl-chip-face">${icon('chip')}<strong>${name}</strong><span>${sub}</span></div></div>`;
const beam='<span class="wl-beam" aria-hidden="true"><i></i></span>';
const routes=(d,cls='')=>`<svg class="wl-routes ${cls}" viewBox="0 0 1000 600" preserveAspectRatio="none" aria-hidden="true">${d.map((p,i)=>`<path class="wl-route-track" d="${p}"/><path class="wl-route-light" d="${p}" style="--i:${i}"/>`).join('')}</svg>`;

function dashboardDiagram(){
 return `<div class="wl-dashboard wl-art"><div class="wl-app-chrome"><b>WinEdge / Dashboard Designer</b><em class="wl-publish">發布完成 ✓</em></div><div class="wl-dashboard-body"><aside class="wl-tools">${[['layers','圖層'],['chart','圖表'],['dashboard','元件'],['sliders','樣式']].map(a=>`<div>${icon(a[0])}<span>${a[1]}</span></div>`).join('')}</aside><div class="wl-board"><div class="wl-board-heading"><strong>產線總覽</strong><span>示意資料</span></div><div class="wl-widget wl-widget-trend"><small>製程趨勢</small>${graph()}<div class="wl-graph-axis"><span>08:00</span><span>12:00</span><span>16:00</span></div></div><div class="wl-widget wl-widget-value"><small>現場溫度</small><strong>24.8<span>°C</span></strong><div class="wl-meter"><i></i></div></div><div class="wl-widget wl-widget-status"><small>設備狀態</small><strong><i></i>運作中</strong><div class="wl-mini-bars">${Array.from({length:12},(_,i)=>`<i style="--i:${i};--h:${25+(i*31)%70}%"></i>`).join('')}</div></div><div class="wl-board-bottom"><span>對齊 / 分組 / 縮放</span><b>CSS ＋ 自訂素材</b></div><i class="wl-design-guide"></i></div></div></div>`;
}
function diagram(id){
 if(id==='compose')return `<div class="wl-compose wl-art"><div class="wl-compose-heading"><span>${icon('branch')}<strong>視覺化工作流程</strong></span><small>INPUT → AI → OUTPUT</small></div><div class="wl-compose-flow">${routes(['M305 111H345Q370 111 370 106H420','M305 331H345Q370 331 370 343Q370 355 390 355H420','M305 521H345Q370 521 370 491V385Q370 355 390 355H420'])}<div class="wl-compose-inputs">${[['camera','相機 / 串流','IP Camera · RTSP<br>Web Camera / USB<br>Basler 工業相機'],['plc','設備 / PLC','Modbus · OPC UA<br>MC Protocol'],['database','資料庫','SQL · 資料輸入輸出']].map((a,i)=>`<div class="wl-input-card" style="--i:${i}">${icon(a[0])}<strong>${a[1]}</strong><small>${a[2]}</small><i></i></div>`).join('')}</div><div class="wl-compose-models"><article class="wl-model-lane vision"><div class="wl-model-visual"><img src="./assets/vision/caps.jpg" alt="瓶蓋視覺檢測畫面"/><i class="wl-scan"></i><i class="wl-detection-box"></i></div><div><small>VISION</small><h2>視覺推論</h2><p class="wl-vision-model-list"><span>VLM · 物件偵測</span><span>分類 · 影像分割</span></p></div></article><article class="wl-model-lane data"><div class="wl-model-visual">${graph()}</div><div><small>DATA</small><h2>數據推論</h2><p>分類 · 迴歸 · 時序</p></div></article><div class="wl-compose-output">${icon('output')}<strong>判斷結果</strong>${beam}<span>看板 / SQL / I/O</span></div></div></div><div class="wl-compose-timing">${icon('clock')}<div><strong>每筆資料，都在節奏裡。</strong><p>佇列與背壓 · 時序對齊 · 執行排程</p></div><div class="wl-signal-tracks" aria-hidden="true">${[0,1].map(j=>`<div>${[0,1,2,3,4,5].map(i=>`<i style="--i:${i};--track:${j}"></i>`).join('')}</div>`).join('')}<b></b></div></div></div>`;
 if(id==='operate')return `<div class="wl-operate wl-art">${dashboardDiagram()}<div class="wl-operation-cycle"><span>${icon('sliders')}設計與預覽</span><i></i><span>${icon('check')}建置與發布</span><i></i><span>${icon('refresh')}持續維運</span></div><div class="wl-runtime">${node('資料輸入','RUNNING','input','wl-running')}${beam}<div class="wl-update-node">${icon('refresh')}<strong>單一模型節點</strong><div class="wl-update-states"><span>執行中</span><span>暫停 · 熱更新</span><span>恢復執行 ✓</span></div><i class="wl-update-progress"></i></div>${beam}${node('資料輸出','RUNNING','output','wl-running')}</div></div>`;
 return `<div class="wl-extend wl-art"><div class="wl-extend-header"><span>PLUGIN ARCHITECTURE</span><strong>現場能力，持續長出來。</strong></div><div class="wl-extend-network">${routes(['M200 155H350Q500 155 500 300','M800 155H650Q500 155 500 300','M200 445H350Q500 445 500 300','M800 445H650Q500 445 500 300'])}${[['客製模型','MODEL','chip',0],['產線邏輯','LOGIC','branch',1],['看板元件','WIDGET','dashboard',2],['第三方整合','PLUGIN','plugin',3]].map(a=>node(a[0],a[1],a[2],`wl-extension wl-extension-${a[3]}`,`--i:${a[3]}`)).join('')}<div class="wl-extend-core"><div class="wl-orb" aria-hidden="true"><svg viewBox="0 0 300 300"><circle cx="150" cy="150" r="110"/><ellipse cx="150" cy="150" rx="60" ry="110"/><ellipse cx="150" cy="150" rx="110" ry="40"/><path d="M40 150H260M150 40V260M72 72L228 228M72 228L228 72"/>${[[150,40],[260,150],[150,260],[40,150],[72,72],[228,228],[72,228],[228,72]].map(a=>`<circle class="wl-orb-dot" cx="${a[0]}" cy="${a[1]}" r="4"/>`).join('')}</svg><i></i></div><div class="wl-extend-title"><strong>WinEdge</strong><span>× WinChat</span></div></div></div><div class="wl-agent-stack"><span><b>RAG</b> 知識</span><i>＋</i><span><b>Agent</b> 任務</span><i>＋</i><span><b>SKILL</b> 方法</span></div><div class="wl-agent-targets"><div>${icon('dashboard')}<span>儀表板巡檢</span><b>01</b></div><div>${icon('chart')}<span>資料統計巡檢</span><b>02</b></div></div></div>`;
}
function miniArt(id){
 const art={
  flow:`<div class="wl-mini-flow">${['input','chip','output'].map((item,i)=>`<span style="--i:${i}">${icon(item)}</span>${i<2?'<i></i>':''}`).join('')}</div>`,
  connect:`<div class="wl-mini-network">${icon('camera')}<i></i>${icon('plc')}<i></i>${icon('database')}</div>`,
  inference:`<div class="wl-mini-inference"><div class="wl-mini-vision"><i></i><b></b><span>VISION</span></div><div class="wl-mini-data">${graph()}<span>DATA</span></div><em>＋</em></div>`,
  rhythm:`<div class="wl-mini-bars">${Array.from({length:9},(_,i)=>`<i style="--i:${i};--h:${28+(i*23)%72}%"></i>`).join('')}</div>`,
  iterate:`<div class="wl-mini-live">${icon('refresh')}<span>LIVE</span><i></i></div>`,
  dashboard:`<div class="wl-mini-board"><div><i></i><i></i><i></i></div><section><span>${graph()}</span><b><i></i><i></i><i></i></b></section></div>`,
  plugins:`<div class="wl-mini-modules">${icon('chip')}${icon('dashboard')}${icon('plugin')}</div>`,
  agent:`<div class="wl-mini-agent"><div class="wl-mini-agent-orbit"><svg viewBox="0 0 180 180"><circle cx="90" cy="90" r="73"/><ellipse cx="90" cy="90" rx="35" ry="73"/><ellipse cx="90" cy="90" rx="73" ry="28"/><path d="M17 90H163M90 17V163"/><circle cx="90" cy="17" r="3"/><circle cx="163" cy="90" r="3"/></svg><i></i></div><div class="wl-mini-agent-skills"><span>RAG</span><span>Agent</span><span>SKILL</span></div></div>`
 };
 return `<div class="wl-tile-art" aria-hidden="true">${art[id]}</div>`;
}
function summaryHTML(){return `<section class="wl-summary wl-slide"><header><h1>貼近每個現場，<span>組合各種 AI。</span></h1><p class="wl-eyebrow">${launchPositioning.eyebrow}</p></header><div class="wl-bento">${launchFeatures.map((f,i)=>`<article class="wl-tile wl-tile-${f.id}" style="--i:${i}">${miniArt(f.id)}<div class="wl-tile-copy"><h2>${f.label}</h2><p>${f.summary}</p></div></article>`).join('')}<div class="wl-bento-core"><div class="wl-core-heading"><span>THE ALL-NEW</span><h2>WinEdge</h2></div><div class="wl-core-product" aria-hidden="true"><div class="wl-core-halo"></div><span class="wl-core-orbit orbit-one"></span><span class="wl-core-orbit orbit-two"></span></div><div class="wl-core-footer"><p>${launchPositioning.headline}</p><small>${launchPositioning.domains.map(d=>d.label).join(' · ')}</small></div><span class="wl-core-mark" aria-hidden="true">W</span></div></div></section>`}
function featureHTML(f,index){return `<section class="wl-feature wl-slide" data-feature="${f.id}"><div class="wl-feature-copy"><p class="wl-eyebrow"><span>${String(index).padStart(2,'0')}</span> ${f.en}</p><h1>${f.title.replace('，','，<br>').replace('。持續','。<br>持續')}</h1><p class="wl-description">${f.description}</p><ul>${f.points.map(p=>`<li>${p}</li>`).join('')}</ul></div><div class="wl-feature-stage">${diagram(f.id)}<span class="wl-diagram-note">功能概念動畫</span></div></section>`}
function heroHTML(){return `<section class="wl-hero wl-slide"><div class="wl-hero-copy"><p class="wl-eyebrow">${launchPositioning.eyebrow}</p><h1>WinEdge<span>${launchPositioning.headline.replace(' AI ','<br>AI ')}</span></h1><p>將影像、數據與各種 AI 能力，<br>組合成現場真正需要的應用。</p><div class="wl-hero-origin"><span>WinEdge-N</span><i>＋</i><span>WinEdge-V</span><b>→</b><strong>WinEdge</strong></div></div><div class="wl-hero-orbit" aria-hidden="true"></div><div class="wl-field-applications"><p>依現場需求，自由組合。</p><ul aria-label="WinEdge 現場 AI 應用">${launchPositioning.domains.map((d,i)=>`<li style="--i:${i}">${icon(d.icon)}<span>${d.label}</span></li>`).join('')}</ul></div><span class="wl-hero-caption">ONE PLATFORM. EVERY FIELD.</span></section>`}
function casesHTML(){return `<section class="wl-cases wl-slide"><header><div><p class="wl-eyebrow">BUILT FROM REAL EXPERIENCE</p><h1>從真實現場，走向整合。</h1></div><p>影像、數據與知識。<br>每一份實戰，都是新平台的起點。</p></header><div class="wl-case-grid"><article class="wl-case-main"><div class="wl-case-film"><video muted loop playsinline preload="metadata" poster="./assets/vision/caps.jpg" aria-label="瓶蓋瑕疵檢測應用展示影片"><source src="./assets/vision/caps.mp4" type="video/mp4"></video><button class="wl-video-play" hidden aria-label="播放瓶蓋檢測影片">播放案例影片 ▷</button><span class="wl-case-badge">VISION / 應用展示</span></div><div class="wl-case-copy"><span>01 / 食品飲料</span><h2>瓶蓋瑕疵檢測</h2><p>從產線影像辨識瓶蓋品質，<br>將瑕疵判讀整理成可追蹤的檢測結果。</p></div></article><article class="wl-case-side oven"><div class="wl-case-image"><img src="./assets/pitch-oven-temperature.png" alt="Pitch 中智慧烤箱溫控的多點溫度曲線"/></div><div class="wl-case-copy"><span>02 / DATA</span><h2>智慧烤箱溫控</h2><p>27 個風門 × 15 個溫度點<br>NumOps ＋ WinEdge-N</p></div></article><article class="wl-case-side knowledge"><div class="wl-case-image"><img src="./assets/pitch-winchat.png" alt="WinChat 企業知識問答的產品畫面"/></div><div class="wl-case-copy"><span>03 / KNOWLEDGE</span><h2>企業知識問答</h2><p>文件知識 × 來源引用<br>WinChat RAG</p></div></article></div><p class="wl-case-provenance">既有產品與專案展示｜AIWin Pitch v5 · p.46 / p.34 / p.20、38</p></section>`}

export function createWinEdgeLaunch({container,productStage,onChange=()=>{}}){
 let current=0,active=false,busy=false,generation=0,animations=[];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const mode=()=>current===0?'hero':current===launchCaseStep?'cases':current===launchSummaryStep?'summary':current===launchLastStep?'ecosystem':'feature';
 function fitProduct(){
  if(!productStage)return;
  const slot=active&&mode()==='summary'?container.querySelector('.wl-core-product'):null;
  if(!slot){['left','right','top','bottom','width','height'].forEach(p=>productStage.style.removeProperty(p));return}
  // Offset geometry ignores entrance transforms, keeping the WebGL layer in its reserved slot.
  let element=slot,x=0,y=0;const parent=productStage.offsetParent;
  while(element&&element!==parent){x+=element.offsetLeft;y+=element.offsetTop;element=element.offsetParent}
  if(element===parent)Object.assign(productStage.style,{left:x+'px',top:y+'px',width:slot.offsetWidth+'px',height:slot.offsetHeight+'px',right:'auto',bottom:'auto'});
 }
 const layoutObserver=new ResizeObserver(fitProduct);layoutObserver.observe(container);
 function notify(){onChange({step:current,last:launchLastStep,mode:mode(),busy,feature:current===launchLastStep?{note:ecosystemNote}:launchChapters[current-1]});fitProduct()}
 function cancel(){generation++;animations.forEach(a=>a.cancel());animations=[];busy=false}
 function stopMedia(){container.querySelectorAll('.wl-root video').forEach(v=>{v.pause();v.removeAttribute('src');v.querySelectorAll('source').forEach(s=>s.removeAttribute('src'));v.load()})}
 function playMedia(){const v=container.querySelector('.wl-root video'),button=container.querySelector('.wl-video-play');if(!v)return;v.play().then(()=>{if(button?.isConnected)button.hidden=true}).catch(()=>{if(button?.isConnected)button.hidden=false})}
 function render(){
  container.innerHTML=`<div class="wl-root" data-mode="${mode()}"><div class="wl-content" aria-live="polite" aria-atomic="true">${current===0?heroHTML():current===launchCaseStep?casesHTML():current===launchSummaryStep?summaryHTML():current===launchLastStep?ecosystemHTML():featureHTML(launchChapters[current-1],current)}</div><div class="wl-transit" aria-hidden="true"></div></div>`;
  if(current===launchCaseStep&&!reduced)playMedia();
  else if(current===launchCaseStep)container.querySelector('.wl-video-play').hidden=false;
 }
 async function show(next){
  if(!active||busy||next<0||next>launchLastStep||!Number.isInteger(next))return false;
  cancel();const ticket=generation;busy=true;notify();
  const outgoing=container.querySelector('.wl-content');
  if(!reduced&&outgoing){const a=outgoing.animate([{opacity:1,transform:'translateY(0) scale(1)'},{opacity:0,transform:'translateY(-16px) scale(.97)'}],{duration:260,easing:'ease-in',fill:'forwards'});animations.push(a);await a.finished.catch(()=>{});if(ticket!==generation||!active)return false}
  stopMedia();current=next;render();notify();
  if(!reduced){const content=container.querySelector('.wl-content'),sweep=container.querySelector('.wl-transit');const a=content.animate([{opacity:0,transform:'translateY(28px) scale(.96)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:1000,easing:'cubic-bezier(.16,1,.3,1)'});const b=sweep.animate([{opacity:0,transform:'translateX(-110%) skewX(-18deg)'},{opacity:.7,offset:.35},{opacity:0,transform:'translateX(110%) skewX(-18deg)'}],{duration:1100,easing:'ease-in-out'});animations.push(a,b);await Promise.all([a.finished.catch(()=>{}),b.finished.catch(()=>{})]);if(ticket!==generation||!active)return false}
  animations=[];busy=false;notify();return true;
 }
 container.addEventListener('click',e=>{if(active&&e.target.closest('.wl-video-play'))playMedia()});
 return {start(){cancel();stopMedia();active=true;current=0;render();notify()},stop(){active=false;cancel();stopMedia();fitProduct();container.querySelectorAll('.wl-root').forEach(e=>e.remove())},next(){if(!active)return false;if(busy)return true;if(current===launchLastStep)return false;show(current+1);return true},previous(){if(!active||current===0&&!busy)return false;if(!busy)show(current-1);return true},state:()=>({current,active,busy})};
}
