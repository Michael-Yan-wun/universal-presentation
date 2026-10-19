import * as THREE from './vendor/three.module.js';
import {palette} from './product-colors.js?v=product-colors-1';

export const ascentStages=[
 {title:'現場看得見',english:'FIELD VISIBILITY',product:'WinEdge-N · WinEdge-V',color:palette.unified},
 {title:'經驗會學習',english:'EXPERIENCE TO LEARNING',product:'AIWinOps · NumOps',color:palette.analytics},
 {title:'知識能對話',english:'KNOWLEDGE IN CONVERSATION',product:'WinChat · RAG',color:palette.chat},
 {title:'任務能執行',english:'KNOWLEDGE INTO ACTION',product:'Agent · SKILL',color:'#db782c'},
 {title:'場景會協作',english:'DOMAIN COLLABORATION',product:'Domain AI',color:'#245676'}
];
export const ascentDuration=8.4;
export function ascentStoryHTML(){return `<div class="ca-heading"><p class="eyebrow"><span class="eyebrow-line"></span>BUILDING INTELLIGENCE · STEP BY STEP</p><h1>企業 AI，<em>一步步累積。</em></h1><p>從小場景開始，逐步堆出企業 AI 大腦。</p></div><ol class="ca-accessible-stages">${ascentStages.map(s=>`<li>${s.title}：${s.product}</li>`).join('')}</ol>`;}
export function ascentDetailHTML(){return '<div class="ca-stage-foot"><span>每一塊專業，都是下一階的起點。</span><small>STEP BY STEP · BUILT FROM EXPERIENCE</small></div>';}

