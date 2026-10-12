// Company milestones transcribed and condensed from the user's 2026-10-09 reference.
// These dates describe company history, independently of the later product-learning story.
export const companyHistory = [
  {range:'2016—2020',title:'扎根與產品化',caption:'從影像辨識出發，將現場經驗沉澱成可規模化的 AI 服務。',milestones:[
    {year:'2016',title:'慧穩創立',icon:'seed',points:['專注深度學習與影像辨識技術','探索紡織、投資與汽車等應用']},
    {year:'2017',title:'多領域 AI<br>專案拓展',icon:'expand',points:['拓展智慧城市與智慧製造應用','承接零售、服飾等多領域專案']},
    {year:'2018',title:'獲得專利<br>確立 AI 發展方向',icon:'patent',points:['聚焦智慧製造','取得汽車安全輔助、多相機立體影像專利','服務拓展至高爾夫球、精品、鋼鐵與半導體產業']},
    {year:'2019',title:'AI SaaS<br>平台雛形',icon:'platform',points:['建構 AI SaaS 平台雛形','取得雲端大數據分析關鍵專利','拓展石化與水資源領域']},
    {year:'2020',title:'專案經驗產品化<br>建立 SaaS 商業模式',icon:'product',points:['整合專家經驗，打造 AI SaaS 解決方案','布局專案轉產品化','服務半導體、石化、紡織與高爾夫產業']}
  ]},
  {range:'2021—2025',title:'平台與國際化',caption:'以創新 AI 驅動落地應用，邁向全球智慧解決方案。',milestones:[
    {year:'2021',title:'跨域應用擴展<br>商業模式成熟',icon:'expand',points:['建立可規模化的 AI SaaS 商業模式','拓展水資源、生醫農業與零售應用']},
    {year:'2022',title:'<span class="heritage-platform">WinHub.AI</span> 啟動<br>進軍國際',icon:'platform',points:['整合 150+ AI 專案、30+ 產業場域經驗','推出融合式 AI 平台 WinHub.AI','整合 AI Agent、LLM/VLM、電腦視覺與數據分析','開拓中國與韓國市場','獲台灣金牛獎「新興企業獎」']},
    {year:'2023',title:'轉型平台化<br>獲多方資本挹注',icon:'growth',points:['商業模式獲投資人青睞','維田科技領投，國發基金與新創總會跟投','邁入高速成長期']},
    {year:'2024',title:'多模態 AI 平台<br>與策略合作',icon:'connect',points:['發表邊緣推論系統 WinEdge 與大語言模型平台 WinChat','建立多個代理商合作關係','強化從訓練到部署的端到端應用']},
    {year:'2025',title:'複製成功模式<br>拓展全球市場',icon:'global',points:['複製台灣成功經驗，拓展全球代理','將 AI 平台方案推向越南、日本等海外市場']}
  ]}
];

const icons={
  seed:'M12 21V11M12 15C4 15 3 10 3 5c6 0 9 3 9 8M12 11c0-6 3-8 9-8 0 6-3 10-9 10',
  expand:'M9 3H3v6m12-6h6v6M3 15v6h6m12-6v6h-6M8 12h8m-4-4v8',
  patent:'M6 3h12v12H6zM9 7h6M9 10h6M9 15v6l3-2 3 2v-6',
  platform:'M12 3 3 8l9 5 9-5-9-5zM3 12l9 5 9-5M3 16l9 5 9-5',
  product:'M3 7l9-4 9 4v10l-9 4-9-4V7zM3 7l9 5 9-5M12 12v9',
  growth:'M4 20V4M4 20h17M8 15l4-4 4 2 5-7M16 6h5v5',
  connect:'M9 9h6v6H9zM12 3v6m0 6v6M3 12h6m6 0h6M5 5l4 4m6 6 4 4M19 5l-4 4m-6 6-4 4',
  global:'M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0zM3 12h18M12 3c-5 5-5 13 0 18 5-5 5-13 0-18z'
};

export function companyHistoryHTML(page=0){
  const era=companyHistory[page];
  return `<div class="heritage-heading">
    <div><p class="heritage-kicker">OUR JOURNEY · 2016—2025</p><h1>公司<em>沿革</em></h1></div>
    <p class="heritage-intent">十年耕耘，<br>讓 AI 從現場走向世界。</p>
  </div>
  <nav class="heritage-phases" aria-label="公司沿革年份區間">${companyHistory.map((era,index)=>`<button type="button" data-company-history-page="${index}" aria-pressed="${index===page}" aria-controls="company-history-panel"><span>${era.range}</span><strong>${era.title}</strong></button>`).join('')}<span class="heritage-page-count" aria-label="第 ${page+1} 段，共 2 段">0${page+1}<i>/ 02</i></span></nav>
  <section id="company-history-panel" class="heritage-panel" aria-label="${era.range} ${era.title}">
    <svg class="heritage-walkway" aria-hidden="true" focusable="false">
      <defs><linearGradient id="heritage-jacket" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffc26c"/><stop offset="1" stop-color="#f08200"/></linearGradient></defs>
      <path class="heritage-progress"/>
      <g class="heritage-footprints"></g>
      <g class="heritage-traveler">
        <ellipse class="heritage-ground-light" cx="24" cy="65" rx="23" ry="3"/>
        <g class="heritage-person">
          <path class="heritage-limb heritage-back-arm"/>
          <path class="heritage-limb heritage-back-leg"/>
          <path class="heritage-limb heritage-front-leg"/>
          <path class="heritage-jacket"/>
          <path class="heritage-collar"/>
          <circle class="heritage-head"/>
          <path class="heritage-hair"/>
          <circle class="heritage-eye"/>
          <path class="heritage-smile"/>
          <path class="heritage-limb heritage-front-arm"/>
          <path class="heritage-shoe heritage-back-shoe"/>
          <path class="heritage-shoe heritage-front-shoe"/>
        </g>
        <g class="heritage-arrival-stars"><path d="M-1 32v6m-3-3h6M42 15v6m-3-3h6"/><circle cx="41" cy="43" r="1.3"/></g>
        <g class="heritage-joy" aria-hidden="true">${Array.from({length:7},(_,i)=>`<path class="heritage-joy-ray" data-ray="${i}"/>`).join('')}</g>
      </g>
    </svg>
    <ol class="heritage-milestones">${era.milestones.map((entry,index)=>`<li class="heritage-milestone" style="--milestone-order:${index}">
      <div class="heritage-year"><time datetime="${entry.year}">${entry.year}</time><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[entry.icon]}"/></svg></div>
      <span class="heritage-node" aria-hidden="true"></span>
      <h2>${entry.title}</h2>
      <ul>${entry.points.map(point=>`<li>${point}</li>`).join('')}</ul>
    </li>`).join('')}</ol>
    <div class="heritage-caption"><span aria-hidden="true">${era.range}</span><p>${era.caption}</p><small>慧穩科技 · AIWin</small></div>
  </section>`;
}
