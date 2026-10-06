import * as THREE from './vendor/three.module.js';
import {createCameraScene} from './camera-scene.js?v=learning-life-1';
import {createEdgeHost} from './edge-host.js?v=learning-life-1';
import {createDataScene} from './data-scene.js?v=learning-life-1';
import {createRobotSeed} from './robot-seed.js?v=learning-life-1';

// An articulated young robot makes emerging intelligence tangible.
// The surrounding sources describe a conceptual perception chain, not a device BOM.
export function createSenseScene({group:parent,brick,addLabel,onStage=()=>{}}){
 const group=new THREE.Group();parent.add(group);
 const cameras=createCameraScene({parent,brick,addLabel}),data=createDataScene({parent,brick,addLabel});
 let mode='overview',fromMode='overview',started=0,lastAge=0,busy=false;
 function show(next,animate=true){fromMode=mode;mode=next;started=lastAge-(animate?0:6.3);busy=animate&&mode!=='overview';group.scale.setScalar(1);group.position.z=0;cameras.group.scale.setScalar(1);cameras.group.position.set(0,0,0);group.visible=next==='overview';cameras.group.visible=next==='cameras';data.group.visible=next==='data';onStage({mode,busy})}
 function reset(){lastAge=0;mode=fromMode='overview';show('overview',false)}
 function action(type){
  if(busy)return true;
  if(type==='next'&&mode==='overview'){show('cameras');return true}
  if(type==='next'&&mode==='cameras'){show('data');return true}
  if(type==='back'&&mode==='data'){show('cameras',false);return true}
  if(type==='back'&&mode==='cameras'){show('overview',false);return true}
  if(type==='cameras'||type==='data'){show(type);return true}
  return false;
 }
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),clamp=t=>Math.max(0,Math.min(1,t));
 const robot=createRobotSeed(group);

 const base=new THREE.Group();group.add(base);base.position.y=-3.83;
 for(const [radius,opacity]of[[2.6,.30],[2.78,.15],[3.12,.11]]){const ring=new THREE.Mesh(new THREE.RingGeometry(radius,radius+.016,128),new THREE.MeshBasicMaterial({color:'#83b2cb',transparent:true,opacity,side:THREE.DoubleSide,depthWrite:false}));ring.rotation.x=-Math.PI/2;base.add(ring)}
 const sweep=new THREE.Mesh(new THREE.RingGeometry(2.59,2.62,50,1,0,Math.PI*.44),new THREE.MeshBasicMaterial({color:'#c2dfec',transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}));sweep.rotation.x=-Math.PI/2;sweep.position.y=.02;base.add(sweep);
 const sourceSpecs=[
  {label:'光學・照明',id:'visual',x:-4.75,y:3.0,type:'optics'},
  {label:'取像・影像串流',id:'visual',x:-5.25,y:.65,type:'frames'},
  {label:'影像前處理',id:'visual',x:-4.75,y:-1.70,type:'pixels'},
  {label:'溫度・震動・壓力',id:'numeric',x:4.75,y:3.0,type:'signals'},
  {label:'PLC・設備狀態',id:'numeric',x:5.25,y:.65,type:'equipment'},
  {label:'資料庫・通訊',id:'numeric',x:4.75,y:-1.70,type:'data'}
 ];
 const streams=[],sources=[];
 function line(parent,coords,material){const object=new THREE.Line(new THREE.BufferGeometry().setFromPoints(coords.map(p=>V(...p))),material);parent.add(object);return object}
 function source(spec,i){
  const g=new THREE.Group();g.position.set(spec.x,spec.y,-.35);group.add(g);
  const color=spec.id==='visual'?'#9dc5db':'#9ccab7',mat=new THREE.LineBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false});
  const disc=new THREE.Mesh(new THREE.CircleGeometry(.69,48),new THREE.MeshBasicMaterial({color:'#101f30',transparent:true,opacity:.73,side:THREE.DoubleSide,depthWrite:false}));g.add(disc);
  const ring=new THREE.Mesh(new THREE.RingGeometry(.69,.7,72),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.45,side:THREE.DoubleSide,depthWrite:false}));ring.position.z=.03;g.add(ring);
  const glyph=new THREE.Group();glyph.position.z=.07;g.add(glyph);
  if(spec.type==='optics'){
   for(const r of[.18,.39]){const circle=Array.from({length:65},(_,j)=>[Math.cos(j*Math.PI/32)*r,Math.sin(j*Math.PI/32)*r,0]);line(glyph,circle,mat)}
   for(let j=0;j<6;j++){const a=j*Math.PI/3;line(glyph,[[Math.cos(a)*.44,Math.sin(a)*.44,0],[Math.cos(a)*.54,Math.sin(a)*.54,0]],mat)}
  }else if(spec.type==='frames'){
   for(const [x,y,z]of[[-.10,.10,0],[.10,-.06,.07]])line(glyph,[[x-.38,y-.25,z],[x+.38,y-.25,z],[x+.38,y+.25,z],[x-.38,y+.25,z],[x-.38,y-.25,z]],mat);
   line(glyph,[[-.08,-.19,.1],[.20,-.01,.1],[-.08,.17,.1],[-.08,-.19,.1]],mat);
  }else if(spec.type==='signals'){
   for(let k=0;k<3;k++)line(glyph,Array.from({length:36},(_,j)=>[(j/35-.5)*1.02,(k-1)*.25+Math.sin(j*.36+k)*.08,0]),mat);
  }else if(spec.type==='data'){
   for(let k=0;k<3;k++)line(glyph,[[-.36,.30-k*.28,0],[.36,.30-k*.28,0],[.36,.13-k*.28,0],[-.36,.13-k*.28,0],[-.36,.30-k*.28,0]],mat);
  }else{
   for(let k=0;k<9;k++){const node=new THREE.Mesh(new THREE.BoxGeometry(.15,.15,.05),new THREE.MeshBasicMaterial({color,transparent:true,opacity:.45+(k%3)*.19}));node.position.set((k%3-1)*.29,(Math.floor(k/3)-1)*.29,0);glyph.add(node)}
   if(spec.type==='equipment')for(let k=0;k<3;k++)line(glyph,[[-.54,(k-1)*.29,0],[.54,(k-1)*.29,0]],mat);
  }
  addLabel(g,V(0,-1.10,.18),spec.label,spec.id,color,'sense-source-label','growth');
  sources.push({g,ring,glyph,mat,i});
  const start=g.position.clone(),end=V(spec.x<0?-.6:.6,1.05,-.05);
  const curve=new THREE.CatmullRomCurve3([start,V(spec.x*.61,spec.y+.24,-.9),end]);
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(45)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.22,depthWrite:false})));
  for(let j=0;j<4;j++){const bead=new THREE.Mesh(new THREE.SphereGeometry(.038,8,6),new THREE.MeshBasicMaterial({color}));group.add(bead);streams.push({bead,curve,offset:j/4+i*.09})}
 }
 sourceSpecs.forEach(source);
 const overviewHosts=[];
 for(const [i,id]of['visual','numeric'].entries()){
  const host=createEdgeHost({parent:group,brick,addLabel,id,name:i?'WinEdge-N':'WinEdge-V',color:i?'#367961':'#436887',pos:[i?3.05:-3.05,-3.23,.6]});overviewHosts.push(host);
  const curve=new THREE.CatmullRomCurve3([V(i?.5:-.5,.15,.3),V(i?1.25:-1.25,-1.9,1.1),V(i?3.05:-3.05,-2.20,.6)]);
  group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(45)),new THREE.LineBasicMaterial({color:'#d6b483',transparent:true,opacity:.38,depthWrite:false})));
  for(let j=0;j<3;j++){const bead=new THREE.Mesh(new THREE.SphereGeometry(.05,10,8),new THREE.MeshBasicMaterial({color:'#e1c89e'}));group.add(bead);streams.push({bead,curve,offset:j/3})}
 }
 return {reset,action,update(age,reduced){
  lastAge=age;
  if(mode!=='overview'){
   const elapsed=age-started,k=clamp(elapsed/1.1);group.visible=!reduced&&fromMode==='overview'&&elapsed<1.1;
   if(group.visible){robot.update(age,reduced,1-k);group.scale.setScalar(1-.16*k);group.position.z=-1.5*k}
   if(mode==='cameras'){data.group.visible=false;cameras.update(elapsed,reduced)}
   else{
    cameras.group.visible=!reduced&&fromMode==='cameras'&&elapsed<.85;
    if(cameras.group.visible){cameras.update(8+elapsed,reduced);cameras.group.scale.setScalar(Math.max(.05,1-k));cameras.group.position.x=-6*k}
    data.update(elapsed,reduced);
   }
   if(busy&&(reduced||elapsed>=6.2)){busy=false;onStage({mode,busy})}return;
  }
  group.visible=true;cameras.group.visible=data.group.visible=false;
  overviewHosts.forEach(host=>{host.update(age,1,reduced);host.root.scale.multiplyScalar(.65)});
  const t=reduced?0:age;robot.update(age,reduced,reduced?1:clamp(age/1.8));sweep.rotation.z=-t*.16;
  sources.forEach(({g,ring,mat,i})=>{const p=reduced?.7:.55+.45*Math.pow(Math.max(0,Math.cos(t*.6-i*.75)),3);ring.material.opacity=.28+p*.32;mat.opacity=.55+p*.4;g.scale.setScalar(reduced?1:.985+p*.015)});
  streams.forEach(({bead,curve,offset})=>bead.position.copy(curve.getPoint(reduced?.5:(age*.19+offset)%1)));
 }};
}
