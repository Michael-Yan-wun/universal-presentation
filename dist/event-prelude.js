import {awardTrophy} from './event-award-trophy.js?v=partner-honours-20261019-85';
import {createPartnerStage} from './event-partner-stage.js?v=partner-honours-20261019-85';
import {drawLogo3D,LOGO_REVEAL_SECONDS,logo3DSettled} from './event-logo-3d.js?v=event-cinematic-passage-20261019-85';
import {etchedLogo} from './event-logo-markup.js?v=starflight-20261019-45';
import {createEventOpeningEffects} from './event-opening-effects.js?v=starflight-20261019-45';
import {eventConfig as config} from './event-config.js?v=partner-honours-20261019-85';
const escape=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const people=config.trophyPartners,certificates=config.certificatePartners;
const trophyProfiles=config.trophyProfiles;
const OPENING_PLAYBACK_RATE=1.1;
const eventSections=[
  {id:'event-opening',label:'開場動畫',kinds:['opening']},
  {id:'event-address',label:'林總致詞',kinds:['address']},
  {id:'event-film',label:'十週年影片播放',kinds:['film']},
  {id:'event-awards',label:'頒獎典禮',kinds:['awards','trophy','certificates']},
  {id:'event-speaker',label:'專題演講',kinds:['guest-speaker']}
];
export const eventCues=[
  {id:'event-opening',kind:'opening',label:'活動開場',note:'主持人開場約 3 分鐘。Logo 雕琢與十週年揭幕完成後保持主視覺；按 → 邀請林總致詞。'},
  {id:'event-address',kind:'address',label:'林總致詞',note:'林總致詞約 5 分鐘。背景保持緩慢微光，致詞結束後按 → 進入十週年影片。'},
  {id:'event-film',kind:'film',label:'十週年影片',note:'音控確認播放準備。影片未完成，先選擇本機影片即可試播；正式影片可在 event-config.js 設定。播放結束停留，按 → 進入頒獎。'},
  {id:'event-awards',kind:'awards',label:'夥伴頒獎開場',note:'主持人邀請林總頒獎。按 → 依序邀請四家夥伴至舞台定點；畫面逐一加入 Logo，四家到齊後再一起頒獎與拍照。Brian 協助遞獎盃、獎狀。'},
  ...trophyProfiles.map((partner,i)=>({id:`event-trophy-${i+1}`,kind:'trophy',name:partner.name,index:i,all:i===trophyProfiles.length-1,total:trophyProfiles.length,label:i===trophyProfiles.length-1?'四家到齊 · 頒獎與合照':`唱名 · ${partner.name}`,note:`唱名 ${partner.name}，按鍵後 Logo 與全名在固定位置出現，先前公司持續保留。${i<trophyProfiles.length-1?'下一家唱名時才按 →。':'四家已到齊；逐家頒獎、握手、個別與全體合照都停在此畫面。全部完成後再按 → 進入感謝狀。'}`})),
  {id:'event-certificates',kind:'certificates',label:'感謝狀開場',note:'感謝狀全程停留此總覽畫面，供唱名、致贈與拍照，不逐位切換。全部完成後按 → 邀請外部講師張家維開始演講。'},
  {id:'event-speaker',kind:'guest-speaker',label:'專題演講 · 張家維',note:'邀請張家維，資策會MIC產業顧問兼副主任。演講主題：企業 AI 從單點應用走向智慧協作。畫面持續停留；準備接續 WinHub.AI 簡報時再按 →。'},
];
const numeral=`<svg class="event-ten" viewBox="0 0 660 570" aria-hidden="true"><defs>
<linearGradient id="event-metal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e4d6b9"/><stop offset=".24" stop-color="#b49a6b"/><stop offset=".55" stop-color="#5f5649"/><stop offset=".7" stop-color="#d1bd93"/><stop offset="1" stop-color="#8e7e63"/></linearGradient>
<linearGradient id="event-metal-depth" x1="0" y1="0" x2="1" y2=".8"><stop stop-color="#815526"/><stop offset=".35" stop-color="#b88238"/><stop offset=".64" stop-color="#49301c"/><stop offset="1" stop-color="#8f632b"/></linearGradient>
<clipPath id="event-ten-clip"><text x="0" y="418" style="font:750 430px Inter,Helvetica Neue,Arial,sans-serif;letter-spacing:-42px">10</text></clipPath>
<linearGradient id="event-gold-sheen"><stop stop-color="#e3f1ff" stop-opacity="0"/><stop offset=".5" stop-color="#fff3d1" stop-opacity=".7"/><stop offset="1" stop-color="#fff6dc" stop-opacity="0"/></linearGradient>
<linearGradient id="event-ten-reveal-fade"><stop stop-color="#fff"/><stop offset=".985" stop-color="#fff"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="event-ten-optical-band"><stop stop-color="#000"/><stop offset=".42" stop-color="#555"/><stop offset=".5" stop-color="#fff"/><stop offset=".58" stop-color="#555"/><stop offset="1" stop-color="#000"/></linearGradient>
<mask id="event-ten-material-mask" maskUnits="userSpaceOnUse" x="-60" y="-80" width="840" height="700"><rect class="event-ten-reveal-plane" x="-1400" y="-120" width="1400" height="900" fill="url(#event-ten-reveal-fade)"/></mask>
<mask id="event-ten-optical-mask" maskUnits="userSpaceOnUse" x="-60" y="-80" width="840" height="700"><rect class="event-ten-optical-plane" x="-170" y="-80" width="110" height="650" fill="url(#event-ten-optical-band)"/></mask>
</defs>
<text class="ten-quiet-edge" x="0" y="418">10</text>
<g class="event-ten-solid" mask="url(#event-ten-material-mask)"><g class="ten-relief-stack"><text class="ten-relief" x="14" y="433.82">10</text></g><text class="ten-face" x="0" y="418">10</text><g clip-path="url(#event-ten-clip)"><rect class="event-gold-sheen" x="-220" y="-40" width="145" height="600" fill="url(#event-gold-sheen)"/></g></g>
<text class="ten-rim-light" x="0" y="418" mask="url(#event-ten-optical-mask)">10</text>
<text class="ten-year" x="65" y="520">10TH ANNIVERSARY · AIWIN</text></svg>`;
const trophy=awardTrophy;
const certificate=`<svg class="event-award-object event-certificate-object" viewBox="0 0 460 520" aria-hidden="true"><defs><linearGradient id="paper" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#182639"/><stop offset="1" stop-color="#07101e"/></linearGradient></defs><path d="m63 70 334-13 17 370-334 13z" fill="#03071288"/><path d="M48 53h334v374H48z" fill="url(#paper)" stroke="#d5dfe779"/><path d="M63 68h304v344H63z" fill="none" stroke="#f0820066"/><path d="M85 101h63M85 101v38m260-38h-63m63 0v38M85 389h63m-63 0v-38m260 38h-63m63 0v-38" fill="none" stroke="#e5eaf2a6"/><text x="215" y="177" fill="#eef3f9" font-size="33" text-anchor="middle" letter-spacing="9">感謝狀</text><text x="215" y="212" fill="#b3c0d2" font-size="9" text-anchor="middle" letter-spacing="3">WITH OUR APPRECIATION</text><path d="M110 253h210m-195 22h180m-165 22h150" stroke="#d5e1f128"/><path d="m198 333 17-23 17 23-17 23Z" fill="#f08200b3"/><path d="m206 348-4 28 13-8 13 8-4-28" fill="#e18b3373"/></svg>`;

