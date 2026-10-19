import {visionLessonHTML,visionHardwareHTML} from './aiwinops-keynote.js?v=castle-first-1';
import { historyCases, visionCases } from './content.js?v=castle-first-1';
const eyebrow=text=>`<p class="eyebrow"><span class="eyebrow-line"></span>${text}</p>`;
const button=(action,text,secondary=false)=>secondary?`<button class="text-button" data-history="${action}">${text} <span>↶</span></button>`:'';
export function historyOverview(completed=false){
 return `${eyebrow('2016 — 2026 / LEARNING THROUGH EXPERIENCE')}<h1 class="chinese-heading">有了感知，<br>開始<em>學習。</em></h1><div class="metrics"><div><strong>150<span>+</span></strong><small>已交付 AI 專案</small></div><div><strong>30<span>+</span></strong><small>服務產業</small></div><div><strong>10</strong><small>年，深入現場</small></div></div><div class="story-copy"><h2>十年的專案，是我們的成長課堂。</h2><p>把影像與數據帶進真實場域，<br>從一次次專案中，學會理解與判斷。</p></div><div class="history-domains"><button data-history="enter" class="active"><i style="background:${historyCases[0].color}"></i><span>01</span><strong>Vision 影像</strong><small>${completed?'AIWinOps 已成形':'學會辨識'}</small><b>↗</b></button>${historyCases.slice(1).map((c,i)=>`<button data-case="${c.caseId}"><i style="background:${c.color}"></i><span>0${i+2}</span><strong>${i?'LLM 語言':'Data 數據'}</strong><small>${i?'累積知識':'學會規律'}</small><b>↗</b></button>`).join('')}</div>${button('enter',completed?'再次走進 Vision':'從影像專案開始學習')}<p class="source-note">AIWin 完整 Pitch v5 · 企業歷程與案例影片</p>`;
}
export function historyRoomAction(canFuse){return canFuse?button('fuse','把經驗化為訓練'):'<div class="vision-fields"><span>品質</span><span>工安</span><span>計數</span><span>SOP</span><span>組裝</span></div>'}
export function historyUI(state){
 const {phase,completed,selected,canFuse=false}=state;
 const route=`<div class="history-route"><span class="active">01 / VISION</span><i></i><span>02 / DATA</span><i></i><span>03 / LLM</span><i></i><span>智慧成形</span></div>`;
 if(phase==='overview')return {story:historyOverview(completed),detail:`<div class="history-overview-caption"><span>EVERY PROJECT, A LESSON. EVERY LESSON, A BUILDING BLOCK.</span><strong>${completed?'影像經驗，已沉澱成 AIWinOps。':'一次次實戰，讓智慧逐步成長。'}</strong></div>${route}`};
 if(phase==='entering')return {story:'',detail:'<div class="history-transition vision-entry"><p class="vision-entry-kicker">A DECADE OF LEARNING TO SEE</p><div class="vision-wordmark" data-text="VISION"><span>VISION</span></div><p class="vision-entry-subtitle">從看見，到學會辨識。</p><div class="vision-entry-rule"></div></div>'};
 if(phase==='returning')return {story:'',detail:'<div class="history-transition returning"><span>EXPERIENCE BECOMES CAPABILITY</span></div>'};
 if(phase==='room')return {story:'',detail:`<div class="vision-room-heading">${eyebrow('LEARNING TO SEE / FIVE LESSONS FROM THE FIELD')}<h1>每一個專案，<em>都是一堂成長的課。</em></h1><p>從五個真實場景，累積辨識物件、理解異常與判斷流程的經驗。</p></div><button class="room-back" data-history="back">↖ 十年積累</button><div class="vision-room-footer"><div><small>FROM MANY PROJECTS, FIVE PERSPECTIVES.</small><p>看見問題、整理樣本，再練習判斷。</p></div><div class="history-room-action">${historyRoomAction(canFuse)}</div></div>`};
 if(phase==='hardware')return {story:'',detail:visionHardwareHTML(selected)};
 if(phase==='learning')return {story:'',detail:visionLessonHTML(state.learningStep||0)};
 if(phase==='fusing')return {story:'',detail:`<div class="vision-fusion-heading">${eyebrow('FROM PROJECTS TO PRODUCT')}<h1>十年的學習，<em>凝聚成一塊新能力。</em></h1></div><div class="vision-fusion-flash"></div>`};
 return {story:'',detail:`<div class="vision-product-heading">${eyebrow('EXPERIENCE BECOMES LEARNING')}<h1>AIWinOps<span>影像 AI 訓練平台</span></h1><p>把資料管理、標註、訓練與驗證，變成持續成長的能力。</p></div><div class="vision-product-bottom"><div class="vision-product-pipeline"><span>相機與現場樣本</span><b>→</b><span>AIWinOps 訓練與驗證</span><b>→</b><span>WinEdge-V 部署與回饋</span></div><div class="vision-product-actions">${button('back','回到十年積累',true)}</div></div>`};
}