// Shares the castle renderer and clock. Entrance ends at a held pose; assembly is manual.
export function createCastleAscent({group,castleGroup,castle,brick,geometry,makeBrain,addLabel,onPhase=()=>{}}){
 const root=new THREE.Group();root.name='castle-capability-staircase';group.add(root);
 const units=[],tops=[],labels=[],routes=[],materials=new Set(),geometries=new Set();
 const ownGeo=g=>(geometries.add(g),g),ownMat=m=>(materials.add(m),m);
 const clamp=x=>THREE.MathUtils.clamp(x,0,1),smooth=x=>{const p=clamp(x);return p*p*(3-2*p);};
 const settle=x=>1-Math.pow(1-clamp(x),4);
 let phase='ascent',elapsed=0,assemblyTime=0;
 function isolate(object){const finishes=[];object.traverse(o=>{if(!o.material||Array.isArray(o.material))return;const mat=ownMat(o.material.clone());o.material=mat;finishes.push({mat,opacity:mat.opacity,transparent:mat.transparent,depthWrite:mat.depthWrite});});return finishes;}
 function fade(finishes,alpha){for(const f of finishes){f.mat.opacity=f.opacity*alpha;f.mat.transparent=f.transparent||alpha<.999;f.mat.depthWrite=f.depthWrite&&alpha>=.999;}}
 function makeBlock(options,start,type){const item=brick(root,{detail:'hero',...options});item.castleManaged=true;const unit={item,home:item.g.position.clone(),finishes:isolate(item.g),start,type};units.push(unit);return unit;}
 const base=-3.25,tileHeight=.76;
 ascentStages.forEach((stage,i)=>{
  const x=(i-2)*3.6,start=.18+i*1.18;
  for(let level=0;level<=i;level++)makeBlock({cols:3,rows:2,h:.53,color:level===i?'#64758b':'#384a61',pos:[x,base+level*tileHeight+.27,0]},start+level*.12,'support');
  const top=makeBlock({name:stage.title,sub:stage.english,cols:3,rows:2,h:1.52,color:stage.color,pos:[x,base+i*tileHeight+1.40,0]},start+(i+1)*.12+.30,'capability');
  tops.push(top);
  const label=addLabel(top.item.g,new THREE.Vector3(0,-1.16,1.2),stage.product,'',stage.color,'ct-ascent-label','castle');
  label.innerHTML=`<span class="ca-step-number">0${i+1}</span><span>${stage.product}</span>`;label.setAttribute('aria-hidden','true');labels.push({el:label,start:top.start+.35});
 });
 // A quiet physical deck and its contact shadows ground the staircase.
 const deck=new THREE.Mesh(geometry(18.6,.14,3.7,true),ownMat(new THREE.MeshStandardMaterial({color:'#172537',roughness:.45,metalness:.35})));
 deck.position.set(0,-3.61,0);deck.receiveShadow=true;root.add(deck);const deckFinishes=isolate(deck);
 const brain=makeBrain(root,'#90d3e3',1.08);brain.position.set(7.2,3.65,-.15);const brainFinishes=isolate(brain);
 for(let i=0;i<4;i++){
  const a=tops[i].home,b=tops[i+1].home;
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(a.x+1.05,a.y+1.25,-.5),new THREE.Vector3((a.x+b.x)/2,a.y+1.8,-.5),new THREE.Vector3(b.x-1.1,b.y+1.25,-.5)]);
  const mat=ownMat(new THREE.MeshBasicMaterial({color:'#99bdcf',transparent:true,opacity:0,depthWrite:false}));
  const tube=new THREE.Mesh(ownGeo(new THREE.TubeGeometry(curve,36,.013,6,false)),mat);root.add(tube);
  const dot=new THREE.Mesh(ownGeo(new THREE.SphereGeometry(.045,12,8)),ownMat(new THREE.MeshBasicMaterial({color:'#c4e7eb',transparent:true,opacity:0,depthWrite:false})));root.add(dot);routes.push({curve,tube,dot,start:tops[i+1].start});
 }
 const destinations=[new THREE.Vector3(0,-.88,0),new THREE.Vector3(-2.1,.48,0),new THREE.Vector3(0,1.87,0),new THREE.Vector3(2.1,.48,0),new THREE.Vector3(0,4.65,-.3)];
 function finish(){phase='castle';root.visible=false;castleGroup.visible=true;castle.setReveal(1);onPhase(phase);}
 function reset({atEnd=false}={}){
  phase=atEnd?'castle':'ascent';elapsed=0;assemblyTime=0;root.visible=!atEnd;castleGroup.visible=atEnd;castle.reset(0,{assembled:true});castle.setReveal(atEnd?1:0);
  units.forEach(u=>{u.item.g.position.copy(u.home);u.item.g.rotation.set(0,0,0);u.item.g.scale.setScalar(1);u.item.g.visible=false;fade(u.finishes,1);});
  labels.forEach(l=>l.el.style.opacity='0');brain.visible=false;fade(brainFinishes,0);fade(deckFinishes,1);
 }
 function advance(reduced=false){
  if(phase==='castle')return false;
  if(phase==='assembling'){finish();return true;}
  phase='assembling';elapsed=ascentDuration;assemblyTime=0;castleGroup.visible=true;castle.reset(0,{assembled:true});castle.setReveal(0);onPhase(phase);
  if(reduced)finish();return true;
 }
 function update(dt,time,reduced){
  if(phase==='castle')return;
  elapsed=reduced?ascentDuration:Math.min(ascentDuration,elapsed+dt);
  if(phase==='assembling')assemblyTime+=dt;
  const assembly=reduced?1:smooth(assemblyTime/2.5);
  for(const u of units){
   const p=reduced?1:settle((elapsed-u.start)/.82);u.item.g.visible=p>0;u.item.g.position.copy(u.home);u.item.g.position.y+=(1-p)*3.3;u.item.g.rotation.y=(1-p)*.09;
   if(phase==='assembling'){
    if(u.type==='capability'){const i=tops.indexOf(u);u.item.g.position.lerpVectors(u.home,destinations[i],assembly);u.item.g.scale.setScalar(1-.25*assembly);fade(u.finishes,1-smooth((assembly-.28)/.52));}
    else{u.item.g.position.y-=.55*assembly;fade(u.finishes,1-smooth(assembly/.55));}
   }
  }
  for(const label of labels)label.el.style.opacity=String(smooth((elapsed-label.start)/.5)*(phase==='assembling'?1-smooth(assembly/.35):1));
  const brainAlpha=smooth((elapsed-6.8)/1.1)*(phase==='assembling'?1-smooth(assembly/.55):1);brain.visible=brainAlpha>0;brain.scale.setScalar(1.08);brain.rotation.y=elapsed<ascentDuration?Math.sin(elapsed*.4)*.10:Math.sin(ascentDuration*.4)*.10;fade(brainFinishes,brainAlpha);
  for(const route of routes){const p=smooth((elapsed-route.start)/.7),alpha=p*(phase==='assembling'?1-smooth(assembly/.4):1);route.tube.material.opacity=.30*alpha;route.dot.material.opacity=alpha*.85;route.dot.position.copy(route.curve.getPoint(clamp((elapsed-route.start-.25)/1.05)));}
  if(phase==='assembling'){fade(deckFinishes,1-smooth(assembly/.5));castle.setReveal(smooth((assembly-.2)/.75));if(assemblyTime>=2.5)finish();}
 }
 function view(aspect){
  const p=smooth(elapsed/ascentDuration),factor=Math.max(1,2.15/aspect);
  const from={x:4.2-1.5*p,y:7.1-.7*p,z:(19.5-1.4*p)*factor,targetY:-.9+.7*p};
  if(phase!=='assembling')return from;
  const target=castle.view(aspect),p2=smooth(assemblyTime/2.5);return Object.fromEntries(Object.keys(from).map(k=>[k,THREE.MathUtils.lerp(from[k],target[k],p2)]));
 }
 reset();
 return {get phase(){return phase;},get ready(){return elapsed>=ascentDuration;},reset,advance,update,view,dispose(){root.removeFromParent();for(const g of geometries)g.dispose();for(const m of materials)m.dispose();}};
}
