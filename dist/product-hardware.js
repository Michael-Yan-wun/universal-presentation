import * as THREE from './vendor/three.module.js';

// Original geometry from official APLEX / NVIDIA exterior references.
// The open workstation is a configuration illustration, not an OEM chassis.
function sculpture(parent,name){
 const root=new THREE.Group();root.name=name;parent.add(root);
 const resources=new Set(),cache=new Map(),fans=[],signals=[];
 const keep=x=>(resources.add(x),x);
 function mat(color,metalness=.55,roughness=.32){return keep(new THREE.MeshStandardMaterial({color,metalness,roughness}));}
 const dark=mat('#111821',.48,.35),black=mat('#04090e',.18,.55),silver=mat('#b4bdc3',.72,.25),steel=mat('#65717a',.65,.28),blue=mat('#2378ac',.3,.3),green=mat('#3b8877',.25,.4),gold=mat('#b8a278',.75,.3);
 const glow=mat('#c5e5e2',.2,.25);glow.emissive.set('#7cbac5');glow.emissiveIntensity=.6;
 function box(w,h,d){const key=[w,h,d].join(',');if(!cache.has(key))cache.set(key,keep(new THREE.BoxGeometry(w,h,d)));return cache.get(key);}
 function mesh(p,g,m,pos=[0,0,0]){const o=new THREE.Mesh(g,m);o.position.set(...pos);o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
 function rect(p,w,h,d,m,x=0,y=0,z=0){return mesh(p,box(w,h,d),m,[x,y,z]);}
 function round(p,w,h,d,r,m,x=0,y=0,z=0){const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);const g=keep(new THREE.ExtrudeGeometry(s,{depth:d-.06,bevelEnabled:true,bevelSize:.03,bevelThickness:.03,bevelSegments:3,steps:1,curveSegments:12}));g.translate(0,0,-(d-.06)/2);return mesh(p,g,m,[x,y,z]);}
 function disc(p,r,d,m,x,y,z){const o=mesh(p,keep(new THREE.CylinderGeometry(r,r,d,32)),m,[x,y,z]);o.rotation.x=Math.PI/2;return o;}
 function batch(p,g,m,points,rotation=[0,0,0]){keep(g);const o=new THREE.InstancedMesh(g,m,points.length),a=new THREE.Object3D();points.forEach((pt,i)=>{a.position.set(...pt);a.rotation.set(...rotation);a.updateMatrix();o.setMatrixAt(i,a.matrix);});o.castShadow=true;o.receiveShadow=true;p.add(o);return o;}
 function screw(p,x,y,z){disc(p,.045,.025,silver,x,y,z);rect(p,.048,.009,.006,black,x,y,z+.017);}
 function port(p,x,y,w,h,insert=black){rect(p,w,h,.07,silver,x,y,2.83);rect(p,w-.08,h-.08,.04,black,x,y,2.88);if(insert!==black)rect(p,w-.13,.055,.035,insert,x,y-.035,2.91);}
 function fan(p,x,y,z,r=.43){disc(p,r,.08,black,x,y,z);const f=new THREE.Group();f.position.set(x,y,z+.06);p.add(f);fans.push(f);for(let i=0;i<9;i++){const a=new THREE.Group();a.rotation.z=i*Math.PI*2/9;f.add(a);const b=rect(a,r*.3,r*.65,.018,steel,0,r*.44,0);b.rotation.z=-.4;}disc(p,r*.2,.09,dark,x,y,z+.1);const ring=mesh(p,keep(new THREE.TorusGeometry(r,.018,8,64)),steel,[x,y,z+.12]);return ring;}
 function plinth(p,w,d,y,color){round(p,w,.15,d,.12,dark,0,y,0);round(p,w+.15,.065,d+.12,.13,black,0,y-.105,0);const trim=mat(color,.6,.25);rect(p,w-.2,.022,.025,trim,0,y+.081,d/2-.1);}
 function route(p,points,color){const curve=new THREE.CatmullRomCurve3(points.map(a=>new THREE.Vector3(...a))),g=keep(new THREE.BufferGeometry().setFromPoints(curve.getPoints(64)));p.add(new THREE.Line(g,keep(new THREE.LineBasicMaterial({color,transparent:true,opacity:.4}))));const dot=mesh(p,keep(new THREE.SphereGeometry(.035,12,8)),keep(new THREE.MeshBasicMaterial({color})));signals.push({dot,curve});}
 return {root,mat,dark,black,silver,steel,blue,green,gold,glow,mesh,rect,round,disc,batch,box,screw,port,fan,plinth,route,keep,
 update(time,reduced){fans.forEach((f,i)=>f.rotation.z=reduced?0:-time*(1.2+i*.12));signals.forEach(({dot,curve},i)=>dot.position.copy(curve.getPointAt(reduced?.6:(time*.15+i*.3)%1)));glow.emissiveIntensity=reduced?.6:.6+.12*Math.sin(time*1.6);},
 dispose(){resources.forEach(r=>r.dispose());}};
}

