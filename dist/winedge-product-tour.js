// User-supplied product captures. Viewports crop the originals without repainting UI.
const asset=name=>`./assets/winedge/${name}.png`;
export const productScreens=['workflow-editor','industrial-connectors','ai-model-nodes','execution-interval','execution-schedule','input-channels','live-preview','node-hot-update','dashboard-designer','plugin-catalog'];
export const productBeats={
 compose:[
  {id:'workflow',title:'把現場，連成一條 AI 流程。',strap:'輸入 → 推論 → 預覽與輸出',note:'實際 WinEdge 編輯器截圖：將 RTSP 輸入、物件偵測與 Live Preview 三個節點節選放大，保留原圖內容，依原流程順序排列。完整原圖另包含影像寫入分支。光流是演講標示；原圖為靜態擷取，非即時執行。'},
  {id:'libraries',title:'不同來源，同一張畫布。',strap:'工業串接 × 視覺與數據模型',note:'左右節選實際通訊與模型節點的標題，分欄放大。用一頁帶出相機、PLC、資料庫與影像／數據模型；原圖節點為功能集合，沒有將它們假接成已運作的流程。VLM 等能力依產品規劃口頭補充，不把未出現在截圖的節點冒充為介面內容。'},
  {id:'timing',title:'資料怎麼進，流程何時跑。',strap:'執行間隔 · 排程 · 多來源對齊',note:'三張真實設定面板節選同頁呈現：固定間隔、排程、輸入通道。說明 channel_size、tolerance_interval、max_wait、backpressure 各自對應佇列、容差、等待與背壓；不要把示範值解讀成效能保證。'}
 ],
 operate:[
  {id:'preview',title:'每一步，都看得見結果。',strap:'即時預覽 · 參數驗證 · 節點維運',note:'左側顯示同一影像經亮度、灰階、模糊、二值化等節點的預覽結果，右側放大實際 RTSP 節點的重建、暫停／恢復與預覽工具列。圖片保持靜止，只有框線與資料流動畫；不假裝這是產品錄影。'},
  {id:'dashboard',title:'你的產線，你的儀表板。',strap:'自由排版 · 圖層 · 樣式 · 發布',note:'展示實際儀表板設計器：左側工具、畫布選取框與右側樣式面板。原圖已有兩個示範圖表，未改動數值或模擬拖拉成功；以放大的畫布、樣式面板說明所見即所得。'}
 ],
 extend:[
  {id:'extensions',title:'現場的能力，持續長出來。',strap:'Plugin 擴充 × WinChat Agent',note:'左側使用實際節點目錄與 WinChat Agent 節點入口，右側為整合概念動畫。Plugin 原圖中央為連線中斷訊息，因此僅展示與本段有關的節點目錄，不將它描述成成功運行的流程。'}
 ]
};
const esc=value=>value.replaceAll('&','&amp;').replaceAll('"','&quot;').replaceAll('<','&lt;');
export function screen(name,box,label,overlay=''){
 const [x,y,width,height]=box,clip=`we-clip-${name}-${box.join('-')}`;
 return `<svg class="we-screen" viewBox="${box.join(' ')}" role="img" aria-label="${esc(label)}" preserveAspectRatio="xMidYMid meet"><defs><clipPath id="${clip}"><rect x="${x}" y="${y}" width="${width}" height="${height}"/></clipPath></defs><g clip-path="url(#${clip})"><image href="${asset(name)}" x="0" y="0" width="2555" height="1288"/>${overlay}</g></svg>`;
}
const frame=(label,body,cls='')=>`<div class="we-frame ${cls}"><div class="we-frame-bar"><span><i></i> WinEdge <b>/ ${label}</b></span><small>產品實際介面</small></div><div class="we-frame-content">${body}</div></div>`;

const rail=items=>`<div class="we-rail" aria-hidden="true">${items.map((s,i)=>`<span style="--i:${i}">${s}</span>${i<items.length-1?'<i><b></b></i>':''}`).join('')}</div>`;

function workflow(){return `<div class="we-workflow we-layout">${frame('工作流程編輯器 · 畫面節選',`<div class="we-flow-stations">${[
 ['01','接入影像','RTSP 串流',[796,630,310,382],'RTSP 輸入節點'],
 ['02','AI 判斷','物件偵測',[1185,489,379,459],'AIWin 物件偵測節點'],
 ['03','看見結果','即時預覽 · 影像輸出',[1720,198,494,553],'Live Preview 物件偵測結果']
 ].map((a,i)=>`<article class="we-flow-focus" style="--i:${i}"><div class="we-focus-heading"><span>${a[0]}</span><h2>${a[1]}</h2><p>${a[2]}</p></div>${screen('workflow-editor',a[3],a[4])}${i<2?'<i class="we-focus-link"><b></b></i>':''}</article>`).join('')}</div>`)}</div>`}