const logoReveal=`<div class="event-logo-reveal" aria-hidden="true"><div class="event-logo-stage-backdrop"></div><div class="event-logo-aura"></div><div class="event-logo-3d"><div class="event-logo-flat-fallback">${etchedLogo}</div></div></div>`;
const ceremony=`<div class="event-ceremony-lights" aria-hidden="true"><i></i><i></i><i></i><div class="event-reveal-halo"></div><div class="event-reveal-wash"></div></div><svg class="event-tech-paths" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true"><path d="M0 692h196l70-52h244l98 60h190M1600 188h-147l-78 60h-132M1600 757h-190l-63-47h-294M555 900v-68l51-42h142"/><g><circle cx="510" cy="640" r="3"/><circle cx="1243" cy="248" r="3"/><circle cx="1053" cy="710" r="3"/><circle cx="748" cy="790" r="3"/></g></svg><div class="event-decade-rail" aria-hidden="true"><span>2016</span><div>${Array.from({length:11},(_,i)=>`<i style="--year-index:${i}"></i>`).join('')}</div><strong>2026</strong><small>十年積累 · 此刻啟新</small></div>`;

// Render original brand pixels with transparent SVG masks; no re-created lettering.
const partnerFilters=`<svg class="event-partner-filters" aria-hidden="true"><defs>
<clipPath id="event-gsd-oval" clipPathUnits="userSpaceOnUse"><ellipse cx="112" cy="88" rx="106.5" ry="67"/></clipPath>
<filter id="event-aplex-key" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 3 0 -.3"/></filter>
<filter id="event-white-key" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -2 -2 -2 0 6"/></filter>
</defs></svg>`;
function partnerLogo(partner){
  if(partner.style==='gsd')return `<svg viewBox="4 19 216 138" role="img" aria-label="${escape(partner.name)} Logo"><image href="${escape(partner.logo)}" width="801" height="170" clip-path="url(#event-gsd-oval)"/></svg>`;
  return `<img src="${escape(partner.logo)}" alt="${escape(partner.name)} Logo" decoding="async">`;
}