export function createAVS530(parent){
 const k=sculpture(parent,'avs530'),{root,rect,round,disc,batch,box,screw,port,dark,black,silver,steel,blue,green,glow,gold}=k;
 const chassis=new THREE.Group();chassis.name='avs530-chassis';root.add(chassis);
 // AVS-530: low, square fanless enclosure, silver top fins and black I/O face.
 round(chassis,6.3,2.15,5.6,.08,dark,0,-1.13,0);
 rect(chassis,6.35,.16,5.55,silver,0,.01,0);
 const fins=[];for(let i=0;i<36;i++)fins.push([0,.19,-2.67+i*.152]);batch(chassis,box(6.28,.31,.045),silver,fins);
 rect(chassis,6.22,2.04,.075,black,0,-1.14,2.81);
 for(const x of[-3.24,3.24]){rect(chassis,.58,.12,4.45,steel,x,-2.28,0);for(const z of[-1.8,1.8]){const hole=disc(chassis,.085,.02,black,x,-2.21,z);hole.rotation.x=0;}}
 for(const x of[-3.02,3.02])for(const y of[-.25,-1.94])screw(chassis,x,y,2.87);
 // Front removable drive bay.
 round(chassis,5.7,.52,.055,.045,dark,0,-1.77,2.86);for(const x of[-2.65,2.65])screw(chassis,x,-1.77,2.91);
 disc(chassis,.13,.055,silver,-2.7,-.4,2.9);disc(chassis,.085,.06,dark,-2.7,-.4,2.94);
 for(const x of[-2.32,-2.1])disc(chassis,.031,.03,glow,x,-.36,2.91);
 disc(chassis,.064,.03,green,-1.77,-.37,2.91);disc(chassis,.064,.03,k.mat('#974a54',.2,.4),-1.52,-.37,2.91);
 // Green 3-pin terminal, DP / HDMI, 2 LAN and 4 USB.
 rect(chassis,.62,.44,.22,green,-2.62,-1.03,2.94);for(let i=0;i<3;i++){disc(chassis,.049,.02,black,-2.82+i*.2,-1.04,3.06);rect(chassis,.105,.015,.025,silver,-2.82+i*.2,-.89,3.065);}
 port(chassis,-1.92,-.84,.38,.18);port(chassis,-1.92,-1.17,.38,.16);
 for(const x of[-1.04,-.37]){port(chassis,x,-.61,.48,.39);rect(chassis,.045,.025,.02,glow,x+.15,-.75,2.92);for(const y of[-1.02,-1.3])port(chassis,x,y,.45,.19,blue);}
 // Four nine-pin serial connectors, arranged in two rows as on the reference.
 for(let col=0;col<2;col++)for(let row=0;row<2;row++){const x=.75+col*1.35,y=-.6-row*.62;round(chassis,.88,.32,.08,.07,silver,x,y,2.86);round(chassis,.65,.21,.06,.045,col===0?green:black,x,y,2.92);for(let j=0;j<9;j++)disc(chassis,.015,.02,gold,x-.21+(j%5)*.1+(j>4?.05:0),y+(j>4?-.045:.045),2.97);for(const dx of[-.5,.5])disc(chassis,.06,.07,steel,x+dx,y,2.9);}
 k.plinth(root,7.35,6.1,-2.49,'#819dcd');
 for(const x of[-2.9,2.9])k.route(root,[[x,.6,-.7],[x,.65,1.4],[x,.25,2.1]],'#abc5f4');
 return {...k,chassis};
}

