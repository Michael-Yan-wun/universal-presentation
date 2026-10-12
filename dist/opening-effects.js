import { openingCues as cues } from './opening-cues.js?v=refined-logo-22';
const clamp=value=>Math.min(1,Math.max(0,value));
const smooth=(a,b,t)=>{const p=clamp((t-a)/(b-a));return p*p*(3-2*p);};
const choices=[['light','曜光顯影'],['glass','晶透折光'],['dust','微粒凝光']];
const legacy={signal:'light',scan:'glass',shards:'dust'};

// The selected glass treatment is also the default for the full presentation.
export function createOpeningEffects(brand,image,onReplay){
  const query=new URL(location.href),preview=query.searchParams.has('opening-effect');
  const requested=query.searchParams.get('opening-effect');
  let mode=preview?(legacy[requested]||requested):'glass';
  if(!choices.some(([id])=>id===mode))mode='glass';
  if(preview&&requested!==mode){query.searchParams.set('opening-effect',mode);history.replaceState(null,'',query);}
  const toolbar=document.querySelector('#opening-effects-toolbar');
  toolbar.hidden=!preview;
  toolbar.innerHTML=`<div class="opening-effects-title"><span>品牌揭幕 · 三款預覽</span><button type="button" data-opening-full>完整開場 ↗</button></div><div class="opening-effects-choices" role="group" aria-label="Logo 特效">${choices.map(([id,label],i)=>`<button type="button" data-opening-effect="${id}" aria-pressed="${id===mode}"><span>0${i+1}</span>${label}</button>`).join('')}</div><p>太陽收尾 → Logo 揭幕 → 封面品牌定位</p>`;

  const stage=document.createElement('div');stage.className='opening-refined-stage';stage.setAttribute('aria-hidden','true');
  stage.innerHTML='<div class="opening-satin-light"></div><div class="opening-glass-plane plane-one"></div><div class="opening-glass-plane plane-two"></div><div class="opening-logo-luster"><span></span></div><canvas class="opening-logo-dust"></canvas>';
  brand.append(stage);
  const satin=stage.querySelector('.opening-satin-light');
  const planes=[...stage.querySelectorAll('.opening-glass-plane')];
  const luster=stage.querySelector('.opening-logo-luster');
  const canvas=stage.querySelector('canvas'),context=canvas.getContext('2d');
  let points=[],dustReady=false;
  // Sample the user's transparent logo solely to anchor tiny animation particles.
  // No new image is saved and no color replacements are applied to the original.
  const ready=image.decode().then(()=>{
    const sample=document.createElement('canvas');sample.width=image.naturalWidth;sample.height=image.naturalHeight;
    const ctx=sample.getContext('2d',{willReadFrequently:true});ctx.drawImage(image,0,0);
    const {data}=ctx.getImageData(0,0,sample.width,sample.height);
    let seed=6116;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};
    for(let y=3;y<sample.height;y+=5)for(let x=3;x<sample.width;x+=5){
      const i=(y*sample.width+x)*4;if(data[i+3]<150)continue;
      const lit=[data[i],data[i+1],data[i+2]].map(channel=>Math.round(channel+(255-channel)*.18));
      points.push({x:x/sample.width,y:y/sample.height,dx:(random()-.5)*.065,dy:(random()-.5)*.045,r:.65+random()*.45,a:.68+random()*.27,color:`rgb(${lit.join(',')})`});
    }
    dustReady=true;resize();
  });
  function resize(){
    const width=brand.offsetWidth,height=brand.offsetHeight;if(!width||!height)return;
    const dpr=Math.min(devicePixelRatio||1,2);
    canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
  }
  function configure(){
    brand.dataset.effect=mode;
    toolbar.querySelectorAll('[data-opening-effect]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.openingEffect===mode)));
  }
  function reset(){
    image.style.removeProperty('opacity');image.style.removeProperty('mask-image');image.style.removeProperty('transform');
    stage.style.opacity='0';satin.style.opacity='0';luster.style.opacity='0';canvas.style.opacity='0';
    planes.forEach(plane=>{plane.style.opacity='0';plane.style.removeProperty('transform');});
  }
  function update(t){
    const p=smooth(cues.logoStart,cues.logoReady,t),end=1-smooth(11.35,cues.dockStart,t);
    // A completely clean frame precedes the brand entrance after the sun goes out.
    stage.style.opacity=String(smooth(cues.logoStart,cues.logoStart+.35,t)*end);
    if(mode==='light'){
      const front=-32+166*p;
      image.style.maskImage=`linear-gradient(135deg,#000 ${front-14}%,transparent ${front+14}%)`;
      image.style.opacity=String(smooth(cues.logoStart,cues.logoStart+.35,t));
      satin.style.opacity=String(Math.sin(Math.PI*p)*.38);
      satin.style.transform=`translate3d(${-12+24*p}px,${10-20*p}px,0) rotate(-18deg)`;
      luster.style.opacity=String(Math.sin(Math.PI*p)*.22);
      luster.style.setProperty('--luster-x',`${-135+290*p}%`);
    }else if(mode==='glass'){
      image.style.opacity=String(smooth(cues.logoStart+.15,cues.logoReady-.25,t));
      image.style.transform=`perspective(900px) rotateY(${(1-p)*-3}deg) translateY(${(1-p)*5}px)`;
      planes.forEach((plane,i)=>{
        plane.style.opacity=String(Math.sin(Math.PI*p)*(.18-i*.04));
        plane.style.transform=`translate3d(${(i?-1:1)*(1-p)*24}px,${(1-p)*(i?-9:9)}px,0) rotate(${i?16:-16}deg)`;
      });
      luster.style.opacity=String(Math.sin(Math.PI*p)*.34);
      luster.style.setProperty('--luster-x',`${-120+275*p}%`);
    }else if(mode==='dust'){
      const settle=smooth(cues.logoStart,cues.logoReady-.25,t),handoff=smooth(cues.logoReady-.65,cues.logoReady+.05,t);
      image.style.opacity=String(Math.max(.1*settle,handoff));
      canvas.style.opacity=String((1-handoff)*smooth(cues.logoStart,cues.logoStart+.45,t));
      if(!dustReady)return;
      const width=brand.offsetWidth,height=brand.offsetHeight;
      context.clearRect(0,0,width,height);
      for(const point of points){
        const x=(point.x+point.dx*(1-settle))*width,y=(point.y+point.dy*(1-settle))*height;
        context.globalAlpha=point.a*(.65+.35*settle);context.fillStyle=point.color;
        context.beginPath();context.arc(x,y,point.r,0,Math.PI*2);context.fill();
      }
      context.globalAlpha=1;
      luster.style.opacity=String(Math.sin(Math.PI*handoff)*.16);
      luster.style.setProperty('--luster-x',`${-80+220*handoff}%`);
    }
  }
  const select=event=>{
    const button=event.target.closest('button');if(!button)return;
    if(button.hasAttribute('data-opening-full')){onReplay({full:true});return;}
    const value=button.dataset.openingEffect;if(!choices.some(([id])=>id===value))return;
    reset();mode=value;configure();
    const url=new URL(location.href);url.searchParams.set('opening-effect',mode);history.replaceState(null,'',url);
    onReplay({full:false});
  };
  toolbar.addEventListener('click',select);configure();reset();
  return {ready,resize,preview,get mode(){return mode;},update,reset,dispose(){reset();toolbar.removeEventListener('click',select);stage.remove();}};
}