function partnerPlate(partner){return `<div class="event-partner-logo event-partner-logo--${escape(partner.style)}">${partnerLogo(partner)}</div>`;}

function copy(cue){
  const kicker=word=>`<p class="event-kicker">${word}</p>`;
  if(cue.kind==='opening')return `${ceremony}${logoReveal}${numeral}<div class="event-horizon-shade" aria-hidden="true"></div><div class="event-copy">${kicker('AIWIN · 10TH ANNIVERSARY / 2016—2026')}<h1 class="event-forum-heading">${escape(config.forum.name)}<em>${escape(config.forum.year)}</em></h1><div class="event-forum-theme"><p>${escape(config.forum.theme)}</p><p>${escape(config.forum.subtitle)}</p></div><div class="event-signature"><i></i>${escape(config.forum.label)}</div><button class="event-opening-replay" data-event-action="replay">重播揭幕 ↺</button></div>`;
  if(cue.kind==='address')return `<div class="event-address-mark" aria-hidden="true">10</div><div class="event-copy">${kicker('OPENING ADDRESS')}<p class="event-pretitle">從十年的積累，走向下一個可能。</p><h1>歡迎 <em>${escape(config.speaker)}</em></h1><p class="event-description">慧穩科技 · 致詞</p><div class="event-signature"><i></i>慧聚十載，穩步未來。</div></div><div class="event-speech-beam" aria-hidden="true"></div>`;
  if(cue.kind==='guest-speaker')return `<div class="event-address-mark" aria-hidden="true">10</div><section class="event-copy event-guest-speaker" aria-label="專題演講"><p class="event-kicker event-keynote-label">專題演講 <span lang="en">KEYNOTE</span><i class="event-keynote-trace" aria-hidden="true"></i></p><h1 class="event-speaker-topic-heading" aria-label="${escape(config.guestSpeaker.topic)}">企業 AI 從單點應用<br><em>走向智慧協作</em></h1><div class="event-speaker-details"><h2>${escape(config.guestSpeaker.name)}</h2><p>${escape(config.guestSpeaker.title)}</p></div></section><div class="event-speech-beam" aria-hidden="true"></div>`;
  if(cue.kind==='film')return `<div class="event-film-ten" aria-hidden="true">10</div><div class="event-centered">${kicker('A DECADE IN THE MAKING')}<h1>${escape(config.film.title)}</h1><p class="event-description">慧穩科技十週年影片</p><button class="event-film-play" data-event-action="play-film"><span aria-hidden="true">▷</span>播放十週年影片</button><p id="event-film-status" class="event-film-status" aria-live="polite"></p></div>`;
  if(cue.kind==='trophy')return `${partnerFilters}<div class="event-partner-spotlight" aria-hidden="true"></div>${trophy}<div class="event-partner-heading">${kicker('PARTNER RECOGNITION / 卓越合作夥伴')}<p class="event-invitation">敬邀上台</p><p class="event-partner-forum">AI Universe 2026 · AIWin 十週年高峰論壇</p><h1>卓越<em>合作夥伴</em></h1></div><div class="event-partner-stage" aria-label="已登場合作夥伴">${trophyProfiles.map((partner,i)=>`<article class="event-partner-slot" data-partner-index="${i}" aria-hidden="true" inert>${partnerPlate(partner)}<h2>${escape(partner.name)}</h2><div class="event-partner-plinth" aria-hidden="true"></div></article>`).join('')}</div><p class="event-partner-tribute">攜手走過十年 · 共創下一個智慧時代</p>`;
  if(cue.kind==='awards'||cue.kind==='certificates')return `${cue.kind==='awards'?trophy:certificate}<div class="event-copy">${kicker(cue.kind==='awards'?'PARTNER RECOGNITION':'WITH OUR APPRECIATION')}<h1>${cue.kind==='awards'?'致敬同行，<br><em>共創不凡。</em>':'每一份支持，<br><em>都值得被致謝。</em>'}</h1><p class="event-description">${cue.kind==='awards'?'合作夥伴頒獎典禮':'感謝狀致贈'}</p><p class="event-partner-line">${(cue.kind==='awards'?people:certificates).map(name=>`<span>${escape(name)}</span>`).join('')}</p></div>`;
  if(cue.kind==='certificate')return `${cue.kind==='trophy'?trophy:certificate}<div class="event-copy event-recipient-copy">${kicker(cue.kind==='trophy'?'PARTNER RECOGNITION / 合作夥伴頒獎':'WITH OUR APPRECIATION / 感謝狀致贈')}<p class="event-pretitle">敬邀上台</p><h1 class="event-recipient ${cue.name.length>10?'event-long-name':''}">${escape(cue.name)}</h1><p class="event-description">${cue.kind==='trophy'?'感謝並肩前行，共創十年精彩。':'感謝每一份支持，成就此刻的相聚。'}</p><div class="event-recipient-progress"><span>${String(cue.index+1).padStart(2,'0')}</span><i></i><small>${String(cue.total).padStart(2,'0')}</small></div></div>`;
  return `<div class="event-photo-ten" aria-hidden="true">10</div><div class="event-centered">${kicker('TOGETHER, INTO THE NEXT DECADE')}<p class="event-pretitle">十週年大合影</p><h1>十年同行，<em>感謝有你。</em></h1><p class="event-description">與每一位同行的你，共赴下一個十年。</p><div class="event-photo-partners">${[...new Set([...people,...certificates])].map(name=>`<span>${escape(name)}</span>`).join('')}</div><div class="event-signature"><i></i>慧穩科技 AIWin · 2016—2026<i></i></div></div>`;
}

