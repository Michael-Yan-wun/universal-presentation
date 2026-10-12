import { palette } from './product-colors.js?v=product-colors-1';
import * as THREE from './vendor/three.module.js';
import {cameraStage as layout} from './stage-layout.js?v=company-stage-2';
import {createEdgeHost} from './edge-host.js?v=learning-life-1';
import {createCameraModel} from './camera-models.js?v=learning-life-1';

// Three photo-referenced hardware silhouettes, assembled from independent mechanical parts.
export function createCameraScene({parent,brick,addLabel}){
 const group=new THREE.Group();parent.add(group);group.visible=false;
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>1-Math.pow(1-t,3);
 const eye=new THREE.Group();group.add(eye);eye.position.set(0,layout.eyeY,.15);
 const eyeMat=new THREE.LineBasicMaterial({color:'#badcea',transparent:true,opacity:.85});
 function line(g,points,mat=eyeMat){const m=new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),mat);g.add(m);return m}
 for(const side of[-1,1])line(eye,Array.from({length:81},(_,i)=>{const t=i/80;return V((t-.5)*3.55,side*Math.sin(Math.PI*t)*.79,0)}));
 for(const r of[.42,.66])line(eye,Array.from({length:101},(_,i)=>V(Math.cos(i/100*Math.PI*2)*r,Math.sin(i/100*Math.PI*2)*r,.02)));
 const iris=new THREE.Group();eye.add(iris);
 for(let i=0;i<48;i++){const a=i/48*Math.PI*2;line(iris,[V(Math.cos(a)*.46,Math.sin(a)*.46,.025),V(Math.cos(a)*.61,Math.sin(a)*.61,.025)],new THREE.LineBasicMaterial({color:'#73aeca',transparent:true,opacity:.35+(i%4)*.12}))}
 const pupil=new THREE.Mesh(new THREE.CircleGeometry(.29,48),new THREE.MeshBasicMaterial({color:'#243f58',transparent:true,opacity:.8}));pupil.position.z=.04;eye.add(pupil);
 const glint=new THREE.Mesh(new THREE.SphereGeometry(.055,12,8),new THREE.MeshBasicMaterial({color:'#ecf8ff'}));glint.position.set(-.1,.1,.08);eye.add(glint);
 const sources=[],beads=[],rays=[];
 const specs=[
  {name:'Basler 工業相機',sub:'產線取像',x:-layout.spread,y:.65,type:'industrial'},
  {name:'IP Camera',sub:'場域影像串流',x:0,y:1.45,type:'ip'},
  {name:'USB Camera',sub:'近端取像',x:layout.spread,y:.65,type:'usb'}
 ];
 specs.forEach((s,i)=>{
  const g=new THREE.Group();group.add(g);g.position.set(s.x,s.y,.25);
  const model=createCameraModel(s.type);g.add(model.root);model.root.scale.setScalar(layout.modelScale);
  addLabel(g,V(0,s.type==='ip'?-1.90:s.type==='usb'?-2.42:-2.16,1.0),s.name,s.type==='industrial'?'camera-basler':'visual','#a9cde1','camera-source-label','growth');
  const target=g.position.clone(),curve=new THREE.CatmullRomCurve3([V(0,layout.eyeY-.7,.15),V(s.x*.62,2.6,-.1),target.clone().add(V(0,.8,0))]);
  const wire=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(60)),new THREE.LineBasicMaterial({color:'#80b6cd',transparent:true,opacity:0}));group.add(wire);rays.push({wire,delay:i*.8});
  const returnCurve=new THREE.CatmullRomCurve3([target.clone().add(V(0,-.8,.4)),V(s.x*.78,-2.15,.7),V(0,layout.outputY+1.55,.6)]);
  const back=new THREE.Line(new THREE.BufferGeometry().setFromPoints(returnCurve.getPoints(50)),new THREE.LineBasicMaterial({color:'#bea886',transparent:true,opacity:0}));group.add(back);rays.push({wire:back,delay:4.4});
  for(let j=0;j<3;j++)for(const [path,delay]of[[curve,i*.8],[returnCurve,4.4]]){const bead=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:delay===4.4?'#e4c69a':'#c9e8f5'}));group.add(bead);beads.push({bead,curve:path,offset:j/3,delay})}
  sources.push({g,target,model,delay:i*.8});
 });
 const host=createEdgeHost({parent:group,brick,addLabel,id:'visual',name:'WinEdge-V',color:palette.visual,pos:[0,layout.outputY,.4]});
 return {group,update(time,reduced){
  group.visible=true;const t=reduced?8:time;eye.scale.setScalar(.64+.56*ease(clamp(t/1.2)));eye.position.y=layout.eyeY+.25-.25*ease(clamp(t/1.2));iris.rotation.z=reduced?0:time*.09;
  sources.forEach(({g,target,model,delay})=>{const progress=clamp((t-1.8-delay)/1.55),p=ease(progress);g.visible=p>0;g.position.lerpVectors(V(0,layout.eyeY-1.3,-.5),target,p);g.scale.setScalar(.15+.85*p);g.rotation.y=(1-p)*.5;model.update(progress,time,reduced)});
  rays.forEach(({wire,delay})=>{const p=clamp((t-1.5-delay)/1.2);wire.material.opacity=p*.37;wire.geometry.setDrawRange(0,Math.ceil(wire.geometry.attributes.position.count*p))});
  beads.forEach(({bead,curve,offset,delay})=>{bead.visible=t>delay+2.5;bead.position.copy(curve.getPoint(reduced?.5:(time*.24+offset)%1))});
  host.update(time,clamp((t-4.4)/1.7),reduced);
 }};
}
