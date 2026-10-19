// Five-year summaries for the single anniversary overview slide.
export const companyHistory = [
  {
    range: '2016–2020',
    title: '技術深耕・產品化奠基',
    achievements: [
      {title: '核心技術研發', description: '深度學習、影像辨識與 AI 技術專利'},
      {title: '跨域應用拓展', description: '智慧製造、智慧城市等產業應用'},
      {title: 'SaaS 商業模式', description: '專案經驗產品化，建立 AI SaaS 基礎'}
    ]
  },
  {
    range: '2021–2025',
    title: '平台深化・全球市場拓展',
    achievements: [
      {title: 'WinHub.AI 平台啟動', platform: true, description: '整合 AI 技術與應用，推動平台化發展'},
      {title: '多模態 AI 應用', description: '發展 WinEdge、WinChat 等 AI 解決方案'},
      {title: '全球市場布局', description: '建立合作夥伴網絡，拓展國際市場'}
    ]
  }
];

function stageHTML(stage, index){
  return `<section class="heritage-stage" aria-labelledby="heritage-stage-${index}">
    <div class="heritage-stage-heading" data-heritage-reveal>
      <p class="heritage-range">${stage.range}</p>
      <h2 id="heritage-stage-${index}">${stage.title}</h2>
    </div>
    <ol class="heritage-achievements">${stage.achievements.map((entry, i)=>`<li data-heritage-reveal>
      <span class="heritage-number" aria-hidden="true">0${i+1}</span>
      <div><h3>${entry.platform?'<span class="heritage-platform-heading"><span class="heritage-platform-logo"><img src="./assets/company-products/winhub-cutout-v1.png" alt="WinHub.AI 產品 Logo" width="1491" height="1055"></span><span><span class="heritage-platform">WinHub.AI</span> 平台啟動</span></span>':entry.title}</h3><p>${entry.description}</p></div>
    </li>`).join('')}</ol>
  </section>`;
}

export function companyHistoryHTML(){
  return `<div class="heritage-overview" aria-labelledby="heritage-title">
    <div class="heritage-heading" data-heritage-reveal>
      <div><p class="heritage-kicker">OUR JOURNEY · 2016–2025</p><h1 id="heritage-title"><em>十年</em>沿革</h1></div>
      <p class="heritage-intent">從技術深耕到全球布局</p>
    </div>
    ${stageHTML(companyHistory[0], 0)}
    <div class="heritage-transition" data-heritage-reveal>
      ${Array.from({length:3},()=>'<svg class="heritage-stage-arrow" viewBox="0 0 84 28" aria-hidden="true" focusable="false"><path d="M5 3 42 13 79 3M5 14 42 24 79 14"/></svg>').join('')}
      <span>從技術研發走向 AI 平台整合</span>
    </div>
    ${stageHTML(companyHistory[1], 1)}
    <p class="heritage-summary" data-heritage-reveal>十年技術累積，持續推動企業 AI 落地。</p>
  </div>`;
}