export function createEventPrelude({onEnter=()=>{},onProduct=()=>{}}={}){
  const root=document.querySelector('#event-prelude');
  root.innerHTML=`<canvas class="event-starfield" aria-hidden="true"></canvas><div class="event-ribbons" aria-hidden="true"><i></i><i></i><i></i></div><header class="event-brand"><img src="./assets/aiwin-logo.png" alt="AIWin"><div>慧穩科技<small>10TH ANNIVERSARY · 2016—2026</small></div><span>慧聚十載 · 穩步未來</span></header><div id="event-slide" class="event-slide" aria-live="polite"></div><div class="event-film-screen" hidden><video controls playsinline preload="metadata" aria-label="十週年影片"></video><button data-event-action="close-film" aria-label="返回影片轉場">×</button></div><footer class="event-cuebar event-operator-ui"><button data-event-action="toggle-controls" aria-expanded="false">導播控制 <span>⌘</span></button><div><span id="event-cue-count"></span><span id="event-cue-label"></span></div><nav class="event-section-nav" aria-label="活動環節快速選單">${eventSections.map(section=>`<button data-event-action="jump-section" data-event-target="${section.id}">${section.label}</button>`).join('')}</nav><button data-event-action="previous" aria-label="上一個活動橋段">←</button><button data-event-action="next" aria-label="下一個活動橋段">→</button></footer><aside class="event-controls event-operator-ui" hidden aria-label="活動導播控制"><label>跳轉橋段<select id="event-cue-select" aria-label="跳轉橋段">${eventCues.map((cue,i)=>`<option value="${i}">${String(i+1).padStart(2,'0')} · ${escape(cue.label)}</option>`).join('')}<option value="product">接續 WinHub.AI 簡報</option></select></label><p id="event-cue-note"></p><label class="event-film-url-label">影片網址（MP4）<input id="event-film-url" type="url" placeholder="https://…/anniversary.mp4"></label><div class="event-control-actions"><button data-event-action="replay">重播本頁動畫 ↺</button><button data-event-action="preview-voyage">預覽宇宙轉場 ↗</button><button data-event-action="jump-film">影片入口 ↗</button><button data-event-action="load-film">選擇影片檔案</button><button data-event-action="apply-film-url">套用影片網址</button><button data-event-action="product">WinHub.AI 簡報 ↗</button><button data-event-action="clean">隱藏控制列（H）</button></div><p class="event-controls-hint">← → 手動推進 · H 顯示／隱藏控制 · F 全螢幕<br>影片由按鈕開始播放；播完後手動接頒獎。</p></aside><input id="event-film-input" type="file" accept="video/*" hidden>`;
  const slide=root.querySelector('#event-slide'),canvas=root.querySelector('canvas'),ctx=canvas.getContext('2d');
  const controls=root.querySelector('.event-controls'),select=root.querySelector('select'),video=root.querySelector('video'),screen=root.querySelector('.event-film-screen'),fileInput=root.querySelector('#event-film-input');
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  // Optional fixed poses for reviewing the actual renderer without editing its clock.
  const previewPose={universe:21.2,letters:24.6,launch:25.5,flight:27.7,discovery:30.5,dawn:31.8,orbit:33.0,final:39.5}[new URLSearchParams(location.search).get('opening-frame')];
  const fixedPreview=Number.isFinite(previewPose);
  const ceremonyEffects=createEventOpeningEffects();
  root.style.setProperty('--logo-duration',`${LOGO_REVEAL_SECONDS}s`);
  root.style.setProperty('--anniversary-delay',`${LOGO_REVEAL_SECONDS-1}s`);
  let revealStart=performance.now(),pendingStart=0,partnerStage=null;
  let current=0,active=false,raf=0,last=0,age=0,particles=[],width=1,height=1,blob='',filmSource=config.film.src,filmEnded=false;
  const idFor=hash=>{const id=String(hash).replace(/^#/,'');return eventCues.findIndex(cue=>cue.id===(id==='event-trophy-all'?'event-trophy-4':(id==='event-photo'||/^event-certificate-[1-7]$/.test(id))?'event-certificates':id));};
  function stopFilm(){video.pause();screen.hidden=true;root.classList.remove('event-playing');}
  function updateFilmStatus(message){const status=root.querySelector('#event-film-status');if(status)status.textContent=message??(filmEnded?'影片播放完畢 · 準備進入頒獎':filmSource?'影片已就緒':'');}
  function render(startAt=0){
    partnerStage?.settle();partnerStage=null;delete root.dataset.partnerPresenting;delete root.dataset.partnerAll;delete root.dataset.partnerLineup;
    const cue=eventCues[current];root.dataset.eventKind=cue.kind;if(cue.kind==='trophy')root.dataset.partnerLineup='true';if(cue.kind==='opening'&&fixedPreview)startAt=previewPose;
    if(cue.kind==='opening'){const brand=root.querySelector('.event-brand');brand.replaceWith(brand.cloneNode(true));}
    if(cue.kind==='opening'&&!media.matches&&!logo3DSettled())root.dataset.logoLoading='true';else delete root.dataset.logoLoading;
    slide.innerHTML='<div class="event-scene-cut" aria-hidden="true"></div>'+copy(cue);root.querySelector('#event-cue-label').textContent=cue.label;
    root.querySelector('#event-cue-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(eventCues.length).padStart(2,'0')}`;
    root.querySelector('#event-cue-note').textContent=cue.note;select.value=String(current);
    root.querySelector('[data-event-action=previous]').disabled=current===0;
    root.querySelector('[data-event-action=next]').setAttribute('aria-label',current===eventCues.length-1?'接續 WinHub.AI 簡報':'下一個活動橋段');
    if(cue.kind==='trophy'){partnerStage=createPartnerStage(slide.querySelector('.event-partner-stage'),{reducedMotion:media.matches});partnerStage.show(cue.index);}
    updateFilmStatus();age=0;pendingStart=startAt;revealStart=performance.now()-startAt/OPENING_PLAYBACK_RATE*1000;
    if(cue.kind==='opening')ceremonyEffects.prepare(slide.querySelector('.event-ten'),innerWidth,innerHeight);
    for(const animation of root.getAnimations({subtree:true})){animation.playbackRate=cue.kind==='opening'?OPENING_PLAYBACK_RATE:1;if(startAt)animation.currentTime=startAt*1000;if(cue.kind==='opening'&&fixedPreview)animation.pause();}
  }
  function show(index,{hash=true}={}){
    const previousCue=eventCues[current];
    const nextIndex=Math.max(0,Math.min(eventCues.length-1,index));
    const keepPartnerStage=active&&previousCue.kind==='trophy'&&eventCues[nextIndex].kind==='trophy'&&slide.querySelector('.event-partner-stage');
    current=nextIndex;onEnter(eventCues[current]);
    controls.hidden=true;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','false');
    active=true;root.hidden=false;document.body.dataset.eventActive='true';
    window.scrollTo({top:0,left:0,behavior:'instant'});stopFilm();
    if(keepPartnerStage){
      const cue=eventCues[current];
      partnerStage.show(cue.index,{animate:cue.index>previousCue.index});
      root.querySelector('#event-cue-label').textContent=cue.label;
      root.querySelector('#event-cue-count').textContent=`${String(current+1).padStart(2,'0')} / ${String(eventCues.length).padStart(2,'0')}`;
      root.querySelector('#event-cue-note').textContent=cue.note;select.value=String(current);
    }else render();
    for(const button of root.querySelectorAll('.event-section-nav button')){
      const section=eventSections.find(item=>item.id===button.dataset.eventTarget);
      if(section.kinds.includes(eventCues[current].kind))button.setAttribute('aria-current','step');
      else button.removeAttribute('aria-current');
    }
    if(hash)history.replaceState(null,'',`#${eventCues[current].id}`);
    if(!raf){resize();if(eventCues[current].kind==='trophy')partnerStage?.show(eventCues[current].index);last=performance.now();raf=requestAnimationFrame(draw);}
  }
  function hide(){partnerStage?.settle();active=false;cancelAnimationFrame(raf);raf=0;stopFilm();root.hidden=true;delete document.body.dataset.eventActive;delete root.dataset.clean;controls.hidden=true;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','false');}
  function next(){if(current===eventCues.length-1){hide();onProduct();}else show(current+1);}
  function previous(){if(current>0)show(current-1);}
  async function playFilm(){
    if(!filmSource){controls.hidden=false;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','true');updateFilmStatus('影片尚未置入，請於導播控制選擇影片檔案或套用影片網址。');return;}
    if(video.getAttribute('src')!==filmSource)video.src=filmSource;
    if(config.film.poster)video.poster=config.film.poster;
    screen.hidden=false;root.classList.add('event-playing');filmEnded=false;
    try{await video.play();}catch{if(!screen.hidden)updateFilmStatus('請按播放器上的播放鍵。');}
  }
  function resize(){
    partnerStage?.resize();
    width=innerWidth;height=innerHeight;const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);
    let seed=201626;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    if(eventCues[current].kind==='opening')ceremonyEffects.prepare(slide.querySelector('.event-ten'),width,height);
    particles=Array.from({length:Math.min(190,Math.round(width*height/11000))},()=>({x:random(),y:random(),r:.4+random()*.8,a:.15+random()*.5,s:.8+random()*1.8}));
  }
  function draw(now){
    if(!active){raf=0;return;}raf=requestAnimationFrame(draw);
    const dt=Math.min(.05,(now-last)/1000);last=now;if(document.hidden||!screen.hidden)return;
    age+=dt;ctx.clearRect(0,0,width,height);
    const stillStars=media.matches||['trophy','guest-speaker'].includes(eventCues[current].kind);
    for(const p of particles){const y=(p.y-(stillStars?0:age*.0016*p.s)+1)%1;ctx.globalAlpha=p.a*(stillStars?1:.7+.3*Math.sin(age*.5+p.x*9));ctx.fillStyle='#dbe6f6';ctx.beginPath();ctx.arc(p.x*width,y*height,p.r,0,Math.PI*2);ctx.fill();}
    ctx.globalAlpha=1;
    if(eventCues[current].kind==='opening'&&!media.matches){
      if(root.dataset.logoLoading){revealStart=now;if(logo3DSettled()){revealStart=now-pendingStart/OPENING_PLAYBACK_RATE*1000;delete root.dataset.logoLoading;}}
      const time=fixedPreview?previewPose:(now-revealStart)/1000*OPENING_PLAYBACK_RATE;drawLogo3D(slide.querySelector('.event-logo-3d'),time);if(root.dataset.cosmicTen!=='true')ceremonyEffects.draw(ctx,time-(LOGO_REVEAL_SECONDS-1));}
    if(media.matches){cancelAnimationFrame(raf);raf=0;}
  }
  const clean=()=>{root.dataset.clean=root.dataset.clean==='true'?'false':'true';if(root.contains(document.activeElement))document.activeElement.blur?.();controls.hidden=true;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','false');};
  root.addEventListener('pointermove',event=>{if(root.dataset.clean==='true'&&event.clientY>innerHeight-65)root.dataset.clean='false';});
  root.addEventListener('focusin',event=>{if(event.target.closest('.event-cuebar'))root.dataset.clean='false';});
  root.addEventListener('click',event=>{
    const action=event.target.closest('[data-event-action]')?.dataset.eventAction;if(!action)return;
    if(action==='jump-section'){show(idFor(event.target.closest('[data-event-target]').dataset.eventTarget));return;}
    if(action==='next')next();if(action==='previous')previous();
    if(action==='toggle-controls'){controls.hidden=!controls.hidden;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded',String(!controls.hidden));}
    if(action==='replay')render();if(action==='preview-voyage'){if(current!==0)show(0);render(20.7);controls.hidden=true;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','false');}if(action==='jump-film')show(idFor('event-film'));
    if(action==='play-film')playFilm();if(action==='close-film')stopFilm();if(action==='load-film')fileInput.click();
    if(action==='apply-film-url'){
      const value=root.querySelector('#event-film-url').value.trim();
      try{const url=new URL(value,location.href);if(!value||!['http:','https:'].includes(url.protocol))throw new Error('Invalid URL');filmSource=url.href;filmEnded=false;if(eventCues[current].kind!=='film')show(idFor('event-film'));updateFilmStatus('影片網址已就緒，按播放開始。');}
      catch{if(eventCues[current].kind!=='film')show(idFor('event-film'));updateFilmStatus('請輸入可直接播放的 MP4 影片網址。');}
    }
    if(action==='product'){hide();onProduct();}if(action==='clean')clean();
  });
  select.addEventListener('change',()=>{if(select.value==='product'){hide();onProduct();}else show(Number(select.value));});
  fileInput.addEventListener('change',()=>{
    const file=fileInput.files[0];if(!file)return;if(blob)URL.revokeObjectURL(blob);blob=URL.createObjectURL(file);filmSource=blob;filmEnded=false;
    if(eventCues[current].kind!=='film')show(idFor('event-film'));updateFilmStatus('影片已就緒，按播放開始。');
  });
  video.addEventListener('ended',()=>{filmEnded=true;stopFilm();updateFilmStatus();});
  video.addEventListener('error',()=>{stopFilm();updateFilmStatus('影片無法載入，請於導播控制重新選擇影片。');});
  document.addEventListener('keydown',event=>{
    if(!active||event.metaKey||event.ctrlKey||event.altKey)return;
    const key=event.key.toLowerCase();
    if(key==='escape'){event.preventDefault();event.stopImmediatePropagation();if(!screen.hidden)stopFilm();else{controls.hidden=true;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','false');}return;}
    if(/INPUT|SELECT|TEXTAREA/.test(event.target.tagName))return;
    if(!screen.hidden){if(key==='escape'){event.preventDefault();event.stopImmediatePropagation();stopFilm();}else event.stopImmediatePropagation();return;}
    if(['arrowright','pagedown',' ','arrowleft','pageup','home','end','h','p','f','escape'].includes(key)){
      if(key===' '&&event.target.closest('button'))return;event.preventDefault();event.stopImmediatePropagation();
      if(['arrowright','pagedown',' '].includes(key))next();if(['arrowleft','pageup'].includes(key))previous();
      if(key==='home')show(0);if(key==='end')show(eventCues.length-1);if(key==='h'||key==='p')clean();
      if(key==='escape'){controls.hidden=true;root.querySelector('[data-event-action=toggle-controls]').setAttribute('aria-expanded','false');}
      if(key==='f'){const task=document.fullscreenElement?document.exitFullscreen?.():document.documentElement.requestFullscreen?.();task?.catch(()=>{});}
    }
  },true);
  window.addEventListener('resize',()=>{if(active){resize();if(media.matches)draw(performance.now());}});
  window.addEventListener('hashchange',()=>{const index=idFor(location.hash);if(index>=0)show(index,{hash:false});});
  return {show,hide,route(hash){const index=idFor(hash);if(index<0)return false;show(index,{hash:false});return true;},get active(){return active;}};
}
