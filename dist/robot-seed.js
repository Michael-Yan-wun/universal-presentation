import * as THREE from './vendor/three.module.js';

// An original young robot: tangible armor, articulated limbs, restrained expression.
export function createRobotSeed(parent){
 const root=new THREE.Group();root.name='robot-seed';root.position.set(0,-.12,-.48);root.scale.setScalar(1.16);parent.add(root);
 const clamp=t=>Math.max(0,Math.min(1,t)),ease=t=>1-Math.pow(1-t,3),materials=[];
 function material(options){const m=new THREE.MeshPhysicalMaterial({...options,transparent:true});m.userData.baseOpacity=options.opacity??1;materials.push(m);return m}
 const shell=material({color:'#c2d0d9',metalness:.26,roughness:.27,clearcoat:.65,clearcoatRoughness:.2});
 const joint=material({color:'#263441',metalness:.66,roughness:.35}),metal=material({color:'#718697',metalness:.8,roughness:.28});
 const gold=material({color:'#c6a36d',metalness:.68,roughness:.3}),visorMat=material({color:'#071520',metalness:.2,roughness:.12,clearcoat:1});
 const eyeMat=material({color:'#d3edf4',emissive:'#87b9cb',emissiveIntensity:.75,roughness:.23,metalness:.1});
 const coreMat=material({color:'#cfb384',emissive:'#9a7344',emissiveIntensity:.42,roughness:.3,metalness:.4});
 function mesh(geometry,mat,g,pos=[0,0,0]){const m=new THREE.Mesh(geometry,mat);m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
 function rounded(w,h,d,r=.18){
  const bevel=Math.min(.11,d*.24),hw=w/2-bevel,hh=h/2-bevel,rad=Math.min(r,hw,hh),s=new THREE.Shape();
  s.moveTo(-hw+rad,-hh);s.lineTo(hw-rad,-hh);s.quadraticCurveTo(hw,-hh,hw,-hh+rad);s.lineTo(hw,hh-rad);s.quadraticCurveTo(hw,hh,hw-rad,hh);s.lineTo(-hw+rad,hh);s.quadraticCurveTo(-hw,hh,-hw,hh-rad);s.lineTo(-hw,-hh+rad);s.quadraticCurveTo(-hw,-hh,-hw+rad,-hh);
  const geo=new THREE.ExtrudeGeometry(s,{depth:d-2*bevel,bevelEnabled:true,bevelSize:bevel,bevelThickness:bevel,bevelSegments:5,curveSegments:16,steps:1});geo.translate(0,0,-(d-2*bevel)/2);return geo;
 }
 const sphere=new THREE.SphereGeometry(1,32,24);
 function ellipsoid(g,mat,pos,scale){const m=mesh(sphere,mat,g,pos);m.scale.set(...scale);return m}
 function cylinder(g,mat,r,h,pos,axis='y'){const m=mesh(new THREE.CylinderGeometry(r,r,h,40),mat,g,pos);if(axis==='x')m.rotation.z=Math.PI/2;if(axis==='z')m.rotation.x=Math.PI/2;return m}
 const torso=new THREE.Group();torso.name='breathing-torso';root.add(torso);
 const profile=[];for(let i=0;i<=40;i++){const t=i/40;profile.push(new THREE.Vector2(Math.sin(Math.PI*t)*(.9+.14*t),-1.05+2.2*t))}
 const armor=mesh(new THREE.LatheGeometry(profile,64),shell,torso,[0,.26,0]);armor.scale.z=.69;
 mesh(rounded(1.06,.73,.15,.24),joint,torso,[0,.40,.64]);
 cylinder(torso,gold,.255,.07,[0,.43,.755],'z');cylinder(torso,coreMat,.182,.09,[0,.43,.80],'z');
 for(const x of[-.33,.33])mesh(rounded(.055,.28,.045,.025),metal,torso,[x,.43,.74]);
 mesh(rounded(1.1,.14,.12,.055),metal,torso,[0,-.55,.49]);
 cylinder(root,joint,.34,.44,[0,1.53,0]);cylinder(root,metal,.40,.12,[0,1.63,0]);

 const head=new THREE.Group();head.name='curious-head';head.position.set(0,2.72,.03);root.add(head);
 mesh(rounded(2.80,2.03,1.71,.60),shell,head);
 mesh(rounded(2.47,1.40,.17,.45),metal,head,[0,.0,.805]);
 mesh(rounded(2.36,1.30,.16,.41),visorMat,head,[0,.02,.88]);
 const eyes=[];
 for(const side of[-1,1]){
  const eye=new THREE.Group();eye.name=side<0?'left-optical-eye':'right-optical-eye';eye.position.set(side*.53,.12,1.005);head.add(eye);
  mesh(rounded(.32,.48,.06,.15),eyeMat,eye);eyes.push(eye);
  cylinder(head,joint,.36,.20,[side*1.43,.02,-.02],'x');cylinder(head,gold,.255,.22,[side*1.46,.02,-.02],'x');cylinder(head,metal,.16,.235,[side*1.46,.02,-.02],'x');
 }
 const smile=new THREE.CatmullRomCurve3([new THREE.Vector3(-.21,-.29,1.005),new THREE.Vector3(0,-.33,1.02),new THREE.Vector3(.21,-.29,1.005)]);
 mesh(new THREE.TubeGeometry(smile,24,.019,8,false),eyeMat,head);
 mesh(rounded(.44,.055,.04,.025),gold,head,[0,.76,.85]);
 ellipsoid(head,joint,[0,1.065,-.12],[.20,.085,.14]);ellipsoid(head,coreMat,[0,1.135,-.12],[.07,.035,.07]);
 const hips=mesh(rounded(1.27,.43,.82,.18),joint,root,[0,-.87,0]);hips.name='waist-joint';
 for(const side of[-1,1]){
  const leg=new THREE.Group();leg.position.set(side*.42,-1.05,0);root.add(leg);
  cylinder(leg,metal,.21,.40,[0,-.13,0]);mesh(new THREE.CapsuleGeometry(.26,.42,8,24),shell,leg,[0,-.47,0]);
  ellipsoid(leg,joint,[0,-.87,.02],[.23,.23,.25]);cylinder(leg,gold,.14,.06,[0,-.87,.245],'z');
  mesh(new THREE.CapsuleGeometry(.235,.36,8,24),shell,leg,[0,-1.21,.025]);
  mesh(rounded(.70,.32,1.08,.18),shell,leg,[side*.02,-1.61,.24]);mesh(rounded(.73,.105,1.1,.14),joint,leg,[side*.02,-1.79,.24]);
 }
 const arms=[];
 for(const side of[-1,1]){
  const arm=new THREE.Group();arm.name=side<0?'left-arm':'right-arm';arm.position.set(side*1.10,1.03,0);root.add(arm);
  ellipsoid(arm,joint,[0,0,0],[.29,.29,.30]);cylinder(arm,metal,.20,.09,[side*.24,0,0],'x');
  mesh(new THREE.CapsuleGeometry(.26,.52,8,24),shell,arm,[0,-.55,.02]);
  const forearm=new THREE.Group();forearm.position.set(0,-1.02,.03);arm.add(forearm);
  ellipsoid(forearm,joint,[0,0,0],[.23,.23,.24]);cylinder(forearm,gold,.12,.07,[0,0,.23],'z');
  mesh(new THREE.CapsuleGeometry(.235,.40,8,24),shell,forearm,[0,-.41,.035]);
  const hand=new THREE.Group();hand.name='sensor-hand';hand.position.set(0,-.88,.07);forearm.add(hand);
  mesh(rounded(.41,.36,.25,.11),metal,hand);
  for(let i=0;i<3;i++){const finger=mesh(new THREE.CapsuleGeometry(.064,.17,5,12),shell,hand,[(i-1)*.13,-.285,.025]);finger.rotation.x=-.13}
  const thumb=mesh(new THREE.CapsuleGeometry(.075,.13,5,12),shell,hand,[side*.25,-.06,.06]);thumb.rotation.z=side*.5;
  arms.push({arm,forearm,hand,side});
 }
 // Sparse digital motes support the solid form instead of defining its silhouette.
 const motes=[];for(let i=0;i<180;i++){const a=i*2.399963,y=-2.5+(i%45)/44*6.2,r=1.6+.18*Math.sin(i*.7);motes.push(Math.cos(a)*r,y,Math.sin(a)*r*.8-.45)}
 const moteGeo=new THREE.BufferGeometry();moteGeo.setAttribute('position',new THREE.Float32BufferAttribute(motes,3));
 const moteMat=new THREE.PointsMaterial({color:'#8eb4c6',size:.021,transparent:true,opacity:.22,depthWrite:false});const dust=new THREE.Points(moteGeo,moteMat);root.add(dust);
 return {root,update(time,reduced,reveal=1){
  const t=reduced?0:time,k=ease(clamp(reveal));root.visible=k>.001;
  root.position.y=-.12+(reduced?0:Math.sin(t*1.1)*.035)-(1-k)*.65;
  root.rotation.y=reduced?0:Math.sin(t*.17)*.04;
  torso.scale.set(1+(reduced?0:Math.sin(t*1.1)*.009),1+(reduced?0:Math.sin(t*1.1)*.014),1);
  head.rotation.set(reduced?0:Math.sin(t*.46)*.035,reduced?0:Math.sin(t*.30)*.16,reduced?-.045:Math.sin(t*.23)*.055-.035);
  const blinkTime=t%7.7,blink=reduced?1:1-.91*Math.exp(-Math.pow((blinkTime-5.7)/.095,2));
  eyes.forEach((eye,i)=>{eye.scale.y=blink;eye.position.x=(i?1:-1)*.53+(reduced?0:Math.sin(t*.30)*.045)});
  arms.forEach(({arm,forearm,hand,side})=>{
   const reach=reduced?0:Math.pow(Math.max(0,Math.sin(t*.33+side*.9)),3);
   arm.rotation.z=side*(.18+reach*.27);arm.rotation.x=-.08-reach*.11;
   forearm.rotation.x=-.22-reach*.32;forearm.rotation.z=side*(.08+reach*.10);hand.rotation.x=-.06-reach*.12;
  });
  coreMat.emissiveIntensity=.36+(reduced?0:(Math.sin(t*1.1)+1)*.12);dust.rotation.y=t*.055;moteMat.opacity=.22*k;
  for(const m of materials){m.opacity=m.userData.baseOpacity*k;m.depthWrite=k>.98}
 }};
}
