// Published case evidence stays separate from the illustrative platform workflow.
export const waterOpsCaseSource='https://www.waterops.net/news/page/%E6%9C%80%E6%96%B0%E6%B6%88%E6%81%AF/88';

const flowIcon=(kind)=>`<svg viewBox="0 0 48 48" aria-hidden="true">${{
 water:'<path d="M24 4C20 13 10 23 10 31a14 14 0 0 0 28 0C38 23 28 13 24 4Z"/><path d="M17 31a7 7 0 0 0 7 7"/>',
 model:'<path d="m24 4 17 10v20L24 44 7 34V14Z M7 14l17 10 17-10M24 24v20"/>',
 control:'<path d="M10 5v38M24 5v38M38 5v38"/><rect x="5" y="12" width="10" height="9" rx="2"/><rect x="19" y="28" width="10" height="9" rx="2"/><rect x="33" y="16" width="10" height="9" rx="2"/>',
 cycle:'<path d="M39 19A16 16 0 0 0 11 13L6 20M6 7v13h13M9 29a16 16 0 0 0 28 6l5-7M42 41V28H29"/>'
 }[kind]}</svg>`;

export function waterOpsShowcase(){return `<div class="wo-showcase">
 <div class="wo-main">
  <section class="wo-partnership" aria-label="GSD 與慧穩共同開發 WaterOps">
   <div class="wo-brands"><img src="./assets/numops/gsd-logo.png" alt="GSD 基士德" width="209" height="70"/><span>×</span><b>AIWin<small>慧穩科技</small></b></div>
   <div class="wo-product"><h2>WaterOps</h2><h3>把水務專業，變成現場智慧。</h3><p>共同打造的智慧水務 AutoML 平台</p></div>
   <div class="wo-expertise"><div><b>GSD 基士德</b><span>水處理工程<br>現場操作經驗</span></div><i>＋</i><div><b>AIWin 慧穩科技</b><span>數據 AutoML<br>AI 建模與落地</span></div></div>
  </section>
  <section class="wo-case" data-source="${waterOpsCaseSource}" aria-label="矽品中科廠公開案例">
   <header><h2>矽品中科廠</h2><span>硼廢水智能精準加藥 · GSD 協助導入 WaterOps</span></header>
   <div class="wo-evidence">
    <figure class="wo-award-photo"><img src="./assets/numops/waterops-spil-award.jpg" alt="WaterOps 官方公布的 2026 淨水永續獎頒獎照片" width="1478" height="831"/><figcaption>2026 淨水永續獎頒獎現場</figcaption></figure>
    <div class="wo-results"><p>案例藥劑用量降幅</p><div class="wo-metric"><span>氯化鋇 <small>BaCl₂</small></span><strong><i>↓</i>45<span>%</span></strong><div class="wo-reduction-track" aria-hidden="true"><i style="--remaining:55%"></i></div></div><div class="wo-metric"><span>過氧化氫 <small>H₂O₂</small></span><strong><i>↓</i>24<span>%</span></strong><div class="wo-reduction-track" aria-hidden="true"><i style="--remaining:76%"></i></div></div></div>
   </div>
   <div class="wo-award"><svg viewBox="0 0 32 32" aria-hidden="true"><path d="M9 4h14v10a7 7 0 0 1-14 0ZM9 7H4v4a6 6 0 0 0 6 6M23 7h5v4a6 6 0 0 1-6 6M16 21v6M10 28h12"/></svg><p><b>矽品獲 2026 環境部淨水永續獎</b><span>水處理卓越獎 · 智慧低碳管理組（高科技產業組）</span></p></div>
  </section>
 </div>
 <div class="wo-workflow" aria-label="WaterOps 平台應用流程示意">
  ${[['water','水質數據','監測 · 整合'],['model','WaterOps','AutoML ＋ 環工知識'],['control','現場調控','精準加藥 · 操作優化'],['cycle','持續優化','成效檢視 · 經驗累積']].map(([icon,title,sub],i)=>`<div class="wo-flow-step" style="--step:${i}"><div class="wo-flow-icon">${flowIcon(icon)}</div><div><h3>${title}</h3><p>${sub}</p></div>${i<3?'<div class="wo-flow-link" aria-hidden="true"><i></i><span>›</span></div>':''}</div>`).join('')}
 </div>
</div>`;}