export function createDGXSpark(parent,{plinth=true}={}){
 const k=sculpture(parent,'dgx-spark'),{root,round,rect,batch,black,steel}=k;
 const champagne=k.mat('#bea678',.72,.27),rim=k.mat('#d5c39a',.68,.28);
 // Rounded square top, finely perforated gold front, vertical corner insets.
 const shell=round(root,3.5,3.5,1.06,.24,champagne,0,0,0);shell.rotation.x=Math.PI/2;
 round(root,3.36,.83,.055,.11,rim,0,-.04,1.75);
 const holes=[];for(let row=0;row<13;row++)for(let col=0;col<68;col++)holes.push([-1.57+col*.047+(row%2)*.0235,-.36+row*.053,1.784]);
 batch(root,new THREE.CircleGeometry(.0115,6),black,holes);
 for(const x of[-1.39,1.39])round(root,.075,.79,.03,.025,black,x,-.025,1.807);
 round(root,3.29,.09,3.28,.15,black,0,-.58,0);
 for(const x of[-1.25,1.25])for(const z of[-1.25,1.25])rect(root,.35,.08,.35,black,x,-.66,z);
 // Subtle machined top badge; rear I/O stays on the rear of the unit.
 round(root,.6,.035,.18,.035,steel,.95,.55,-1.05);
 for(let i=0;i<4;i++){round(root,.27,.12,.06,.045,black,-1+i*.5,-.02,-1.79);}
 rect(root,.4,.3,.035,black,1.1,-.02,-1.79);
 if(plinth)k.plinth(root,4.4,4.2,-.81,'#c8af81');
 return k;
}

export function createRTXWorkstation(parent,{plinth=true}={}){
 const k=sculpture(parent,'rtx-pro-workstation'),{root,rect,round,disc,screw,fan,batch,box,dark,black,silver,steel,glow}=k;
 // Original tower with a side cutaway. One illustrated RTX PRO 6000 card.
 const body=new THREE.Group();body.name='workstation-cutaway';body.rotation.y=-.43;root.add(body);
 round(body,2.68,4.8,3.65,.13,dark,0,0,0);
 // Open front-facing cutaway is a presentation view of the side panel.
 round(body,2.43,4.36,.06,.12,black,0,.02,1.86);
 rect(body,2.05,3.66,.07,k.mat('#29353b',.4,.4),0,.25,1.92);
 // Motherboard, CPU cooling and two memory banks.
 fan(body,-.54,1.22,2.01,.48);
 for(let i=0;i<4;i++){rect(body,.1,1.05,.12,black,.18+i*.24,1.22,2.04);rect(body,.04,.92,.02,steel,.18+i*.24,1.22,2.12);}
 for(let i=0;i<9;i++)rect(body,.08,.12,.055,silver,-.9+(i%3)*.18,.35-Math.floor(i/3)*.18,2.02);
 // GPU: two dense fin fields and an X-shaped structural spine.
 const gpu=new THREE.Group();gpu.name='rtx-pro-6000';gpu.position.set(0,-.35,2.11);body.add(gpu);
 round(gpu,2.24,.9,.4,.12,steel);round(gpu,2.13,.79,.43,.1,black);
 const fins=[];for(const sign of[-1,1])for(let i=0;i<22;i++)fins.push([sign*(.25+i*.035),0,.234]);batch(gpu,box(.012,.67,.035),steel,fins);
 for(const sign of[-1,1]){const brace=rect(gpu,1.1,.10,.065,dark,0,0,.272);brace.rotation.z=sign*.73;}
 rect(gpu,2.02,.07,.08,silver,0,-.4,.18);rect(gpu,.5,.035,.025,k.gold,.65,.32,.28);
 // PSU shroud, exhaust column, upper USB and recessed power light.
 rect(body,2.25,.73,.31,dark,0,-1.75,1.99);
 for(let i=0;i<15;i++)rect(body,.065,.34,.025,black,-.92+i*.13,-1.75,2.16);
 rect(body,.13,4.3,.05,steel,1.19,0,1.93);
 for(const y of[1.48,.42,-.64])fan(body,.95,y,2.01,.22);
 rect(body,.025,3.85,.025,glow,-1.15,0,1.99);
 for(const x of[-1.2,1.2])for(const y of[-2.12,2.12])screw(body,x,y,1.94);
 // Exterior right panel, visible from the keynote camera.
 rect(body,.035,4.5,3.35,dark,1.37,0,0);
 const vents=[];for(let y=0;y<28;y++)for(let z=0;z<17;z++)vents.push([1.394,-1.6+y*.12,-1.4+z*.16]);batch(body,new THREE.CircleGeometry(.022,8),black,vents,[0,Math.PI/2,0]);
 disc(body,.06,.025,glow,.85,2.25,1.89);
 for(const x of[-.8,.8])rect(body,.38,.16,2.9,black,x,-2.5,0);
 if(plinth)k.plinth(root,3.65,4.5,-2.72,'#b29acd');
 return k;
}

