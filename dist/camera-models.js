import * as THREE from './vendor/three.module.js';

// Product-photo studies. Shapes are authored here; no manufacturer photo is textured onto a model.
// References and distinctions between these representative devices are recorded in README.md.
export function createCameraModel(type){
 const root=new THREE.Group();root.name=`camera-${type}`;
 const V=(...v)=>new THREE.Vector3(...v),parts=[];
 const metal=new THREE.MeshPhysicalMaterial({color:'#c5cbd0',metalness:.66,roughness:.29,clearcoat:.3});
 const black=new THREE.MeshPhysicalMaterial({color:'#15191e',metalness:.15,roughness:.34,clearcoat:.25});
 const rubber=new THREE.MeshStandardMaterial({color:'#080c11',roughness:.66});
 const white=new THREE.MeshPhysicalMaterial({color:'#d9dddb',metalness:.06,roughness:.32,clearcoat:.4});
 const glass=new THREE.MeshPhysicalMaterial({color:'#133341',metalness:.48,roughness:.08,clearcoat:1});
 const blue=new THREE.MeshStandardMaterial({color:'#4e8aaf',emissive:'#234b64',emissiveIntensity:.22,roughness:.35});
 function part(name,offset,delay){const g=new THREE.Group();g.name=name;root.add(g);parts.push({g,offset:V(...offset),delay});return g}
 function mesh(g,geo,mat,p=[0,0,0]){const m=new THREE.Mesh(geo,mat);m.position.set(...p);m.castShadow=true;m.receiveShadow=true;g.add(m);return m}
 function rounded(w,h,d,r=.05){
  const b=Math.min(.025,d*.2),x=w/2-b,y=h/2-b,s=new THREE.Shape();r=Math.min(r,x,y);
  s.moveTo(-x+r,-y);s.lineTo(x-r,-y);s.quadraticCurveTo(x,-y,x,-y+r);s.lineTo(x,y-r);s.quadraticCurveTo(x,y,x-r,y);s.lineTo(-x+r,y);s.quadraticCurveTo(-x,y,-x,y-r);s.lineTo(-x,-y+r);s.quadraticCurveTo(-x,-y,-x+r,-y);
  const geo=new THREE.ExtrudeGeometry(s,{depth:d-2*b,bevelEnabled:true,bevelSize:b,bevelThickness:b,bevelSegments:3,curveSegments:8,steps:1});geo.translate(0,0,-(d-2*b)/2);return geo;
 }
 const box=(g,w,h,d,mat,p,r=.05)=>mesh(g,rounded(w,h,d,r),mat,p);
 function disc(g,r,d,mat,p,axis='z'){const m=mesh(g,new THREE.CylinderGeometry(r,r,d,48),mat,p);if(axis==='z')m.rotation.x=Math.PI/2;if(axis==='x')m.rotation.z=Math.PI/2;return m}
 const ring=(g,r,t,mat,p)=>mesh(g,new THREE.TorusGeometry(r,t,8,64),mat,p);
 function screw(g,x,y,z,r=.045){disc(g,r,.015,metal,[x,y,z]);box(g,r*1.15,.012,.01,rubber,[x,y,z+.011],.002)}
 function printing(g,text,w,h,p,rot=0,color='#e6e8e8'){
  // Canvas is only used for crisp product lettering, never the object silhouette.
  if(typeof document==='undefined')return;
  const canvas=document.createElement('canvas');canvas.width=1024;canvas.height=256;
  const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.textAlign='center';ctx.textBaseline='middle';ctx.font=`600 ${Math.min(160,950/(text.length*.64))}px Arial`;ctx.fillText(text,512,128);
  const tex=new THREE.CanvasTexture(canvas);tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=4;
  const m=mesh(g,new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,depthWrite:false,toneMapped:false}),p);m.rotation.y=rot;
 }
 function optic(g,r,z){
  disc(g,r,.09,rubber,[0,0,z]);ring(g,r*.86,r*.09,black,[0,0,z+.07]);disc(g,r*.66,.026,glass,[0,0,z+.073]);
  ring(g,r*.52,.012,metal,[0,0,z+.091]);disc(g,r*.34,.015,rubber,[0,0,z+.093]);
  const highlight=mesh(g,new THREE.CircleGeometry(r*.13,24),new THREE.MeshBasicMaterial({color:'#bfd9e0',transparent:true,opacity:.52,depthWrite:false}),[-r*.22,r*.24,z+.107]);highlight.scale.set(1,.48,1);
 }
 let pivot=null;
 if(type==='industrial'){
  const body=part('basler-black-housing',[0,.25,-.7],0),front=part('basler-c-mount',[0,0,1.0],.12),rear=part('basler-usb-io',[0,0,-1.2],.22);
  box(body,1.3,1.3,1.65,black,[0,0,0],.065);
  for(const side of[-1,1]){
   const panel=box(body,1.40,1.06,.018,black,[side*.662,0,0],.025);panel.rotation.y=Math.PI/2;
   printing(body,'ace2 Basic',1.20,.27,[side*.681,.23,0],side*Math.PI/2);
   printing(body,'BASLER',1.0,.24,[side*.683,-.05,0],side*Math.PI/2);
   for(const y of[-.48,.48])for(const z of[-.60,.60]){const bolt=disc(body,.062,.025,rubber,[side*.681,y,z],'x');bolt.name='side-fastener'}
  }
  box(front,1.40,1.40,.18,metal,[0,0,.83],.065);
  disc(front,.565,.038,rubber,[0,0,.939]);
  // Open threaded C mount and visible sensor, matching the official lensless body photo.
  for(let i=0;i<7;i++)ring(front,.548,.013,metal,[0,0,.94+i*.028]);
  ring(front,.586,.045,metal,[0,0,1.10]);
  box(front,.63,.54,.02,new THREE.MeshPhysicalMaterial({color:'#963c50',metalness:.36,roughness:.10,clearcoat:1}),[0,0,.964],.024);
  box(front,.41,.36,.012,new THREE.MeshPhysicalMaterial({color:'#b55365',metalness:.46,roughness:.15,clearcoat:1}),[0,0,.98],.005);
  for(const x of[-.58,.58])for(const y of[-.58,.58])screw(front,x,y,.941,.032);
  box(rear,1.37,1.37,.14,metal,[0,0,-.84],.055);
  box(rear,.23,.62,.03,black,[-.33,.13,-.927],.025);
  box(rear,.15,.23,.035,rubber,[-.33,.265,-.947],.008);box(rear,.15,.24,.035,rubber,[-.33,-.025,-.947],.008);
  for(const y of[-.3,.55])disc(rear,.033,.03,rubber,[-.33,y,-.93]);
  disc(rear,.22,.15,metal,[.27,-.32,-.96]);disc(rear,.164,.16,rubber,[.27,-.32,-.98]);
  for(let i=0;i<6;i++){const a=i*Math.PI/3;disc(rear,.022,.01,metal,[.27+Math.cos(a)*.10,-.32+Math.sin(a)*.10,-1.067])}
  disc(rear,.028,.014,blue,[.36,.46,-.929]);
 }else if(type==='ip'){
  const mount=part('axis-wall-mount',[0,-.7,-.6],.20),body=part('axis-weatherproof-body',[0,.35,-.8],0),face=part('axis-optical-face',[0,0,1.15],.13);
  // Long white bullet housing, projecting hood, dark circular window and adjustable wall arm.
  disc(body,.69,1.83,white,[0,.13,0]);disc(body,.705,.14,white,[0,.13,-.91]);
  const hoodMat=white.clone();hoodMat.side=THREE.DoubleSide;
  const hood=mesh(body,new THREE.CylinderGeometry(.77,.77,2.19,64,1,true,Math.PI*.5,Math.PI),hoodMat,[0,.13,.18]);hood.rotation.x=Math.PI/2;hood.name='sunshield';
  box(body,.62,.06,1.95,white,[0,.884,.17],.018);
  const label=part('axis-side-wordmark',[0,.35,-.8],0);printing(label,'AXIS',.71,.21,[.69,.23,0],Math.PI/2,'#555f66');
  disc(face,.682,.10,rubber,[0,.13,.967]);ring(face,.642,.035,black,[0,.13,1.03]);
  box(face,1.02,.44,.035,black,[0,.15,1.038],.07);
  const lensGroup=new THREE.Group();lensGroup.position.y=.16;face.add(lensGroup);optic(lensGroup,.25,1.071);
  disc(face,.035,.018,blue,[0,-.28,1.045]);for(const x of[-.44,.44])screw(face,x,.51,1.032,.025);
  mesh(mount,new THREE.SphereGeometry(.24,24,16),white,[0,.13,-1.07]);
  const arm=box(mount,.34,.40,.64,white,[0,.26,-1.29],.10);arm.rotation.x=.24;
  disc(mount,.81,.16,white,[0,.33,-1.66]);disc(mount,.77,.035,rubber,[0,.33,-1.755]);disc(mount,.35,.16,white,[0,.33,-1.52]);
  for(const x of[-.49,.49])for(const y of[-.16,.82])screw(mount,x,y,-1.567,.042);
 }else{
  const body=part('c920-wide-body',[0,.38,-.65],0),front=part('c920-optics-microphones',[0,0,.75],.14),stand=part('c920-folding-clip',[0,-.85,-.25],.24);
  box(body,2.26,.81,.64,black,[0,.13,0],.19);box(body,2.18,.68,.07,rubber,[0,.13,-.355],.16);
  box(front,2.20,.73,.095,black,[0,.13,.355],.17);
  // C920: central glass square with circular optics, two textured microphone wings, blue indicators.
  box(front,1.38,.69,.055,rubber,[0,.13,.42],.085);
  const lensGroup=new THREE.Group();lensGroup.position.y=.16;front.add(lensGroup);optic(lensGroup,.28,.454);
  printing(front,'HD 1080p',.28,.07,[-.49,.12,.461]);printing(front,'logi',.28,.12,[.48,.15,.461]);
  for(const side of[-1,1]){
   box(front,.040,.57,.025,blue,[side*.718,.13,.435],.018);
   const grille=new THREE.InstancedMesh(new THREE.CircleGeometry(.016,8),rubber,55);const dummy=new THREE.Object3D();
   for(let i=0;i<55;i++){dummy.position.set(side*(.79+(i%5)*.052),-.12+Math.floor(i/5)*.05,.418);dummy.updateMatrix();grille.setMatrixAt(i,dummy.matrix)}front.add(grille);
  }
  disc(stand,.15,.92,black,[0,-.35,-.06],'x');
  box(stand,1.13,.13,.88,black,[0,-.48,-.22],.055);
  pivot=new THREE.Group();pivot.name='clip-hinge';pivot.position.set(0,-.48,-.52);stand.add(pivot);
  box(pivot,1.08,.59,.12,black,[0,-.27,0],.065);box(pivot,1.09,.08,.42,black,[0,-.54,.14],.035);box(pivot,.91,.045,.31,rubber,[0,-.49,.16],.018);
  const curve=new THREE.CatmullRomCurve3([V(.58,.1,-.32),V(1.13,-.04,-.47),V(1.33,-.65,-.50),V(1.10,-1.01,-.18),V(.62,-1.12,.16)]);
  mesh(stand,new THREE.TubeGeometry(curve,40,.033,8,false),rubber);box(stand,.25,.115,.34,black,[.57,-1.12,.30],.03);box(stand,.20,.077,.20,metal,[.57,-1.12,.55],.006);
  for(const x of[.515,.615])box(stand,.031,.013,.038,rubber,[x,-1.077,.565],.001);
 }
 const restYaw=type==='industrial'?-.50:type==='ip'?-.50:-.16;
 return {root,update(progress,time,reduced){
  root.rotation.set(type==='ip'?.05:-.06,restYaw+(reduced?0:Math.sin(time*.36)*.13),0);
  for(const {g,offset,delay}of parts){const p=reduced?1:THREE.MathUtils.clamp((progress-delay)/(1-delay),0,1),k=1-Math.pow(1-p,3);g.position.copy(offset).multiplyScalar(1-k);g.scale.setScalar(.88+.12*k);g.visible=p>0}
  if(pivot)pivot.rotation.x=-.20-(reduced?0:(1-THREE.MathUtils.clamp(progress,0,1))*.65);
 }};
}