const shelf=(name,regions,label)=>`<div class="we-node-shelf"><span>${label}</span>${regions.map((box,i)=>screen(name,box,`${label}節點 ${i+1}`)).join('')}</div>`;
function libraries(){
 const inputs=[[810,210,345,65],[867,318,345,65],[928,425,345,65],[983,550,345,65],[1035,672,345,65],[1088,795,345,65]];
 const outputs=[[1518,215,345,65],[1565,338,345,65],[1606,450,345,65],[1651,571,345,65],[1712,695,345,65]];
 const models=[[1112,292,358,57],[1215,399,358,57],[1323,508,358,57],[1455,626,358,57],[1323,749,358,57]];
 return `<div class="we-libraries we-layout"><article class="we-library"><div class="we-library-title"><span>01 / CONNECT</span><h2>讓資料進得來。</h2><p>IP / RTSP · Web / USB · Basler<br>Modbus · MC Protocol · OPC UA · SQL</p></div>${frame('工業輸入與輸出 · 節點節選',`<div class="we-node-shelves">${shelf('industrial-connectors',inputs,'INPUT / 輸入')}${shelf('industrial-connectors',outputs,'OUTPUT / 輸出')}</div>`)}</article><article class="we-library"><div class="we-library-title"><span>02 / INFER</span><h2>讓 AI 接得上。</h2><p>視覺：VLM · 偵測 · 分類 · 分割<br>數據：分類 · 迴歸 · 時序</p></div>${frame('視覺與數據模型 · 節點節選',`<div class="we-model-shelf">${shelf('ai-model-nodes',models,'VISION × DATA')}</div>`)}</article></div>`}

function timing(){return `<div class="we-timing we-layout"><div class="we-timing-left"><article><div class="we-settings-label"><span>01</span><h2>掌握執行節奏</h2><p>固定間隔</p></div>${frame('執行策略',screen('execution-interval',[1790,232,740,145],'固定間隔執行設定'))}</article><article><div class="we-settings-label"><span>02</span><h2>讓工作準時發生</h2><p>排程規則</p></div>${frame('執行排程',screen('execution-schedule',[1790,370,740,145],'自訂排程規則設定'))}</article></div><article class="we-channel"><div class="we-settings-label"><span>03</span><h2>讓不同來源對得上</h2><p>佇列 · 時序 · 背壓</p></div>${frame('輸入通道與來源設定',screen('input-channels',[1790,790,740,460],'輸入佇列、時間容差、等待與背壓設定'))}</article></div>`}
function preview(){return `<div class="we-preview we-layout">${frame('處理流程與節點預覽',screen('live-preview',[545,185,1725,1065],'亮度、灰階、模糊、二值化、裁切等處理節點與各自預覽結果'))}<aside class="we-node-detail"><div class="we-library-title"><span>CONTROL EACH NODE</span><h2>調整一個節點，<br>看清每個變化。</h2><p>重建 · 暫停 / 恢復 · 預覽</p></div>${frame('單一節點',screen('node-hot-update',[1316,486,375,465],'RTSP 節點重建工具列與影像預覽'))}</aside></div>`}
function dashboard(){return `<div class="we-dashboard we-layout">${frame('儀表板設計器',screen('dashboard-designer',[0,150,1175,835],'儀表板工具列、圖層與畫布上的兩個趨勢元件'),'we-dashboard-canvas')}<aside class="we-inspector"><div class="we-library-title"><span>MAKE IT YOURS</span><h2>畫面，<br>由你定義。</h2><p>元件排版<br>品牌樣式<br>自訂 CSS</p></div>${frame('樣式',screen('dashboard-designer',[2258,155,285,825],'儀表板顏色、外框、圓角、間距與序列樣式面板'))}</aside></div>`}
function extensions(diagram){return `<div class="we-extensions we-layout"><div class="we-catalog-stage"><div class="we-library-title"><span>BUILT TO EXTEND</span><h2>把專業，做成節點。</h2><p>設備串接、客製邏輯與模型，<br>在同一個平台持續擴充。</p></div><div class="we-catalog-pair">${frame('節點目錄',screen('plugin-catalog',[72,180,275,675],'WinEdge 可載入節點目錄'))}<div class="we-agent-entry"><span>WINCHAT AGENT</span><h3>從現場資料，<br>走向知識與行動。</h3>${screen('node-hot-update',[75,739,350,63],'WinChat Agent 在 WinEdge 的節點入口')}</div></div></div><div class="we-extension-diagram">${diagram}<span class="we-concept-caption">整合概念動畫</span></div></div>`}

export function productTourHTML(chapter,index,beat,diagram){
 const d=productBeats[chapter.id][beat];
 const body={workflow,libraries,timing,preview,dashboard,extensions}[d.id](diagram);
 const rails={workflow:['接上現場','AI 推論','結果輸出'],libraries:['輸入／輸出','模型節點','自由組合'],timing:['資料到齊','節奏可控','流程開跑'],preview:['設計','預覽','驗證'],dashboard:['拖拉編排','調整樣式','發布看板'],extensions:['現場能力','Agent','巡檢與行動']};
 return `<section class="we-tour wl-slide" data-story="${chapter.id}" data-beat="${d.id}"><header><div><p class="wl-eyebrow">${String(index).padStart(2,'0')} / ${chapter.en}</p><h1>${d.title}</h1></div><p class="we-strap">${d.strap}</p></header>${body}<footer>${rail(rails[d.id])}<span>WINEDGE / PRODUCT EXPERIENCE</span></footer></section>`;
}