export function createProductHardware(parent,id){
 const root=new THREE.Group();root.name=`${id}-hardware`;root.visible=false;parent.add(root);
 const models=id==='analytics'?[createAVS530(root)]:[createDGXSpark(root,{plinth:false}),createRTXWorkstation(root,{plinth:false})];
 let stage=null;
 if(id==='chat'){
  // A single exhibition deck ties the two deployment options to one platform.
  stage=sculpture(root,'winchat-shared-stage');
  const metal=stage.mat('#363445',.64,.32),edge=stage.mat('#b7a3d2',.55,.25);
  stage.round(stage.root,12.6,.32,6.05,.22,metal,0,-2.83,0);
  stage.round(stage.root,12.9,.12,6.2,.24,stage.black,0,-3.06,0);
  stage.rect(stage.root,12.05,.035,.035,edge,0,-2.65,2.98);
  // A raised matching pedestal gives the compact machine visual presence.
  stage.round(stage.root,4.65,1.62,4.65,.14,metal,-3.25,-1.84,.12);
  stage.round(stage.root,4.75,.075,4.75,.15,stage.steel,-3.25,-.99,.12);
  stage.rect(stage.root,4.28,.025,.025,edge,-3.25,-1.04,2.5);
  models[0].root.position.set(-3.25,-.25,.12);models[0].root.scale.setScalar(1.06);
  models[0].root.rotation.y=.025;
  models[1].root.position.set(3,-.47,-.35);models[1].root.scale.setScalar(.86);
  // Recessed routes stay on the common deck; no dangling visual connectors.
  for(const side of[-1,1])stage.route(stage.root,[[0,-2.65,2.65],[side*1.25,-2.65,2.65],[side*4.9,-2.65,2.65],[side*5.65,-2.65,1.9],[side*5.65,-2.65,-1.6]],'#c0a6e1');
  // Fine architectural uprights carry the software layer behind both machines.
  for(const x of[-5.4,5.4]){
   stage.round(stage.root,.055,5.2,.055,.02,edge,x,-.08,-1.9);
   stage.route(stage.root,[[x,-2.6,-1.9],[x,0,-1.9],[x,2.52,-1.9],[x*.45,2.52,-1.9]],'#cdb8e5');
  }
  stage.rect(stage.root,10.8,.035,.055,edge,0,2.52,-1.9);
  const front=new THREE.PointLight(0xeee8fa,20,16,2);front.position.set(1,2,6);root.add(front);
 }
 const light=new THREE.PointLight(id==='chat'?0xd5c0ed:0xb2cbef,5,14,2);light.position.set(-2,5,4);root.add(light);
 return {root,models,update(time,progress=1,reduced=false){const p=THREE.MathUtils.clamp(progress,0,1),k=1-(1-p)**3;root.visible=p>0;root.position.y=-2.1*(1-k);models.forEach(m=>m.update(time,reduced));stage?.update(time,reduced);},dispose(){models.forEach(m=>m.dispose());stage?.dispose();}};
}
