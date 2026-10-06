import * as THREE from './vendor/three.module.js';
import {createRobotSeed} from './robot-seed.js?v=learning-life-1';

// The same young intelligence returns: projects feed a growing network of knowledge.
export function createLearningLife(parent){
 const root=new THREE.Group();root.name='learning-life';parent.add(root);
 const cradle=new THREE.Group();root.add(cradle);
 const robot=createRobotSeed(cradle),network=new THREE.Group();root.add(network);
 const V=(x,y,z)=>new THREE.Vector3(x,y,z),clamp=t=>THREE.MathUtils.clamp(t,0,1);
 const nodes=[],links=[],streams=[],packets=[],flow=new THREE.Group();root.add(flow);
 const nodeGeo=new THREE.SphereGeometry(.047,12,8),packetGeo=new THREE.SphereGeometry(.035,10,8);
 for(let i=0;i<21;i++){
  const a=i*2.399963,r=.45+Math.sqrt(i/20)*1.3;
  const node=new THREE.Mesh(nodeGeo,new THREE.MeshBasicMaterial({color:'#c8deee',transparent:true,opacity:0,depthWrite:false}));
  node.position.set(Math.cos(a)*r,Math.sin(a)*r*.7,-.1-(i%3)*.14);network.add(node);nodes.push(node);
  if(i){const previous=nodes[Math.max(0,i-(i%3+1))],line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([previous.position,node.position]),new THREE.LineBasicMaterial({color:'#a2c5e2',transparent:true,opacity:0,depthWrite:false}));network.add(line);links.push(line)}
 }
 const core=V(0,0,0);
 function layout(mode){
  const overview=mode==='overview';
  cradle.position.set(overview?3.4:0,overview?3.72:1.08,overview?-.7:-2.6);cradle.scale.setScalar(overview?.55:.48);
  network.position.set(cradle.position.x,cradle.position.y+1.55,cradle.position.z-1.4);
  network.scale.setScalar(overview?1:.9);
  core.set(cradle.position.x,cradle.position.y+.25,cradle.position.z+.36);
  while(flow.children.length){const child=flow.children[0];flow.remove(child);if(child.isLine)child.geometry.dispose();child.material.dispose()}
  streams.length=packets.length=0;
  const starts=overview?[V(-1.2,1.92,.5),V(3,1.92,.5),V(7.2,1.92,.5)]:Array.from({length:5},(_,i)=>V((i-2)*3.5,.3,.6));
  starts.forEach((start,i)=>{
   const midpoint=start.clone().lerp(core,.5);midpoint.y+=overview?.6:.25;midpoint.z-=.6;
   const curve=new THREE.CatmullRomCurve3([start,midpoint,core]);
   const color=overview?['#799ed2','#74b8bf','#d5a47c'][i]:'#adc9ee';
   const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(40)),new THREE.LineBasicMaterial({color,transparent:true,opacity:0,depthWrite:false}));flow.add(line);streams.push(line);
   for(let j=0;j<2;j++){const mesh=new THREE.Mesh(packetGeo,new THREE.MeshBasicMaterial({color,transparent:true,opacity:0,depthWrite:false}));flow.add(mesh);packets.push({mesh,curve,offset:j*.5+i*.17})}
  });
 }
 let mode='';
 return {root,show(nextParent,nextMode){if(root.parent!==nextParent)nextParent.add(root);if(mode!==nextMode){mode=nextMode;layout(mode)}root.visible=true},hide(){root.visible=false},update(time,reduced,reveal=1,knowledge=1){
  const t=reduced?0:time,k=clamp(reveal),learned=clamp(knowledge);robot.update(t,reduced,k);
  network.rotation.z=reduced?0:Math.sin(t*.12)*.025;
  nodes.forEach((node,i)=>{const lit=clamp(learned*nodes.length-i);node.material.opacity=k*(.08+lit*(.62+(reduced?0:Math.sin(t*1.2+i)*.13)));node.scale.setScalar(1+lit*.6)});
  links.forEach((line,i)=>line.material.opacity=k*(.025+clamp(learned*nodes.length-i-1)*.24));
  streams.forEach(line=>line.material.opacity=.3*k);
  packets.forEach(({mesh,curve,offset})=>{mesh.position.copy(curve.getPoint(reduced?.7:(t*.16+offset)%1));mesh.material.opacity=.85*k});
 }};
}
