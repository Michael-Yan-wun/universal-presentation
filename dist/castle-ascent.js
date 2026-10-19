import * as THREE from './vendor/three.module.js';
import {palette} from './product-colors.js?v=product-colors-1';

export const ascentStages=[
 {title:'現場看得見',english:'FIELD VISIBILITY',color:palette.unified,role:'WinEdge'},
 {title:'經驗會學習',english:'EXPERIENCE TO LEARNING',color:palette.analytics,role:'NumOps'},
 {title:'知識能對話',english:'KNOWLEDGE IN CONVERSATION',color:palette.chat,role:'WinChat'},
 {title:'任務能執行',english:'KNOWLEDGE INTO ACTION',color:palette.vision,role:'AIWinOps'},
 {title:'場景會協作',english:'DOMAIN COLLABORATION',color:'#245676',role:'EDGE AI FOUNDATION'}
];
export const assemblyDuration=8.2;
export function ascentStoryHTML(){return `<div class="ca-heading"><p class="eyebrow"><span class="eyebrow-line"></span>FLEXIBLE BUILDING BLOCKS · ENTERPRISE AI</p><h1>企業 AI<em>不用一次到位。</em></h1><p>從小場景開始，依需求彈性組合。</p></div><ol class="ca-accessible-stages">${ascentStages.map(s=>`<li>${s.title}</li>`).join('')}</ol>`;}
export function ascentDetailHTML(){return '<div class="ca-stage-foot"><span>能力逐步累積，積木彈性組合。</span><small>START SMALL · BUILD TOGETHER</small></div>';}

