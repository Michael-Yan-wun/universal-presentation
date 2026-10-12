import { palette } from './product-colors.js?v=product-colors-1';
import * as THREE from './vendor/three.module.js';
import {createSenseScene} from './sense-scene.js?v=product-colors-1';
export function createGrowthScene({early,body,brick,addLabel,onSenseStage}){
 const rigs=[],links=[];const V=(x,y,z)=>new THREE.Vector3(x,y,z);
 function human(parent,isChild){
  const g=new THREE.Group();parent.add(g);g.position.y=-2.8;const wires=new THREE.MeshBasicMaterial({color:'#6e9ebc',transparent:true,opacity:.18,wireframe:true}),solid=new THREE.MeshPhysicalMaterial({color:'#5585a3',transparent:true,opacity:.1,roughness:.4,metalness:.2,depthWrite:false});
  const joints=[],paths=[];function shell(geo,pos,scale){const m=new THREE.Mesh(geo,solid);m.position.copy(pos);m.scale.copy(scale);g.add(m);const w=new THREE.Mesh(geo,wires);w.position.copy(pos);w.scale.copy(scale);g.add(w)}
  function limb(a,b,r){const delta=b.clone().sub(a),m=new THREE.Mesh(new THREE.CapsuleGeometry(r,Math.max(.1,delta.length()-r*2),5,10),wires);m.position.copy(a).lerp(b,.5);m.quaternion.setFromUnitVectors(V(0,1,0),delta.normalize());g.add(m);paths.push([a,b]);joints.push(a,b)}
  const height=isChild?4.7:6.6,headY=isChild?3.95:5.7,hip=isChild?1.65:2.7,shoulder=isChild?2.9:4.7;
  shell(new THREE.SphereGeometry(1,20,14),V(0,headY,0),V(isChild?.83:.68,isChild?.89:.83,.66));shell(new THREE.CapsuleGeometry(.75,1,7,12),V(0,(hip+shoulder)/2,0),V(isChild?.78:1,(shoulder-hip)/2,.6));
  limb(V(0,hip,0),V(0,headY-.8,0),.08);
  for(const side of[-1,1]){const shoulderP=V(side*(isChild?.66:.88),shoulder,0),elbow=V(side*(isChild?1.23:1.33),shoulder-.8,.15),hand=V(side*(isChild?1.6:1.58),shoulder-(isChild?.55:1.6),.4),knee=V(side*.43,hip*.55,.15),foot=V(side*.57,.12,.4);limb(shoulderP,elbow,isChild?.18:.23);limb(elbow,hand,.16);limb(V(side*.4,hip,0),knee,.25);limb(knee,foot,.2);shell(new THREE.SphereGeometry(.2,12,8),hand,V(1,1,1));paths.push([hand,V(0,headY,0)]);}
  const nodes=new THREE.InstancedMesh(new THREE.SphereGeometry(.065,10,8),new THREE.MeshBasicMaterial({color:'#b8dceb'}),joints.length),dummy=new THREE.Object3D();joints.forEach((p,i)=>{dummy.position.copy(p);dummy.updateMatrix();nodes.setMatrixAt(i,dummy.matrix)});g.add(nodes);
  const neural=[];for(const [i,ps]of paths.entries()){const curve=new THREE.CatmullRomCurve3([ps[0],ps[0].clone().lerp(ps[1],.5).add(V(.1,.1,.1)),ps[1]]);g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(18)),new THREE.LineBasicMaterial({color:isChild?'#8bbdcc':'#d1c1a6',transparent:true,opacity:.42})));const bead=new THREE.Mesh(new THREE.SphereGeometry(.045,8,6),new THREE.MeshBasicMaterial({color:'#d8efff'}));g.add(bead);neural.push({bead,curve,offset:i*.12})}
  const brain=new THREE.Group();g.add(brain);brain.position.set(0,headY+.1,0);const points=[];for(let i=0;i<160;i++){const a=i*2.399,z=1-2*(i+.5)/160,r=Math.sqrt(1-z*z);points.push(Math.cos(a)*r*.49,z*.51,Math.sin(a)*r*.46)}const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(points,3));brain.add(new THREE.Points(geo,new THREE.PointsMaterial({color:isChild?'#89bacb':'#edb687',size:.045,transparent:true,opacity:.8})));
  for(const side of[-1,1]){const eye=new THREE.Mesh(new THREE.TorusGeometry(.11,.025,8,24),new THREE.MeshBasicMaterial({color:'#d4efff'}));eye.position.set(side*.25,headY+.05,.64);g.add(eye)}
  const base=new THREE.Mesh(new THREE.RingGeometry(2.3,2.32,100),new THREE.MeshBasicMaterial({color:'#83abc3',transparent:true,opacity:.4,side:THREE.DoubleSide}));base.rotation.x=-Math.PI/2;base.position.y=-2.85;parent.add(base);
  rigs.push({g,brain,neural,isChild});return {g,headY,height};
 }
 const senses=createSenseScene({group:early,brick,addLabel,onStage:onSenseStage});human(body,false);
 const map=[['vision','AIWinOps',-4.8,1.55,palette.vision],['analytics','NumOps',4.8,1.55,palette.analytics],['chat','WinChat',0,4.65,palette.chat],['visual','WinEdge-V',-4.8,-1.25,palette.visual],['numeric','WinEdge-N',4.8,-1.25,palette.numeric]];
 map.forEach(([id,name,x,y,color],i)=>{const o=brick(body,{id,name,color,cols:3,rows:2,h:.74,pos:[x,y,.5],scale:.92});o.growthScale=.92;o.targetScale=.92;addLabel(o.g,V(0,id==='chat'?1.35:-1.50,.4),['學會看懂','學會規律','記憶 × 任務 × 技能','影像感知','數據感知'][i],id,color,'growth-label','body');
  const end=id==='chat'?V(0,2.95,0):V(x<0?-.45:.45,y>0?1.7:.3,.15),start=V(x,y,.3),curve=new THREE.CatmullRomCurve3([start,start.clone().lerp(end,.5).add(V(0,.4,-.2)),end]);
  body.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(32)),new THREE.LineBasicMaterial({color,transparent:true,opacity:.65})));
  const bead=new THREE.Mesh(new THREE.SphereGeometry(.06,10,8),new THREE.MeshBasicMaterial({color:'#d7e9f1'}));body.add(bead);links.push({bead,curve,offset:i*.17});
 });
 return {reset:senses.reset,action:senses.action,update(kind,age,reduced){if(kind==='growth'){senses.update(age,reduced);return}if(kind==='body')links.forEach(({bead,curve,offset})=>bead.position.copy(curve.getPoint(reduced?.5:(age*.23+offset)%1)));for(const r of rigs){if((kind==='growth')!==r.isChild)continue;const t=reduced?1:Math.min(age/3,1),k=1-Math.pow(1-t,3);r.g.scale.setScalar(r.isChild?.92:.68+.32*k);r.g.rotation.y=reduced?0:Math.sin(age*.3)*.08;r.brain.rotation.y=reduced?0:age*.12;r.neural.forEach(({bead,curve,offset})=>bead.position.copy(curve.getPoint(reduced?.5:(age*.21+offset)%1)))}}};
}
