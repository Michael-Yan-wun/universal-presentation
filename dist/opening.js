import { createOpeningFilm } from './opening-film.js?v=sun-finish-22';
import { createOpeningEffects } from './opening-effects.js?v=glass-cool-24';

const clamp=value=>Math.min(1,Math.max(0,value));
const smooth=(a,b,t)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
import { openingCues as cues } from './opening-cues.js?v=refined-logo-22';
const flightTrim=cues.flightTrim;
const duration=cues.finish-flightTrim;

export function createOpening({onTime=()=>{},onOcclusion=()=>{}}={}) {
  const overlay=document.querySelector('#opening-cinema');
  const skip=document.querySelector('#opening-skip');
  const filmLayer=overlay.querySelector('.opening-film');
  const filmCanvas=filmLayer.querySelector('canvas');
  const brand=overlay.querySelector('#opening-brand');
  const brandImage=brand.querySelector('img');
  const coverLogo=document.querySelector('#cover-brand-logo');
  const effects=createOpeningEffects(brand,brandImage,options=>start(options));
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let film, raf=0, elapsed=0, last=0, active=false, running=false, targets=[], token=0, dock=null, completionTimer=0, loadingTimer=0;
  function resetScroll(){
    history.scrollRestoration='manual';
    window.scrollTo({top:0,left:0,behavior:'instant'});
  }
  function armCompletion(){
    clearTimeout(completionTimer);
    if(active&&running&&!document.hidden)completionTimer=setTimeout(finish,Math.max(0,duration-elapsed)*1000+200);
  }
  function measureDock(){
    const rect=coverLogo.getBoundingClientRect();
    if(!rect.width||!brand.offsetWidth){dock=null;return;}
    dock={x:rect.left+rect.width/2,y:rect.top+rect.height/2,scale:rect.width/brand.offsetWidth,originX:brand.offsetLeft,originY:brand.offsetTop};
  }
  function cleanup() {
    token++;cancelAnimationFrame(raf);raf=0;active=running=false;
    clearTimeout(completionTimer);clearTimeout(loadingTimer);
    overlay.hidden=true;skip.hidden=true;
    brand.style.opacity='0';brand.style.removeProperty('transform');filmLayer.style.opacity='1';
    coverLogo.style.removeProperty('opacity');dock=null;
    effects.reset();
    onOcclusion(false);
    delete document.body.dataset.opening;
    targets.forEach(({element})=>{element.style.removeProperty('opacity');element.style.removeProperty('transform');});
    targets=[];
    document.querySelector('#story').inert=false;
  }
  function finish() {
    const focused=skip===document.activeElement;
    cleanup();onTime(20);
    if(focused)document.querySelector('.intro-story .opening-replay')?.focus({preventScroll:true});
  }
  function frame(ms) {
    if(!active)return;
    if(document.hidden){raf=requestAnimationFrame(frame);return;}
    try{
    // Use visible elapsed time: a dropped frame must not stretch the film indefinitely.
    elapsed+=Math.max(0,(ms-last)/1000);last=ms;
    if(elapsed>=duration){finish();return;}
    // Trim only the star-flight interval; the aperture and later logo cues keep their pacing.
    const t=elapsed+flightTrim*smooth(2.4,4.3,elapsed);
    onOcclusion(t<cues.dockStart);
    onTime(Math.max(0,t-11.7));
    overlay.style.setProperty('--opening-progress',String(clamp(elapsed/duration)));
    const arrive=smooth(cues.logoStart,cues.logoStart+.35,t);
    const heroScale=.96+.04*smooth(cues.logoStart,cues.logoReady,t);
    // Keep the original logo visible as it shrinks into the cover's exact image box.
    // Reveal the static copy only during the last part of the handoff, avoiding a gap.
    const travel=smooth(cues.dockStart,cues.dockEnd,t),handoff=smooth(cues.dockEnd-.2,cues.dockEnd,t);
    const dx=dock?(dock.x-dock.originX)*travel:0,dy=dock?(dock.y-dock.originY)*travel:0;
    const scale=dock?heroScale+(dock.scale-heroScale)*travel:heroScale;
    brand.style.opacity=String(arrive*(1-handoff));
    brand.style.transform=`translate3d(${dx}px,${dy}px,0) translate(-50%,-50%) scale(${scale})`;
    coverLogo.style.opacity=String(handoff);
    effects.update(t);
    // Fade the film and its black backing together, independently of the logo.
    filmLayer.style.opacity=String(1-smooth(cues.dockStart,cues.filmFadeEnd,t));
    if(t<cues.filmFadeEnd)film.render(t);
    document.body.dataset.opening=t<cues.headerStart?'cosmos':'reveal';
    overlay.dataset.phase=t<cues.sunEnd?'sunrise':t<cues.logoStart?'settled':t<cues.dockStart?'logo':t<cues.dockEnd?'dock':'cover';
    targets.forEach(({element,start,shift=0})=>{
      const p=smooth(start,start+1.2,t);
      element.style.opacity=String(p);
      if(shift)element.style.transform=`translate3d(0,${shift*(1-p)}px,0)`;
    });
    if(t>13.8)document.querySelector('#story').inert=false;
    raf=requestAnimationFrame(frame);
    }catch(error){console.warn('Opening playback interrupted; showing cover.',error);finish();}
  }
  async function start({full=false}={}) {
    cleanup();
    if(media.matches){onTime(20);return;}
    const ticket=token;
    elapsed=effects.preview&&!full?4.2:0;active=true;
    document.body.dataset.opening='cosmos';overlay.hidden=false;skip.hidden=false;
    resetScroll();onOcclusion(true);
    coverLogo.style.opacity='0';
    overlay.style.opacity='1';
    const select=(selector,start,shift=0)=>document.querySelectorAll(selector).forEach(element=>targets.push({element,start,shift}));
    select('.intro-story .eyebrow',13.15,12);
    select('.intro-title-line:first-child>span',13.2,44);
    select('.intro-title-line:last-child>span',13.35,44);
    select('.intro-story .story-copy',13.55,18);
    select('.intro-story .story-actions',13.7,12);
    select('.intro-story .opening-replay',13.8,8);
    select('#experience[data-kind=intro] #scene',cues.dockStart);
    select('#experience[data-kind=intro] .scene-topline,#experience[data-kind=intro] .sculpture-caption',13.55);
    targets.forEach(({element,shift})=>{element.style.opacity='0';if(shift)element.style.transform=`translate3d(0,${shift}px,0)`;});
    document.querySelector('#story').inert=true;
    try{
      film??=createOpeningFilm(filmCanvas);
      await Promise.race([
        Promise.all([film.ready,brandImage.decode(),effects.ready]),
        new Promise((_,reject)=>{loadingTimer=setTimeout(()=>reject(new Error('Opening assets timed out')),8000);})
      ]);
      if(ticket!==token||!active)return;
      clearTimeout(loadingTimer);resetScroll();
      film.resize();measureDock();effects.resize();film.render(elapsed+flightTrim*smooth(2.4,4.3,elapsed));
      last=performance.now();running=true;armCompletion();raf=requestAnimationFrame(frame);
    }catch(error){if(ticket===token){console.warn('Opening unavailable; showing cover.',error);finish();}}
  }
  const visibilityChanged=()=>{
    if(!active||!running)return;
    const now=performance.now();
    if(document.hidden){elapsed+=Math.max(0,(now-last)/1000);clearTimeout(completionTimer);}
    last=now;
    if(!document.hidden)armCompletion();
  };
  const contextLost=event=>{event.preventDefault();if(active)finish();};
  const keydown=event=>{if(active&&event.key==='Escape'){event.preventDefault();finish();}};
  const motionChanged=()=>{if(active&&media.matches)finish();};
  skip.addEventListener('click',finish);
  document.addEventListener('keydown',keydown);
  document.addEventListener('visibilitychange',visibilityChanged);
  filmCanvas.addEventListener('webglcontextlost',contextLost);
  const resize=()=>{if(active){film?.resize();measureDock();effects.resize();}};window.addEventListener('resize',resize);
  media.addEventListener('change',motionChanged);
  return {start,stop:cleanup,finish,dispose(){cleanup();effects.dispose();film?.dispose();window.removeEventListener('resize',resize);skip.removeEventListener('click',finish);document.removeEventListener('keydown',keydown);document.removeEventListener('visibilitychange',visibilityChanged);filmCanvas.removeEventListener('webglcontextlost',contextLost);media.removeEventListener('change',motionChanged);}};
}
