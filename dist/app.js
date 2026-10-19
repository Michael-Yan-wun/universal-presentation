import {createVisionLessonMotion,visionCurriculum} from './aiwinops-keynote.js?v=castle-first-1';
import {createNumOpsStage,numOpsUI} from './numops-keynote.js?v=waterops-partnership-1';
import {createWinChatStage} from './winchat-motion.js?v=winchat-launch-1';
import {syncWinChatKeynote} from './winchat-keynote.js?v=winchat-launch-1';
import { winChatUI, winChatEvidence } from './winchat-story.js?v=winchat-launch-1';
import { createWinEdgeLaunch } from './winedge-launch.js?v=ecosystem-1';
import { companyHistory, companyHistoryHTML } from './company-history.js?v=heritage-growth-17';
import { animateCompanyHistory } from './company-history-motion.js?v=heritage-growth-18';
import { applyBrandTypography } from './text-color-preview.js?v=brand-text-5';
import { createOpening } from './opening.js?v=opening-recovery-25';
import { productColors, palette, productInk } from './product-colors.js?v=product-colors-1';
import { companyHTML, companyStageHTML, companyProductHTML, companyLayouts, companyPreviewHTML, animateCompanyIntro } from './company.js?v=company-lockup-6';
import { createCosmicBackground } from './cosmic-background.js?v=cosmic-final-1';
import { historyOverview, historyUI, historyRoomAction, createVisionPlayer } from './history-ui.js?v=castle-first-1';
import { createScene } from './scene.js?v=castle-first-1';
import {growthHTML,senseHTML,journeyUI} from './narrative-ui.js?v=castle-first-1';
import { chapters, chapterNavigation, products, cases, agents, icons, chapterFor, growthStages, senseRoutes, resolveChapterRoute } from './content.js?v=castle-first-1';
const $=s=>document.querySelector(s),root=$('#experience'),story=$('#story'),dialog=$('#case-dialog'),detail=$('#stage-detail');
const intro=story.innerHTML;
const visionLessonMotion=createVisionLessonMotion(detail);
const numOpsStage=createNumOpsStage({root,story,detail});
const winChatStage=createWinChatStage({root,story,detail});
const background=createCosmicBackground();
applyBrandTypography();
for(const [id,color] of Object.entries(productColors)){document.documentElement.style.setProperty('--'+id,color.main);document.documentElement.style.setProperty('--'+id+'-ink',color.text);}
const companyPreview=new URLSearchParams(location.search).has('company-layout');
let cancelCompanyMotion=()=>{};
let cancelHistoryMotion=()=>{};
let companyLayout=new URLSearchParams(location.search).get('company-layout')||'stage';
if(!companyLayouts.some(item=>item.id===companyLayout))companyLayout='stage';
root.dataset.companyLayout=companyLayout;
let companyHistoryPage=0;
let chapter=0,productState=null,scene,presentation=false,notes=false,toastTimer,inspected=false;
const launch=createWinEdgeLaunch({container:detail,productStage:$('#scene'),onChange:updateLaunchStage});
const opening=createOpening({onTime:time=>scene?.setIntroTime(time),onOcclusion:hidden=>scene?.setOpeningOccluded(hidden)});
const eyebrow=text=>`<p class="eyebrow"><span class="eyebrow-line"></span>${text}</p>`;
const icon=id=>`<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${icons[id]}"/></svg>`;
function toast(text){$('#toast').textContent=text;$('#toast').classList.add('visible');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('visible'),2600)}
function productHTML(p){return `${eyebrow(`BUILDING BLOCK 0${p.order} / ${p.verb}`)}<h1>${p.name}<em>.</em></h1><div class="story-copy"><h2>${p.headline}</h2><p>${p.description}</p></div><div class="capabilities">${p.tags.map(t=>`<span>${t}</span>`).join('')}</div><div class="case-preview"><span class="case-kicker">FROM PROJECT TO PRODUCT</span><button data-case="${p.caseId}" class="case-link"><strong>${p.caseTitle}</strong><span>↗</span></button></div><button class="text-button" id="inspect-button">深入這塊積木 <span>＋</span></button>`}
function castleHTML(){return `${eyebrow('TEN YEARS. ONE CONNECTED INTELLIGENCE.')}<h1 class="chinese-heading">十年累積，<br><span class="light-word">築成智慧。</span></h1><div class="story-copy"><h2>從真實現場，到領域智慧。</h2></div><div class="castle-key"><div><i style="--key:${palette.chat}"></i><span>WinChat</span><small>記憶、思考與行動</small></div><div><i class="paired-product-key" style="--key:${palette.vision};--key-secondary:${palette.analytics}"></i><span>AIWinOps / NumOps</span><small>學會影像與數據的規律</small></div><div><i style="--key:${palette.unified}"></i><span>WinEdge</span><small>連接現場的影像與數據</small></div><div><i style="--key:${palette.stone}"></i><span>Edge AI Foundation</span><small>設備、感測器與 PLC</small></div></div><p class="castle-origin"><span>從這裡，回到每一塊能力的起點。</span></p>`}
function caseHTML(c,index){return `${eyebrow(`IN THE REAL WORLD / 0${index-chapterFor('inspection')+1}`)}<span class="industry-tag">${c.date}</span><h1 class="case-heading">${c.title}</h1><div class="story-copy"><h2>${c.headline}</h2><p>${c.fact}</p></div><div class="combination-flow">${c.flow.map((f,i)=>`${i?'<span class="plus">＋</span>':''}<div><strong>${f}</strong><small>${c.roles[i]}</small></div>`).join('')}</div><div class="case-proof">${c.proof}</div><button class="text-button" data-case="${c.caseId}">展開案例畫面 <span>↗</span></button><p class="source-note">${c.sourceLabel}</p>`}
const visionPlayer=createVisionPlayer($('#vision-player'),(type,index)=>scene?.historyAction(type,index));
function go(index,{hash=true,senseMode,timelinePage=0}={}){opening.stop();launch.stop();winChatStage.reset();numOpsStage.reset();visionLessonMotion.reset();delete root.dataset.launchMode;delete root.dataset.launchStep;cancelCompanyMotion();cancelHistoryMotion();visionPlayer.hide();delete root.dataset.productPhase;delete root.dataset.senseMode;delete root.dataset.historyPhase;detail.dataset.historyRenderedPhase='';delete detail.dataset.winchatView;delete root.dataset.winchatLayout;if(dialog.open)dialog.close();chapter=Math.max(0,Math.min(chapters.length-1,index));const d=chapters[chapter];inspected=false;root.dataset.chapter=chapter;root.dataset.kind=d.kind;root.dataset.product=d.product?.id||'';root.classList.remove('inspecting');document.documentElement.style.setProperty('--accent',d.accent);story.hidden=d.kind==='launch';story.className='story enter '+d.kind+'-story';detail.innerHTML='';
  const isClosing=d.kind==='closing';root.hidden=isClosing;$('#cosmic-closing').hidden=!isClosing;$('.footer').hidden=isClosing;
  story.innerHTML=d.kind==='growth'||d.kind==='body'?growthHTML(d.kind):d.kind==='intro'?intro:d.kind==='company'?companyHTML():d.kind==='history'?historyOverview():d.kind==='product'?productHTML(d.product):d.kind==='castle'?castleHTML():d.kind==='case'?caseHTML(d.combination,chapter):'';
  if(d.kind==='product')detail.innerHTML=`<div class="pipeline">${d.product.pipeline.map((t,i)=>`<div><span>0${i+1}</span><strong>${t}</strong></div>`).join('<b>→</b>')}</div>`;
  if(d.kind==='history'){root.dataset.historyPhase='overview';detail.innerHTML=historyUI({phase:'overview',selected:0,completed:false}).detail;}
  $('#company-design-toolbar').innerHTML=d.kind==='company'&&companyPreview?companyPreviewHTML(companyLayout):'';
  if(d.kind==='company')detail.innerHTML=companyStageHTML();
  $('#scene').setAttribute('aria-label',d.kind==='company'?'WinHub.AI 四項產品展示台':'可旋轉的 3D 產品積木場景');
  if(d.kind==='intro')detail.innerHTML='<div class="sculpture-caption"><span>＋ A WORLD WAITING TO BE BUILT</span></div>';
  if(d.kind==='castle')detail.innerHTML='<div class="domain-title">DOMAIN AI BRAINS <span>領域智慧，彼此連結</span></div>';
  if(d.kind==='case'){const c=d.combination;detail.innerHTML=`<button class="evidence-frame" data-case="${c.caseId}" aria-label="放大${c.title}案例圖"><div><span>PROJECT EVIDENCE</span><span>↗</span></div><img src="./assets/${c.image}" alt="${c.alt}"><small>${c.sourceLabel}</small></button>`}
  $('#birth-track').hidden=true;$('#birth-track').innerHTML=products.map((p,i)=>`<button data-chapter="${chapterFor(p.id)}" class="${chapter===chapterFor(p.id)?'current':chapter>chapterFor(p.id)?'born':''}" ${chapter===chapterFor(p.id)?'aria-current="step"':''}><span>0${p.order}</span>${p.name}</button>`).join('');
  $('#current-count').textContent=String(chapter).padStart(2,'0');$('#scene-index').textContent=`CHAPTER ${String(chapter).padStart(2,'0')}`;$('#scene-caption').textContent=({company:'BE YOUR IPARTNER',chronicle:'OUR JOURNEY / 2016–2025',intro:'A WORLD WAITING TO BE BUILT',history:'A DECADE OF EXPERIENCE',product:'THE BUILDING BLOCKS',growth:'FIRST CONTACT',body:'CONNECTED INTELLIGENCE',launch:'WINEDGE',castle:'FROM EDGE TO AGENT',case:'BUILT TO WORK TOGETHER',closing:'THE NEXT DECADE'})[d.kind];$('#scene-hint').textContent=d.kind==='company'?'四大能力，組合企業 AI 的每一種可能':d.kind==='castle'?'從感知、學習，到思考與行動':d.kind==='product'?'拖曳旋轉 · 點擊積木深入':d.kind==='growth'?'多種感官，匯成理解現場的入口':'每個答案，都能成為下一個起點';$('#explode-button').hidden=true;$('#explode-button').setAttribute('aria-pressed','false');$('#explode-button').textContent='展開城堡 ↗';$('#note-text').textContent=d.note;
  document.querySelectorAll('.chapter-nav button').forEach(b=>{const active=chapter>=+b.dataset.chapter&&chapter<+(b.nextElementSibling?.dataset.chapter||chapters.length);b.classList.toggle('active',active);if(active)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current')});$('#previous').disabled=chapter===0;$('#previous').setAttribute('aria-label','上一幕');$('#next').disabled=chapter===chapters.length-1;$('#next').setAttribute('aria-label','下一幕');$('#total-count').textContent=String(chapters.length-1).padStart(2,'0');$('#growth-state').textContent=growthStages.find(s=>s.id===d.stage)?.title||'';root.dataset.growthStage=d.stage;scene?.setChapter(chapter);if(d.kind==='chronicle')showCompanyHistory(timelinePage);if(d.kind==='company'){scene?.setCompanyLayout(companyLayout);cancelCompanyMotion=animateCompanyIntro(root);}if(d.kind==='growth'&&senseMode)scene?.senseAction(senseMode);if(hash)history.replaceState(null,'',`#${d.kind==='growth'&&root.dataset.senseMode==='cameras'?'visual':d.kind==='growth'&&root.dataset.senseMode==='data'?'numeric':d.slug}`);if(presentation)(isClosing?$('#cosmic-closing'):root).focus({preventScroll:true});if(innerWidth<=800)window.scrollTo({top:0,behavior:'instant'});background.setChapter(d.kind);if(d.kind==='intro')opening.start();if(d.kind==='launch')launch.start();
}
function showCompanyHistory(page,focusControl=false){
 if(chapters[chapter].kind!=='chronicle')return;
 cancelHistoryMotion();
 companyHistoryPage=Math.max(0,Math.min(companyHistory.length-1,page));
 story.innerHTML=companyHistoryHTML(companyHistoryPage);
 cancelHistoryMotion=animateCompanyHistory(story);
 const era=companyHistory[companyHistoryPage];
 $('#next').setAttribute('aria-label',companyHistoryPage<companyHistory.length-1?'公司沿革：2021–2025':'看見十年累積的智慧城堡');
 $('#previous').setAttribute('aria-label',companyHistoryPage>0?'公司沿革：2016–2020':'返回公司介紹');
 $('#note-text').textContent=era.range+' '+era.title+'。'+era.milestones.map(entry=>entry.year+' '+entry.title.replace(/<[^>]*>/g,'')+'：'+entry.points.join('；')).join('。');
 if(focusControl)story.querySelector(`[data-company-history-page="${companyHistoryPage}"]`).focus({preventScroll:true});
}
function selectCompanyLayout(id){
 if(!companyLayouts.some(item=>item.id===id))return;
 companyLayout=id;root.dataset.companyLayout=id;scene?.setCompanyLayout(id);
 document.querySelectorAll('[data-company-layout]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.companyLayout===id)));
 const url=new URL(location.href);url.searchParams.set('company-layout',id);history.replaceState(null,'',url);
}
function previous(){const kind=chapters[chapter].kind;if(['chat','analytics'].includes(root.dataset.product)&&['selecting','fusing'].includes(productState?.phase))return;if(kind==='launch'&&launch.previous())return;if(kind==='chronicle'&&companyHistoryPage>0){showCompanyHistory(companyHistoryPage-1);return;}if(kind==='growth'&&scene?.senseAction('back'))return;if(kind==='history'&&scene?.historyPrevious())return;if(kind==='product'&&scene?.productAction('back'))return;go(chapter-1,{senseMode:chapters[chapter-1]?.kind==='growth'?'data':undefined,timelinePage:chapters[chapter-1]?.kind==='chronicle'?companyHistory.length-1:0})}
function advance(){if(dialog.open)return;const kind=chapters[chapter].kind;if(kind==='launch'){if(!launch.next())go(chapter+1);return;}if(kind==='chronicle'&&companyHistoryPage<companyHistory.length-1){showCompanyHistory(companyHistoryPage+1);return;}if(kind==='growth'&&scene?.senseAction('next'))return;if(kind==='history'){if(root.dataset.historyPhase==='product')go(chapter+1);else scene?.historyAdvance();return}if(kind==='product'){if(root.dataset.product==='chat'){if(!scene?.productAction('next')&&scene?.productPhase()==='born')go(chapter+1);return;}if(scene?.productPhase()==='born')go(chapter+1);else scene?.productAction('next');return}go(chapter+1)}
function updateLaunchStage(state){
 if(chapters[chapter].kind!=='launch')return;
 root.dataset.launchMode=state.mode;root.dataset.launchStep=state.step;
 scene?.setLaunchMode(state.mode);
 $('#previous').disabled=$('#next').disabled=state.busy;
 $('#previous').setAttribute('aria-label',state.step===0?'回到協作成形':'WinEdge 上一段');
 $('#next').setAttribute('aria-label',state.step===state.last?'看看能力如何落地':'WinEdge 下一段');
 $('#growth-state').textContent='WinEdge 新品發佈';
 $('#note-text').textContent=state.feature?.note||(state.mode==='hero'?'WinEdge 是最貼近現場的 AI 平台：依製造業、機台、Agent、儀表板與 Robot 等需求，組合各式現場 AI。N 與 V 的整合是基礎，重點是把能力組成可用的現場應用。右箭頭依序展開三段主題：接上現場與組合 AI、設計到維運、Plugin 與 Agent。實際案例後，以便當圖一次收束完整八項能力。':state.mode==='cases'?'以既有瓶蓋檢測影片、智慧烤箱溫控與 WinChat 知識問答帶出新平台的實戰基礎。這些為既有展示，不宣稱已部署在新品。':'八項能力回到最貼近現場的 WinEdge，依不同現場組合各式 AI。帶出製造業、機台、Agent、儀表板與 Robot；便當圖完整呈現產品能力，下一步邀請合作夥伴共建生態圈。');
}
function openCase(id){const c=cases[id];if(!c)return;delete dialog.dataset.companyProduct;$('#close-case').setAttribute('aria-label','關閉案例');let visual=c.image?`<img class="official-case" src="./assets/${c.image}" alt="${c.alt||c.title}">`:`<div class="agent-grid">${agents.map(a=>`<button class="agent-row" data-case="${a.id}">${icon(a.icon)}<strong>${a.zh}</strong><small>${a.title}</small></button>`).join('')}</div>`;$('#case-content').innerHTML=`<div class="case-layout"><div class="case-description">${eyebrow(c.eyebrow)}<h2 id="case-heading">${c.title}</h2><p>${c.description}</p><ol>${c.steps.map(s=>`<li>${s}</li>`).join('')}</ol>${c.source?`<a class="source-link" href="${c.source}" target="_blank" rel="noopener">查看官方資料 ↗</a>`:''}<p class="case-footnote">${c.footnote||''}</p></div><div class="case-visual">${visual}</div></div>`;if(!dialog.open)dialog.showModal();scene?.setInspect(true)}
function closeCase(){dialog.close();scene?.setInspect(inspected)}
function openCompanyProduct(id){const html=companyProductHTML(id);if(!html)return;dialog.dataset.companyProduct=id;$('#close-case').setAttribute('aria-label','關閉產品介紹');$('#case-content').innerHTML=html;if(!dialog.open)dialog.showModal();}
function mode(){presentation=!presentation;document.body.classList.toggle('presentation',presentation);if(presentation)root.focus({preventScroll:true});toast(presentation?'演講模式已開啟':'已切換為自由探索模式')}
async function fullscreen(){try{if(document.fullscreenElement)await document.exitFullscreen();else await document.documentElement.requestFullscreen()}catch{toast('此預覽環境不支援全螢幕，可在外部瀏覽器開啟。')}}
document.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;if(b.dataset.winchatEvidence&&root.dataset.product==='chat'){delete dialog.dataset.companyProduct;$('#close-case').setAttribute('aria-label','關閉 WinChat 產品介面');$('#case-content').innerHTML=winChatEvidence(b.dataset.winchatEvidence);if(!dialog.open)dialog.showModal();dialog.querySelector(`[data-winchat-evidence="${b.dataset.winchatEvidence}"]`).focus();return;}if(b.dataset.companyHistoryPage!==undefined){showCompanyHistory(Number(b.dataset.companyHistoryPage),true);return;}if(b.dataset.companyProduct){openCompanyProduct(b.dataset.companyProduct);return}if(b.dataset.companyLayout){selectCompanyLayout(b.dataset.companyLayout);return}if(b.dataset.chapter!==undefined)go(+b.dataset.chapter);if(b.hasAttribute('data-next-chapter'))go(chapter+1);if(b.dataset.sense){if(!scene?.senseAction(b.dataset.sense)&&b.dataset.sense==='next')advance()}if(b.dataset.journey)scene?.productAction(b.dataset.journey,+b.dataset.topic);if(b.dataset.case)openCase(b.dataset.case);if(b.dataset.history)scene?.historyAction(b.dataset.history,b.dataset.caseIndex===undefined?undefined:+b.dataset.caseIndex);if(b.id==='opening-replay'){scene?.setChapter(chapter);opening.start();}if(b.id==='inspect-button'){inspected=!inspected;root.classList.toggle('inspecting',inspected);scene?.setInspect(inspected);b.innerHTML=inspected?'回到產品全景 <span>－</span>':'深入這塊積木 <span>＋</span>'}});
$('#closing-previous').onclick=previous;$('#previous').onclick=previous;$('#next').onclick=advance;$('#close-case').onclick=closeCase;dialog.addEventListener('close',()=>scene?.setInspect(inspected));dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeCase()}});$('#explode-button').onclick=()=>{const on=$('#explode-button').getAttribute('aria-pressed')!=='true';$('#explode-button').setAttribute('aria-pressed',on);$('#explode-button').textContent=on?'收合城堡 ↙':'展開城堡 ↗';scene?.setExploded(on)};
document.addEventListener('keydown',e=>{if(dialog.open)return;if(e.key==='Escape'&&$('#vision-player').open){scene?.historyAction('close');return;}if(e.key===' '&&e.target.closest('video'))return;if(e.metaKey||e.ctrlKey||e.altKey||/INPUT|TEXTAREA|SELECT/.test(e.target.tagName))return;const k=e.key.toLowerCase();if(['arrowright','arrowleft','pagedown','pageup',' ','home','end'].includes(k)){if(k===' '&&e.target.closest('button')&&!presentation)return;e.preventDefault();if(k==='arrowright'||k==='pagedown'||k===' ')advance();if(k==='arrowleft'||k==='pageup')previous();if(k==='home')go(0);if(k==='end')go(chapters.length-1)}if(k==='p')mode();if(k==='f')fullscreen();if(k==='n'){notes=!notes;$('#presenter-notes').hidden=!notes;toast(notes?'講者提示已顯示，會一起投影':'講者提示已隱藏')}});
let wheelTime=0;window.addEventListener('wheel',e=>{if(presentation||dialog.open||$('#vision-player').open||innerWidth<=800||Math.abs(e.deltaY)<35||performance.now()-wheelTime<1000||(chapters[chapter].kind==='launch'||['chat','analytics'].includes(root.dataset.product)))return;wheelTime=performance.now();if(['chronicle','growth','history','product'].includes(chapters[chapter].kind)){if(e.deltaY>0)advance();else previous()}else go(chapter+(e.deltaY>0?1:-1))},{passive:true});
function updateHistoryStage(state){
  if(chapters[chapter].kind!=='history')return;
  const busy=['entering','selecting','settling','fusing','returning'].includes(state.phase);
  const renderPhase=['selecting','settling'].includes(state.phase)?'room':state.phase;
  document.documentElement.style.setProperty('--accent',state.phase==='overview'?chapters[chapter].accent:productInk.vision);
  $('#growth-state').textContent=state.phase==='overview'?'從感知到學習':state.phase==='product'?'學習的能力':'在實戰中學習';
  root.dataset.historyPhase=state.phase;story.hidden=state.phase!=='overview';
  if(state.phase==='learning'){
    visionLessonMotion.render(state.learningStep||0);detail.dataset.historyRenderedPhase='learning';
    $('#note-text').textContent=visionCurriculum[state.learningStep||0].note;
  }else{
    visionLessonMotion.reset();$('#note-text').textContent=chapters[chapter].note;
    if(detail.dataset.historyRenderedPhase!==renderPhase){
      const content=historyUI({...state,phase:renderPhase});story.innerHTML=content.story;detail.innerHTML=content.detail;detail.dataset.historyRenderedPhase=renderPhase;
    }
  }
  if(state.phase==='room'){
    const action=detail.querySelector('.history-room-action');
    if(action.dataset.ready!==String(state.canFuse)){action.innerHTML=historyRoomAction(state.canFuse);action.dataset.ready=String(state.canFuse)}
  }
  visionPlayer.sync(state);
  $('#next').disabled=busy;$('#previous').disabled=busy;
  $('#next').setAttribute('aria-label',state.phase==='overview'?'從影像專案開始學習':state.phase==='room'?(state.caseOpen?'看看硬體如何接起來':state.canFuse?'把經驗化為訓練':'下一個影像案例'):'回到十年積累');
  if(state.phase==='hardware')$('#next').setAttribute('aria-label','下一個案件');if(state.phase==='learning')$('#next').setAttribute('aria-label',state.learningStep===visionCurriculum.length-1?'誕生 AIWinOps':'AIWinOps 下一段');if(state.phase==='product')$('#next').setAttribute('aria-label','繼續學習數據規律');
  $('#scene-caption').textContent=state.phase==='overview'?'LEARNING THROUGH EXPERIENCE':'INSIDE VISION';
}
function updateSenseStage(state){
 if(chapters[chapter].kind!=='growth')return;
 if(root.dataset.senseMode!==state.mode){root.dataset.senseMode=state.mode;story.innerHTML=senseHTML(state.mode)}
 $('#next').disabled=state.busy;$('#previous').disabled=state.busy;
 for(const b of story.querySelectorAll('[data-sense]'))b.disabled=state.busy;
 $('#next').setAttribute('aria-label',state.mode==='overview'?'展開影像感知':state.mode==='cameras'?'接上數據感知':'開始學習與累積');
 $('#scene-caption').textContent=state.mode==='data'?'DATA / WINEDGE-N':state.mode==='cameras'?'VISION / WINEDGE-V':'FIRST CONTACT';
 document.documentElement.style.setProperty('--accent',state.mode==='overview'?'#8cbbd7':productInk.numeric);
 history.replaceState(null,'','#'+(state.mode==='data'?'numeric':state.mode==='cameras'?'visual':'first-contact'));
}
function updateProductStage(state){
 if(chapters[chapter].kind!=='product')return;productState=state;root.dataset.productPhase=state.phase;
 if(state.id==='analytics'){
  const ui=numOpsUI(state),busy=['selecting','fusing'].includes(state.phase);
  numOpsStage.render(state,ui);
  $('#next').disabled=$('#previous').disabled=busy;
  $('#next').setAttribute('aria-label',ui.action||'NumOps 下一段');
  $('#previous').setAttribute('aria-label','NumOps 上一段');
  $('#note-text').textContent=ui.note;$('#growth-state').textContent='數據 · 學習 · 決策';
  return;
 }
 if(state.id==='chat'){
  const ui=winChatUI(state),busy=['selecting','fusing'].includes(state.phase);
  winChatStage.render(state,ui);
  syncWinChatKeynote(detail,state);
  $('#next').disabled=$('#previous').disabled=busy;
  for(const b of story.querySelectorAll('[data-journey]'))b.disabled=busy;
  $('#next').setAttribute('aria-label',ui.action||(state.phase==='overview'?'展開 WinChat 多模態 RAG':'融合為 WinChat'));
  $('#previous').setAttribute('aria-label','WinChat 上一段');
  $('#note-text').textContent=ui.note;$('#growth-state').textContent='記憶 · 思考 · 行動';
  return;
 }
 const ui=journeyUI(state),p=chapters[chapter].product;
 story.hidden=state.phase==='fusing';story.innerHTML=ui.born?productHTML(p):ui.story;detail.innerHTML=ui.born?`<div class="pipeline">${p.pipeline.map((v,i)=>`<div><span>0${i+1}</span><strong>${v}</strong></div>`).join('<b>→</b>')}</div>`:ui.detail;
 const busy=['selecting','fusing'].includes(state.phase);$('#next').disabled=$('#previous').disabled=busy;$('#next').setAttribute('aria-label',state.phase==='born'?'下一幕':state.phase==='overview'?'走進第一塊經驗':'下一塊經驗');
}
$('.chapter-nav').innerHTML=chapterNavigation.map(({slug,title})=>`<button data-chapter="${chapterFor(slug)}">${title}</button>`).join('');
try{scene=createScene($('#scene'),$('#model-labels'),id=>{if(id.startsWith('company-')){openCompanyProduct(id.slice(8));return}if(id.startsWith('journey-')){scene?.productAction('select',Number(id.slice(8)));return}if(id==='history-vision'){scene?.historyAction('enter');return}if(id.startsWith('history-case-')){scene?.historyAction('select',Number(id.slice(13)));return}const i=products.findIndex(p=>p.id===id);if(i>=0){if(senseRoutes[id]){if(chapters[chapter].kind==='growth'&&root.dataset.senseMode===senseRoutes[id])openCase(id);else go(chapterFor('first-contact'),{senseMode:senseRoutes[id]})}else if(chapters[chapter].kind==='product')openCase(id);else go(id==='vision'?chapterFor('decade'):chapterFor(id))}else openCase(id)},updateHistoryStage,updateProductStage,updateSenseStage)}catch(error){console.error('3D initialization failed',error);$('#scene-fallback').hidden=false}
const initial=resolveChapterRoute(location.hash.slice(1));go(initial.index>=0?initial.index:0,{hash:false,senseMode:initial.senseMode});
