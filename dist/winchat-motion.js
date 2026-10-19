import {winChatBrain} from './winchat-brain.js?v=winchat-launch-1';
import {winChatTravelSeconds} from './winchat-script.js?v=keynote-flow-1';

// Coordinates in the SVG's own viewBox. Camera movement follows the region,
// rather than scaling every topic around the same center.
export const winChatFocusPoints=[[280,205],[520,200],[400,330]];
export function createWinChatStage({root,story,detail}){
 let previous=null,active=null;
 const duration=winChatTravelSeconds*1000;
 const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
 function stop(){if(active){const motion=active;active=null;motion.animations.forEach(a=>a.cancel());motion.layer.remove();}delete root.dataset.winchatMotion;}
 function reset(){stop();previous=null;story.style.removeProperty('animation');}
 function paint(state,ui){
  story.hidden=Boolean(ui.fullStage||state.phase==='fusing');root.dataset.winchatLayout=ui.layout||'overview';
  if(detail.dataset.winchatView!==ui.key){story.innerHTML=ui.story;detail.innerHTML=ui.detail;detail.dataset.winchatView=ui.key;}
 }
 function moveContent(element,layer,className,rootRect){
  if(element.hidden||!element.childElementCount)return null;
  const rect=element.getBoundingClientRect(),ghost=document.createElement('div');
  ghost.className=className;
  Object.assign(ghost.style,{position:'absolute',left:`${rect.left-rootRect.left}px`,top:`${rect.top-rootRect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`});
  ghost.append(...element.childNodes);layer.append(ghost);return ghost;
 }
 function travel(state,ui,returning){
  stop();
  const rootRect=root.getBoundingClientRect(),layer=document.createElement('div');
  layer.className='wc-travel-layer';layer.setAttribute('aria-hidden','true');layer.inert=true;
  root.append(layer);
  const camera=document.createElement('div');camera.className='wc-travel-camera';layer.append(camera);
  const entry=previous?.phase==='overview';
  const existing=entry?detail.querySelector('.wc-overview-visual'):null;
  let visual;
  if(existing){
   // Move the actual organ; retain its current pose and neural animation phase.
   const rect=existing.getBoundingClientRect();visual=existing;
   Object.assign(visual.style,{left:`${rect.left-rootRect.left}px`,top:`${rect.top-rootRect.top}px`,width:`${rect.width}px`,height:`${rect.height}px`,right:'auto',animation:'none'});
   camera.append(visual);
  }else{
   visual=document.createElement('div');visual.className='wc-overview-visual';
   visual.innerHTML=winChatBrain({active:state.selected,mode:'travel'});camera.append(visual);
  }
  const organ=visual.querySelector('.wc-mind-organ');
  const pose=getComputedStyle(organ).transform;organ.style.animation='none';organ.style.transform=pose;
  visual.querySelector('.wc-mind-scene').dataset.active=returning?-1:state.selected;
  const oldStory=moveContent(story,layer,'wc-outgoing-story',rootRect);
  const oldDetail=moveContent(detail,layer,'wc-outgoing-detail',rootRect);
  // Regions are projected through the SVG matrix so the travel remains accurate
  // at both keynote resolutions and while the brain is gently tilted.
  const matrix=organ.getScreenCTM();
  const project=index=>{
   const [x,y]=winChatFocusPoints[Math.max(0,index)],point=organ.createSVGPoint();point.x=x;point.y=y;
   const screen=point.matrixTransform(matrix);return {x:screen.x-rootRect.left,y:screen.y-rootRect.top};
  };
  const focus=index=>{
   const p=project(index),scale=3.45;
   return `translate(${rootRect.width*.52-p.x*scale}px,${rootRect.height*.51-p.y*scale}px) scale(${scale})`;
  };
  const target=returning?'none':focus(state.selected);
  let cameraFrames;
  if(entry)cameraFrames=[{transform:'none',opacity:1,offset:0},{transform:'none',opacity:1,offset:.08},{transform:target,opacity:1,offset:.8},{transform:target,opacity:0,offset:1}];
  else if(returning)cameraFrames=[{transform:focus(previous.selected),opacity:0,offset:0},{opacity:1,offset:.18},{transform:'none',opacity:1,offset:.8},{transform:'none',opacity:0,offset:1}];
  else cameraFrames=[{transform:focus(previous.selected),opacity:0,offset:0},{transform:'scale(1.05)',opacity:1,offset:.38},{transform:target,opacity:1,offset:.82},{transform:target,opacity:0,offset:1}];
  paint(state,ui);
  const animations=[],motion={layer,animations};active=motion;root.dataset.winchatMotion='travel';
  const animate=(node,frames,options)=>{if(!node)return;const a=node.animate(frames,options);animations.push(a);return a;};
  const timing={duration,fill:'both',easing:'cubic-bezier(.4,0,.2,1)'};
  const cameraAnimation=animate(camera,cameraFrames,timing);
  for(const old of [oldStory,oldDetail])animate(old,[{opacity:1,transform:'none'},{opacity:0,transform:entry?'translateX(-24px)':'scale(.97)'}],{duration:entry?600:500,fill:'both',easing:'ease-in-out'});
  for(const label of visual.querySelectorAll('.wc-mind-labels,.wc-brain-heading,.wc-brain-agent'))animate(label,[{opacity:1},{opacity:0}],{duration:500,fill:'both'});
  const incoming=[...detail.children,...(story.hidden?[]:[story])];
  for(const node of incoming){node.style.animation='none';animate(node,[{opacity:0,transform:'scale(.975)'},{opacity:1,transform:'none'}],{duration:780,delay:duration-780,fill:'both',easing:'cubic-bezier(.2,.7,.1,1)'});}
  cameraAnimation.finished.then(()=>{if(active===motion)stop();}).catch(()=>{});
 }
 function render(state,ui){
  const selecting=state.phase==='selecting';
  const returning=state.phase==='overview'&&previous?.phase==='focus';
  if((selecting&&previous?.phase==='overview'||returning)&&previous&&!reduced())travel(state,ui,returning);
  else{
   if(active&&!(state.phase==='focus'&&previous?.phase==='selecting'))stop();
   const changed=detail.dataset.winchatView!==ui.key;
   paint(state,ui);
   if(changed&&!reduced()&&state.phase!=='fusing'&&state.phase!=='born')detail.firstElementChild?.animate([{opacity:.15,transform:'translateX(24px)'},{opacity:1,transform:'none'}],{duration:500,easing:'cubic-bezier(.16,1,.3,1)'});
  }
  previous={...state};
 }
 return {render,reset};
}