// The staircase and the castle use the SAME solid meshes. Only their poses change.
export function createCastleAscent({group,castleGroup,castle,geometry,makeTitleTexture=()=>null,onPhase=()=>{}}){
 const root=new THREE.Group();root.name='castle-reconfiguration';group.add(root);
 const materials=new Set(),geometries=new Set(),textures=new Set(),actors=[],extras=[];
 const ownGeo=g=>(geometries.add(g),g),ownMat=m=>(materials.add(m),m);
 const clamp=x=>THREE.MathUtils.clamp(x,0,1),smooth=x=>{const p=clamp(x);return p*p*(3-2*p);};
 const parts=castle.getAssemblyParts(),tops=ascentStages.map(s=>parts.find(p=>p.kind==='brick'&&p.role===s.role));
 if(tops.some(p=>!p))throw new Error('Castle assembly requires all five capability modules.');
 const supports=parts.filter(p=>p.kind==='brick'&&!tops.includes(p));
 const studGeo=ownGeo(new THREE.CylinderGeometry(.31,.32,.22,48));
 const matrix=new THREE.Object3D(),color=new THREE.Color();
 let phase='ascent',assemblyTime=0,docking=false;
 function wrap(part){
  const parent=part.root.parent,wrapper=new THREE.Group();parent.add(wrapper);wrapper.add(part.root);
  const finishes=[];part.root.traverse(o=>{if(!o.material||Array.isArray(o.material))return;finishes.push({object:o,mat:o.material,color:o.material.color?.clone(),opacity:o.material.opacity,transparent:o.material.transparent,depthWrite:o.material.depthWrite,visible:o.visible});});
  return {part,parent,wrapper,finishes,home:part.home.clone(),scale:part.scale.clone(),source:part.home.clone(),sourceScale:new THREE.Vector3(1,1,1)};
 }
 function actor(part,source,shape,{stage=null,start=.4,duration=2.6,index=0}={}){
  const a=wrap(part);Object.assign(a,{source,shape,stage,start,duration,index});
  a.sourceScale.set(shape[0]/part.shape[0],shape[1]/part.shape[1],shape[2]/part.shape[2]);
  a.nativeStuds=part.root.children.filter(o=>o.isInstancedMesh);
  const body=part.root.children.find(o=>o.isMesh&&!o.isInstancedMesh&&!o.material?.map);
  const pegMat=ownMat((body?.material||new THREE.MeshPhysicalMaterial({color:'#516278'})).clone());
  a.pegs=new THREE.InstancedMesh(studGeo,pegMat,6);a.pegs.castShadow=true;a.pegs.receiveShadow=true;a.parent.add(a.pegs);
  a.front=part.root.children.find(o=>o.isMesh&&o.material?.map);
  if(stage&&a.front){a.targetMap=a.front.material.map;a.stageMap=makeTitleTexture(stage.title,stage.english,3.09*.88,1.52*.84);if(a.stageMap)textures.add(a.stageMap);}
  actors.push(a);return a;
 }
 const base=-3.25,counts=[1,2,3,4,4],pitches=[.76,.76,.76,.76,.95];let supportIndex=0;
 for(let column=0;column<5;column++){
  const x=(column-2)*3.6,pitch=pitches[column];
  for(let level=0;level<counts[column];level++){
   const part=supports[supportIndex];if(!part)throw new Error('Missing structural castle module.');
   actor(part,new THREE.Vector3(x,base+level*pitch+(pitch-.23)/2,0),[3.09,pitch-.23,2.04],{start:.35+supportIndex*.065,duration:2.35,index:supportIndex++});
  }
  actor(tops[column],new THREE.Vector3(x,base+counts[column]*pitch+.76,0),[3.09,1.52,2.04],{stage:ascentStages[column],start:[1.4,3.2,4.8,3.55,.85][column],duration:2,index:column});
 }
 if(supportIndex!==supports.length)throw new Error('Unassigned structural castle modules.');
 for(const part of parts.filter(p=>p.kind!=='brick')){
  const extra=wrap(part);extra.kind=part.kind;
  if(part.kind==='brain'){
   extra.central=part.brainIndex===2;extra.start=extra.central?5.1:6.1+Math.abs(part.brainIndex-2)*.12;extra.duration=1.35;
   extra.source.set(7.2,3.65,-.15);extra.sourceScale.setScalar(extra.central?1.125:.18);
  }else{extra.start=part.kind==='hardware'?1.25:.1;extra.duration=part.kind==='hardware'?2.15:2.3;extra.source.copy(extra.home).add(new THREE.Vector3(0,-1.4,0));}
  extras.push(extra);
 }
 const deck=new THREE.Mesh(geometry(18.6,.14,3.7,true),ownMat(new THREE.MeshStandardMaterial({color:'#172537',roughness:.45,metalness:.35})));
 deck.position.set(0,-3.61,0);deck.receiveShadow=true;root.add(deck);
 function restore(a){
  a.wrapper.position.set(0,0,0);a.wrapper.rotation.set(0,0,0);a.wrapper.scale.setScalar(1);
  a.part.root.position.copy(a.home);a.part.root.scale.copy(a.scale);a.part.root.visible=true;
  for(const f of a.finishes){if(f.color)f.mat.color.copy(f.color);f.mat.opacity=f.opacity;f.mat.transparent=f.transparent;f.mat.depthWrite=f.depthWrite;f.object.visible=f.visible;}
  if(a.front&&a.targetMap)a.front.material.map=a.targetMap;
  if(a.pegs)a.pegs.visible=false;
 }
 function pose(a,p,arc=0){
  const ratio=a.sourceScale.clone().lerp(new THREE.Vector3(1,1,1),p),centre=a.source.clone().lerp(a.home,p);
  const loft=Math.sin(Math.PI*p);centre.y+=loft*arc;
  if(a.stage){const i=ascentStages.indexOf(a.stage);centre.y+=[.6,2.1,3.7,.8,.3][i]*smooth(assemblyTime/.65)*(1-p);centre.z+=loft*[2.4,-2.8,-1.4,2.2,-2.8][i];}
  else centre.z+=loft*.4;
  a.wrapper.scale.copy(ratio);a.wrapper.position.copy(centre).sub(a.home.clone().multiply(ratio));
  a.wrapper.rotation.y=0;a.part.root.visible=true;
  if(!a.pegs)return;
  const swap=smooth((p-.9)/.1),stageColor=a.stage?.color||'#52657c';
  for(const f of a.finishes){
   if(f.color&&(f.mat.isMeshPhysicalMaterial||f.mat.isMeshStandardMaterial))f.mat.color.copy(color.set(stageColor).lerp(f.color,smooth((p-.72)/.28)));
   if(a.nativeStuds.includes(f.object)){f.object.visible=swap>0;f.mat.opacity=f.opacity*swap;f.mat.transparent=f.transparent||swap<1;}
  }
  a.pegs.visible=p<1;a.pegs.material.opacity=1-swap;a.pegs.material.transparent=swap>0;
  const original=a.finishes.find(f=>f.mat.isMeshPhysicalMaterial||f.mat.isMeshStandardMaterial)?.color;
  a.pegs.material.color.copy(color.set(stageColor).lerp(original||color,smooth((p-.72)/.28)));
  a.pegs.position.copy(centre);
  const dimensions=a.shape.map((n,i)=>THREE.MathUtils.lerp(n,a.part.shape[i],p));
  for(let x=0;x<3;x++)for(let z=0;z<2;z++){
   matrix.position.set((x-1)*(dimensions[0]-.55)/3,dimensions[1]/2+.13,(z-.5)*(dimensions[2]-.55)/2);matrix.rotation.set(0,0,0);matrix.scale.setScalar(1);matrix.updateMatrix();a.pegs.setMatrixAt(x*2+z,matrix.matrix);
  }
  a.pegs.instanceMatrix.needsUpdate=true;
  if(a.front&&a.stageMap)a.front.material.map=p<.94?a.stageMap:a.targetMap;
  if(a.front&&!a.stage)a.front.visible=p>=.94;
 }
 function finish(){
  phase='castle';root.visible=false;castleGroup.visible=true;
  [...actors,...extras].forEach(restore);castle.setAssemblyMode(false);castle.reset(0,{assembled:true});castle.setReveal(1);castle.setAssemblyDecorations(1);onPhase(phase);
 }
 function reset({atEnd=false}={}){
  phase=atEnd?'castle':'ascent';assemblyTime=0;docking=false;root.visible=!atEnd;castleGroup.visible=true;
  castle.reset(0,{assembled:true});castle.setReveal(1);castle.setAssemblyMode(!atEnd);castle.setAssemblyDecorations(atEnd?1:0);
  deck.position.set(0,-3.61,0);deck.scale.setScalar(1);
  actors.forEach(a=>atEnd?restore(a):pose(a,0));
  for(const a of extras){if(atEnd)restore(a);else if(a.central)pose(a,0);else a.part.root.visible=false;}
 }
 function advance(reduced=false){
  if(phase==='castle')return false;
  if(phase==='assembling'){finish();return true;}
  phase='assembling';assemblyTime=0;onPhase(phase);if(reduced)finish();return true;
 }
 function update(dt,time,reduced){
  if(phase!=='assembling')return;
  if(reduced){finish();return;}
  assemblyTime=Math.min(assemblyDuration,assemblyTime+dt);
  for(const a of actors){const p=smooth((assemblyTime-a.start)/a.duration);pose(a,p,a.stage?[.65,.8,.75,.8,.9][ascentStages.indexOf(a.stage)]:.70);}
  for(const a of extras){
   const p=smooth((assemblyTime-a.start)/a.duration);a.part.root.visible=a.central||p>0;
   if(a.part.root.visible)pose(a,p,a.kind==='brain'?.45:0);
  }
  const deckProgress=smooth(assemblyTime/4);deck.scale.x=1-.34*deckProgress;deck.position.y=-3.61-.5*deckProgress;
  castle.setAssemblyDecorations(smooth((assemblyTime-6.8)/1));
  if(assemblyTime>=6.5&&!docking){docking=true;onPhase('docking');}
  if(assemblyTime>=assemblyDuration)finish();
 }
 function view(aspect){
  const from={x:2.7,y:6.4,z:18.1*Math.max(1,2.15/aspect),targetY:-.2};
  if(phase!=='assembling')return from;
  const target=castle.view(aspect),p=smooth(assemblyTime/assemblyDuration);return Object.fromEntries(Object.keys(from).map(k=>[k,THREE.MathUtils.lerp(from[k],target[k],p)]));
 }
 reset();
 return {get phase(){return phase;},get ready(){return true;},reset,advance,update,view,dispose(){
  [...actors,...extras].forEach(a=>{restore(a);a.parent.add(a.part.root);a.wrapper.removeFromParent();a.pegs?.removeFromParent();});root.removeFromParent();
  castle.setAssemblyMode(false);for(const g of geometries)g.dispose();for(const m of materials)m.dispose();for(const t of textures)t.dispose();
 }};
}
