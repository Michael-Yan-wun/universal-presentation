import { createOpeningFilm } from './opening-film.js?v=light-flight-3';

const clamp=value=>Math.min(1,Math.max(0,value));
const smooth=(a,b,t)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
const flightTrim=1.8;
const duration=12.8-flightTrim;

export function createOpening({onTime=()=>{}}={}) {
  const overlay=document.querySelector('#opening-cinema');
  const skip=document.querySelector('#opening-skip');
  const filmLayer=overlay.querySelector('.opening-film');
  const brand=overlay.querySelector('#opening-brand');
  const brandImage=brand.querySelector('img');
  const brandLight=overlay.querySelector('.opening-brand-light');
  const sparkLayer=brand.querySelector('.opening-brand-sparks');
  const sparks=[[-.18,.34],[.03,.13],[.32,-.08],[.76,.12],[1.12,.34],[1.07,.71],[.81,.93],[.16,.85],[-.11,.64]].map(([x,y],index)=>{
    const element=document.createElement('i');
    element.className='opening-brand-spark';
    element.style.left=`${x*100}%`;element.style.top=`${y*100}%`;
    sparkLayer.append(element);
    return {element,x,y,start:7.55+(index%4)*.14};
  });
  const media=matchMedia('(prefers-reduced-motion: reduce)');
  let film, raf=0, elapsed=0, last=0, active=false, targets=[], token=0;
  function cleanup() {
    token++;cancelAnimationFrame(raf);raf=0;active=false;
    overlay.hidden=true;skip.hidden=true;
    brand.style.opacity='0';brand.style.removeProperty('transform');brandLight.style.opacity='0';filmLayer.style.opacity='1';
    ['--brand-energy','--brand-sweep','--sweep-shift'].forEach(property=>brand.style.removeProperty(property));
    sparks.forEach(({element})=>{element.style.opacity='0';element.style.removeProperty('transform');});
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
    if(document.hidden){last=ms;raf=requestAnimationFrame(frame);return;}
    elapsed+=Math.min((ms-last)/1000,.06);last=ms;
    // Trim only the star-flight interval; the aperture and later logo cues keep their pacing.
    const t=elapsed+flightTrim*smooth(2.4,4.3,elapsed);
    onTime(Math.max(0,t-9.1));
    overlay.style.setProperty('--opening-progress',String(clamp(elapsed/duration)));
    const arrive=smooth(7.5,8.35,t),depart=smooth(9.35,10.35,t);
    const heroScale=.86+.14*smooth(7.5,8.65,t);
    // The logo now dissolves in place; interior pages have no header logo to dock into.
    brand.style.opacity=String(arrive*(1-depart));
    brand.style.transform=`translate(-50%,-50%) scale(${heroScale})`;
    brandLight.style.opacity=String(arrive*(1-depart));
    // Every accent shares the film clock, so replay, skip and page changes reset together.
    const effectsExit=1-smooth(9.15,9.6,t);
    const ignition=Math.sin(Math.PI*smooth(7.5,8.65,t));
    brand.style.setProperty('--brand-energy',String((.38+.62*ignition)*effectsExit));
    brand.style.setProperty('--brand-sweep',String(smooth(7.9,8.1,t)*(1-smooth(8.95,9.2,t))*.7));
    brand.style.setProperty('--sweep-shift',`${-180+460*smooth(7.9,9.15,t)}%`);
    sparks.forEach(({element,x,y,start})=>{
      const p=smooth(start,start+1.45,t);
      const travel=(1-p)*44;
      element.style.opacity=String(Math.sin(Math.PI*p)*effectsExit*.85);
      element.style.transform=`translate3d(${(x-.5)*travel}px,${(y-.45)*travel}px,0) scale(${.6+.6*Math.sin(Math.PI*p)})`;
    });
    // Fade the film and its black backing together, independently of the logo.
    filmLayer.style.opacity=String(1-smooth(9.35,10.35,t));
    if(t<10.35)film.render(t);
    document.body.dataset.opening=t<9.8?'cosmos':'reveal';
    targets.forEach(({element,start,shift=0})=>{
      const p=smooth(start,start+1.2,t);
      element.style.opacity=String(p);
      if(shift)element.style.transform=`translate3d(0,${shift*(1-p)}px,0)`;
    });
    if(t>11.3)document.querySelector('#story').inert=false;
    if(elapsed>=duration){finish();return;}
    raf=requestAnimationFrame(frame);
  }
  async function start() {
    cleanup();
    if(media.matches){onTime(20);return;}
    const ticket=token;
    elapsed=0;active=true;
    document.body.dataset.opening='cosmos';overlay.hidden=false;skip.hidden=false;
    overlay.style.opacity='1';
    const select=(selector,start,shift=0)=>document.querySelectorAll(selector).forEach(element=>targets.push({element,start,shift}));
    select('.intro-story .eyebrow',10.5,12);
    select('.intro-title-line:first-child>span',10.65,44);
    select('.intro-title-line:last-child>span',10.85,44);
    select('.intro-story .story-copy',11.05,18);
    select('.intro-story .story-actions',11.35,12);
    select('.intro-story .opening-replay',11.5,8);
    select('#experience[data-kind=intro] #scene',9.35);
    select('#experience[data-kind=intro] .scene-topline,#experience[data-kind=intro] .sculpture-caption',11.1);
    targets.forEach(({element,shift})=>{element.style.opacity='0';if(shift)element.style.transform=`translate3d(0,${shift}px,0)`;});
    document.querySelector('#story').inert=true;
    try{film??=createOpeningFilm(overlay.querySelector('canvas'));await Promise.all([film.ready,brandImage.decode()]);}
    catch(error){if(ticket===token){console.warn('Opening assets unavailable; showing cover.',error);finish();}return;}
    if(ticket!==token||!active)return;
    film.resize();film.render(0);last=performance.now();raf=requestAnimationFrame(frame);
  }
  skip.addEventListener('click',finish);
  document.addEventListener('keydown',event=>{if(active&&event.key==='Escape'){event.preventDefault();finish();}});
  const resize=()=>{if(active)film?.resize();};window.addEventListener('resize',resize);
  media.addEventListener('change',()=>{if(active&&media.matches)finish();});
  return {start,stop:cleanup,finish,dispose(){cleanup();film?.dispose();window.removeEventListener('resize',resize);}};
}