// Keep the gallery heading and stage DOM intact when selecting a case.
export function createVisionPlayer(dialog,onAction){
 dialog.innerHTML=`<div class="vision-player-bar"><span>VISION / CASE FILM</span><span class="vision-film-count"></span><button class="vision-player-close" aria-label="關閉案例影片">×</button></div><div class="vision-player-layout"><div class="vision-film-screen"><video id="vision-film" controls muted autoplay loop playsinline disablepictureinpicture controlslist="nofullscreen nodownload noremoteplayback" preload="metadata"></video><button class="vision-play-retry" hidden>播放影片 ▶</button><p class="vision-film-error" hidden>影片暫時無法載入，請重試。</p><div class="vision-film-credit"></div></div><section class="vision-film-copy"><div class="vision-film-meta"></div><h2 id="vision-film-title"></h2><h3></h3><p></p><ol></ol><div class="vision-film-actions"><button class="film-previous" aria-label="上一個案例影片">←</button><button class="film-next"></button></div></section></div>`;
 const video=dialog.querySelector('video'),retry=dialog.querySelector('.vision-play-retry'),error=dialog.querySelector('.vision-film-error');
 let selected=-1,currentState=null,syncing=false;
 function play(){video.play().then(()=>{retry.hidden=true}).catch(()=>{if(dialog.open)retry.hidden=false})}
 function stop(){video.pause();video.removeAttribute('src');video.load();selected=-1}
 function hide(){syncing=true;stop();if(dialog.open)dialog.close();syncing=false}
 dialog.querySelector('.vision-player-close').onclick=()=>onAction('close');
 dialog.querySelector('.film-previous').onclick=()=>onAction('select',selected-1);
 dialog.querySelector('.film-next').onclick=()=>onAction('hardware');
 retry.onclick=()=>{error.hidden=true;if(video.error)video.load();play()};
 video.addEventListener('error',()=>{if(dialog.open&&video.getAttribute('src')){error.hidden=false;retry.textContent='重新載入影片 ↻';retry.hidden=false}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();onAction('close')});
 dialog.addEventListener('close',()=>{if(dialog.open)return;stop();if(!syncing)onAction('close')});
 function sync(state){
  currentState=state;
  if(state.phase!=='room'||!state.caseOpen){if(dialog.open)hide();return}
  const c=visionCases[state.selected];if(!c)return;
  if(!dialog.open)dialog.show();
  if(selected!==state.selected){
   video.pause();selected=state.selected;error.hidden=true;retry.hidden=true;retry.textContent='播放影片 ▶';video.poster='./assets/'+c.image;video.src='./assets/'+c.video;video.muted=true;video.load();play();
   dialog.querySelector('#vision-film-title').textContent=c.title;
   dialog.querySelector('.vision-film-meta').textContent=c.industry+' / '+c.status;
   dialog.querySelector('.vision-film-copy h3').textContent=c.headline;
   dialog.querySelector('.vision-film-copy>p').textContent=c.description;
   dialog.querySelector('.vision-film-copy ol').innerHTML=c.steps.map((s,i)=>`<li><span>0${i+1}</span>${s}</li>`).join('');
   dialog.querySelector('.vision-film-credit').textContent='AIWin 完整 Pitch v5 · P.'+c.page+' / '+c.english;
  }
  dialog.querySelector('.vision-film-count').textContent=String(selected+1).padStart(2,'0')+' / '+String(visionCases.length).padStart(2,'0');
  dialog.querySelector('.film-previous').disabled=selected===0;
  dialog.querySelector('.film-next').textContent='看看硬體如何接起來 ↗';
 }
 return {sync,hide};
}
