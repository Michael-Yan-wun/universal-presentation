import {visionLessonHTML,visionCaseHardwareHTML} from './aiwinops-keynote.js?v=keynote-flow-1';
import { visionCases } from './content.js?v=keynote-flow-1';
const eyebrow=text=>`<p class="eyebrow"><span class="eyebrow-line"></span>${text}</p>`;
export function historyOverview(){return '';}
export function historyRoomAction(canFuse){return canFuse?'':'<div class="vision-fields"><span>品質</span><span>工安</span><span>計數</span><span>SOP</span><span>組裝</span></div>'}
export function historyUI(state){
 const {phase,canFuse=false}=state;
 if(phase==='room')return {story:'',detail:`<div class="vision-room-heading">${eyebrow('LEARNING TO SEE / FIVE LESSONS FROM THE FIELD')}<h1>從現場的問題，<em>開始學會判斷。</em></h1><p>五個代表專案，連起影像、現場硬體與 AI 的判斷。</p></div><div class="vision-room-footer"><div><small>FROM MANY PROJECTS, FIVE PERSPECTIVES.</small><p>看見問題、整理樣本，再練習判斷。</p></div><div class="history-room-action">${historyRoomAction(canFuse)}</div></div>`};
 if(phase==='learning')return {story:'',detail:visionLessonHTML(state.learningStep||0)};
 if(phase==='fusing')return {story:'',detail:`<div class="vision-fusion-heading">${eyebrow('FROM PROJECTS TO PRODUCT')}<h1>十年的學習，<em>凝聚成一塊新能力。</em></h1></div><div class="vision-fusion-flash"></div>`};
 return {story:'',detail:`<div class="vision-product-heading">${eyebrow('EXPERIENCE BECOMES LEARNING')}<h1>AIWinOps<span>影像 AI 訓練平台</span></h1><p>把資料管理、標註、訓練與驗證，變成持續成長的能力。</p></div><div class="vision-product-bottom"><div class="vision-product-pipeline"><span>相機與現場樣本</span><b>→</b><span>AIWinOps 訓練與驗證</span><b>→</b><span>WinEdge-V 部署與回饋</span></div></div>`};
}

// Keep the gallery heading and stage DOM intact when selecting a case.
export function createVisionPlayer(dialog,onAction){
 dialog.innerHTML=`<div class="vision-player-bar"><span>VISION / CASE FILM</span><span class="vision-film-count"></span><button class="vision-player-close" aria-label="關閉案例影片">×</button></div><div class="vision-player-layout"><div class="vision-film-screen"><video id="vision-film" controls muted autoplay loop playsinline disablepictureinpicture controlslist="nofullscreen nodownload noremoteplayback" preload="metadata"></video><button class="vision-play-retry" hidden>播放影片 ▶</button><p class="vision-film-error" hidden>影片暫時無法載入，請重試。</p><div class="vision-film-credit"></div></div><section class="vision-film-copy"><div class="vision-film-meta"></div><h2 id="vision-film-title"></h2><h3></h3><p></p><ol></ol></section></div><div class="vision-film-hardware"></div>`;
 const video=dialog.querySelector('video'),retry=dialog.querySelector('.vision-play-retry'),error=dialog.querySelector('.vision-film-error');
 let selected=-1,syncing=false;
 function play(){video.play().then(()=>{retry.hidden=true}).catch(()=>{if(dialog.open)retry.hidden=false})}
 function stop(){video.pause();video.removeAttribute('src');video.load();selected=-1}
 function hide(){syncing=true;stop();if(dialog.open)dialog.close();syncing=false}
 dialog.querySelector('.vision-player-close').onclick=()=>onAction('close');
 retry.onclick=()=>{error.hidden=true;if(video.error)video.load();play()};
 video.addEventListener('error',()=>{if(dialog.open&&video.getAttribute('src')){error.hidden=false;retry.textContent='重新載入影片 ↻';retry.hidden=false}});
 dialog.addEventListener('cancel',e=>{e.preventDefault();onAction('close')});
 dialog.addEventListener('close',()=>{if(dialog.open)return;stop();if(!syncing)onAction('close')});
 function sync(state){
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
   dialog.querySelector('.vision-film-hardware').innerHTML=visionCaseHardwareHTML(selected);
   dialog.querySelector('.vision-film-credit').textContent='AIWin 完整 Pitch v5 · P.'+c.page+' / '+c.english;
  }
  dialog.querySelector('.vision-film-count').textContent=String(selected+1).padStart(2,'0')+' / '+String(visionCases.length).padStart(2,'0');
 }
 return {sync,hide};
}
