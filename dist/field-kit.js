import * as THREE from './vendor/three.module.js';
// Schematic hardware, not a depiction of a specified vendor or bill of materials.
export function createFieldKit(parent,{scale=1,input='camera'}={}){
 const group=new THREE.Group();parent.add(group);group.scale.setScalar(scale);
 const dark=new THREE.MeshStandardMaterial({color:'#26384c',metalness:.72,roughness:.3}),metal=new THREE.MeshStandardMaterial({color:'#a4b4c3',metalness:.75,roughness:.25}),black=new THREE.MeshStandardMaterial({color:'#070f19',roughness:.3}),blue=new THREE.MeshPhysicalMaterial({color:'#76b7d6',metalness:.4,roughness:.13,clearcoat:1});
 function box(g,w,h,d,mat,x=0,y=0,z=0){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(x,y,z);g.add(m);return m}
 const camera=new THREE.Group(),edge=new THREE.Group(),output=new THREE.Group();group.add(camera,edge,output);
 if(input==='sensor'){
  box(camera,1.45,1.24,.65,metal);box(camera,1.23,.97,.08,black,0,.02,.38);
  const dial=new THREE.Mesh(new THREE.CylinderGeometry(.32,.32,.05,32),blue);dial.rotation.x=Math.PI/2;dial.position.set(-.26,.1,.47);camera.add(dial);
  const needle=box(camera,.035,.24,.04,metal,-.21,.13,.51);needle.rotation.z=-.5;
  for(let i=0;i<3;i++)box(camera,.25,.06,.04,blue,.39,.2-i*.16,.46);
  box(camera,.2,.65,.2,metal,0,-.89,0);box(camera,1.1,.12,.75,dark,0,-1.24,0);
  for(let i=0;i<3;i++)box(camera,.15,.18,.2,metal,-.4+i*.4,.72,0);
 }else{
  box(camera,1.6,1.05,1.05,metal);box(camera,1.63,.8,.92,dark,0,0,.08);
  for(const [r,depth,z,mat]of[[.52,.35,.63,black],[.42,.3,.84,metal],[.34,.08,1.02,blue]]){const m=new THREE.Mesh(new THREE.CylinderGeometry(r,r,depth,40),mat);m.rotation.x=Math.PI/2;m.position.z=z;camera.add(m)}
  box(camera,.28,.75,.3,metal,0,-.85,0);box(camera,1.15,.12,.8,dark,0,-1.24,0);
 }
 box(edge,2.05,1.12,1.05,dark);for(let i=0;i<11;i++)box(edge,.08,.13,1.03,metal,-.93+i*.185,.63,0);
 box(edge,1.88,.87,.07,black,0,-.02,.57);for(let i=0;i<5;i++)box(edge,.2,.15,.03,metal,-.7+i*.33,-.16,.62);
 box(edge,.07,.07,.03,new THREE.MeshBasicMaterial({color:'#a8decb'}),.76,.23,.62);box(edge,2.32,.13,1.12,metal,0,-.63,0);
 box(output,1.3,1.05,.55,metal,0,-.12,0);box(output,1.07,.75,.05,black,0,-.05,.31);
 for(let i=0;i<5;i++)box(output,.12,.07,.04,blue,-.36+i*.18,.07,.36);
 box(output,.17,.6,.2,metal,0,.7,0);const lamp=new THREE.Mesh(new THREE.CylinderGeometry(.22,.22,.28,24),new THREE.MeshStandardMaterial({color:'#70af9b',emissive:'#204938',emissiveIntensity:.5,roughness:.3}));lamp.position.y=1.08;output.add(lamp);
 const curves=[],beads=[],lines=new THREE.Group();group.add(lines);
 let learning=false;
 function layout(mode=false){learning=mode;camera.position.set(mode?-8.15:-6.4,-1.28,mode?1.3:0);edge.position.set(mode?7.85:0,-1.9,mode?1.3:0);output.position.set(6.4,-1.6,0);output.visible=!mode;while(lines.children.length){const c=lines.children[0];lines.remove(c);c.geometry?.dispose();c.material?.dispose()}curves.length=beads.length=0;
 const pts=mode?[[[-7.2,-1.35,1.3],[-4.6,.7,.4],[0,1.1,-.5]],[[0,1.1,-.5],[4.6,.7,.4],[6.8,-1.7,1.3]]]:[[[-5.4,-1.3,0],[-3.4,-.9,0],[-1.2,-1.8,0]],[[1.2,-1.8,0],[3.4,-1,0],[5.4,-1.5,0]]];
 for(const ps of pts){const curve=new THREE.CatmullRomCurve3(ps.map(p=>new THREE.Vector3(...p)));curves.push(curve);const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(45)),new THREE.LineBasicMaterial({color:'#96bdd5',transparent:true,opacity:.45}));lines.add(line);for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),new THREE.MeshBasicMaterial({color:'#dceeff'}));lines.add(m);beads.push({m,curve,offset:i/3})}}
 }
 layout();
 function update(time,reveal=1){group.visible=reveal>0;group.scale.setScalar(scale*(.8+.2*reveal));group.position.y=(1-reveal)*-2;beads.forEach(({m,curve,offset})=>m.position.copy(curve.getPoint((time*.3+offset)%1)));lamp.material.emissiveIntensity=.4+.2*Math.sin(time*3)}
 return {group,camera,edge,output,layout,update};
}
