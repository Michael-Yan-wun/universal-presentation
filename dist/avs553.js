import * as THREE from './vendor/three.module.js';

// Sculpted from APLEX's AVS-553 photographs. Horizontal keynote composition;
// visual reference only, not a certified installation or a configured system BOM.
export function createAVS553(parent){
 const root=new THREE.Group();root.name='avs553';parent.add(root);
 const chassis=new THREE.Group();chassis.name='avs553-chassis';chassis.rotation.z=-Math.PI/2;root.add(chassis);
 const resources=new Set();
 const material=(color,metalness=.5,roughness=.35)=>{const m=new THREE.MeshStandardMaterial({color,metalness,roughness});resources.add(m);return m};
 const graphite=material('#30343a',.52,.31),black=material('#080c11',.22,.42),silver=material('#bcc4c8',.65,.29),edge=material('#7b8990',.64,.3),blue=material('#176b95',.35,.3),green=material('#286b62',.25,.38),red=material('#8b2b38',.15,.4),gold=material('#b59b62',.65,.35);
 const led=material('#b0e8cf',.15,.25);led.emissive.set('#63c5a1');led.emissiveIntensity=.8;
 const geoCache=new Map();
 function boxGeo(w,h,d){const k=[w,h,d].join(',');if(!geoCache.has(k)){const g=new THREE.BoxGeometry(w,h,d);geoCache.set(k,g);resources.add(g)}return geoCache.get(k)}
 function box(p,w,h,d,m,x=0,y=0,z=0){const o=new THREE.Mesh(boxGeo(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;p.add(o);return o}
 function cylinder(p,r,h,m,x,y,z){const g=new THREE.CylinderGeometry(r,r,h,32);resources.add(g);const o=new THREE.Mesh(g,m);o.rotation.x=Math.PI/2;o.position.set(x,y,z);p.add(o);return o}
 function batch(p,g,m,positions,rotate){resources.add(g);const mesh=new THREE.InstancedMesh(g,m,positions.length),dummy=new THREE.Object3D();positions.forEach((a,i)=>{dummy.position.set(...a);dummy.rotation.set(...(rotate||[0,0,0]));dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix)});p.add(mesh);return mesh}
 // Proportions follow the photographed upright unit: narrow, tall rear panel.
 box(chassis,3.06,6.76,4.72,graphite);box(chassis,3.12,6.82,.11,graphite,0,0,2.4);
 box(chassis,.12,6.72,4.72,silver,-1.57,0,0);
 const fins=[];for(let i=0;i<47;i++)fins.push([-1.71,0,-2.28+i*.098]);batch(chassis,boxGeo(.25,6.68,.038),silver,fins);
 box(chassis,.09,6.7,4.72,edge,-1.54,0,0);
 // Front vent perforations and machined side panel.
 const perforations=[];for(let y=0;y<5;y++)for(let x=0;x<15;x++)perforations.push([-.05+x*.094,2.56+y*.11,2.464]);
 batch(chassis,new THREE.CircleGeometry(.028,10),black,perforations);
 const sideHoles=[];for(let y=0;y<20;y++)for(let z=0;z<29;z++)sideHoles.push([1.535,-1.35+y*.135,-1.8+z*.13]);
 batch(chassis,new THREE.CircleGeometry(.034,10),black,sideHoles,[0,Math.PI/2,0]);
 // Case seams, mounting ears and visible screws.
 for(const y of[-3.3,3.3])box(chassis,3.0,.018,4.61,black,0,y,0);
 for(const x of[-1.54,1.54])for(const z of[-1.9,1.9]){box(chassis,.7,.09,.52,edge,x,-3.45,z);const hole=cylinder(chassis,.07,.012,black,x+(x<0?-.2:.2),-3.394,z);hole.rotation.x=0;}
 const screws=[];for(const x of[-1.4,1.4])for(const y of[-3.19,-.4,3.16])screws.push([x,y,2.47]);
 batch(chassis,new THREE.CylinderGeometry(.055,.055,.026,16),edge,screws,[Math.PI/2,0,0]);
 // Audio, power, DP and HDMI.
 cylinder(chassis,.063,.035,green,-.98,2.88,2.49);cylinder(chassis,.063,.035,red,-.7,2.88,2.49);cylinder(chassis,.095,.048,silver,-.28,2.88,2.49);
 cylinder(chassis,.068,.052,edge,-.28,2.88,2.50);
 for(const x of[-1.0,-.72]){box(chassis,.17,.37,.05,silver,x,2.4,2.48);box(chassis,.105,.27,.04,black,x,2.4,2.52)}
 function serial(x,y){box(chassis,.27,.45,.06,silver,x,y,2.49);box(chassis,.17,.33,.05,green,x,y,2.54);for(let a=0;a<2;a++)for(let b=0;b<4;b++)cylinder(chassis,.012,.02,gold,x-.035+a*.07,y-.1+b*.065,2.575);for(const dy of[-.27,.27])cylinder(chassis,.037,.05,silver,x,y+dy,2.52)}
 for(const x of[-1,-.61])for(const y of[1.67,.88])serial(x,y);
 box(chassis,.26,.45,.05,black,-.65,.24,2.49);
 for(let row=0;row<4;row++){const y=-.43-row*.57;
  box(chassis,.31,.37,.07,silver,-1.03,y,2.49);box(chassis,.235,.27,.06,black,-1.03,y,2.54);box(chassis,.15,.06,.025,edge,-1.03,y+.1,2.58);box(chassis,.042,.032,.02,led,-.925,y-.1,2.585);
  for(const x of[-.65,-.39]){box(chassis,.2,.37,.055,silver,x,y,2.49);box(chassis,.13,.29,.04,black,x,y,2.53);box(chassis,.035,.23,.04,blue,x-.028,y,2.56)}
 }
 // Three full-height expansion brackets, recessed inside the card bay.
 box(chassis,1.35,3.01,.06,black,.67,1.05,2.47);
 for(let i=0;i<3;i++){const x=.21+i*.41;box(chassis,.25,2.79,.05,silver,x,1.08,2.53);for(let j=0;j<8;j++)box(chassis,.07,.23,.025,black,x,2.25-j*.33,2.56);cylinder(chassis,.036,.02,edge,x,2.52,2.57)}
 // Dual CRPS PSU modules: fan grilles, sockets and red extraction tabs.
 const fans=[];
 for(const y of[-1.44,-2.59]){
  const psu=new THREE.Group();psu.name='avs553-crps';chassis.add(psu);box(psu,1.41,.98,.14,silver,.7,y,2.48);box(psu,1.34,.87,.04,black,.7,y,2.57);
  cylinder(psu,.36,.04,black,.4,y,2.61);const fan=new THREE.Group();fan.position.set(.4,y,2.64);psu.add(fan);fans.push(fan);
  for(let i=0;i<7;i++){const blade=box(fan,.09,.27,.018,edge,0,.16,0);const pivot=new THREE.Group();fan.remove(blade);pivot.add(blade);pivot.rotation.z=i*Math.PI*2/7;fan.add(pivot)}
  cylinder(psu,.115,.05,silver,.4,y,2.68);
  for(const r of[.2,.29,.37]){const g=new THREE.TorusGeometry(r,.012,6,48);resources.add(g);const grille=new THREE.Mesh(g,silver);grille.position.set(.4,y,2.70);psu.add(grille)}
  for(const a of[0,Math.PI/2]){const brace=box(psu,.77,.017,.02,edge,.4,y,2.70);brace.rotation.z=a;}
  box(psu,.46,.52,.12,graphite,1.04,y,2.65);box(psu,.33,.38,.06,black,1.04,y,2.73);
  for(const dx of[-.09,0,.09])box(psu,.026,.13,.02,silver,1.04+dx,y,2.77);
  box(psu,.13,.45,.2,red,1.38,y-.19,2.73);box(psu,.11,.12,.34,red,1.38,y-.35,2.88);
  for(const x of[.06,1.31])for(const dy of[-.38,.38])cylinder(psu,.036,.025,silver,x,y+dy,2.61);
 }
 box(chassis,.15,.12,.04,green,-.51,-3.05,2.5);box(chassis,.06,.04,.025,led,-.51,-3.05,2.54);
 // A low machined exhibition plinth carries the whole assembly.
 const stage=new THREE.Group();stage.name='avs553-plinth';root.add(stage);
 box(stage,8.05,.18,5.75,graphite,0,-1.92,0);box(stage,8.22,.08,5.9,black,0,-2.05,0);
 const copper=material('#a47548',.58,.3);box(stage,7.8,.024,.025,copper,0,-1.815,2.85);
 for(const x of[-3.88,3.88])box(stage,.025,.024,5.55,copper,x,-1.815,0);
 // Moving signals on recessed routes in the exhibition deck.
 const signals=[];
 const signalGeo=new THREE.SphereGeometry(.035,16,12);resources.add(signalGeo);
 const signalMat=new THREE.MeshBasicMaterial({color:'#d8c0a0'});resources.add(signalMat);
 const routeMat=new THREE.LineBasicMaterial({color:'#876848',transparent:true,opacity:.6});resources.add(routeMat);
 for(const side of[-1,1]){
  const points=[[side*.7,-1.81,2.65],[side*1.5,-1.81,2.77],[side*3.72,-1.81,2.77],[side*3.72,-1.81,-1.9]].map(p=>new THREE.Vector3(...p));
  const route=new THREE.CatmullRomCurve3(points,false,'centripetal');const g=new THREE.BufferGeometry().setFromPoints(route.getPoints(100));resources.add(g);stage.add(new THREE.Line(g,routeMat));
  const dot=new THREE.Mesh(signalGeo,signalMat);stage.add(dot);signals.push({dot,route});
 }
 return {root,chassis,update(time,progress=1,reduced=false){root.visible=progress>0;const k=1-Math.pow(1-THREE.MathUtils.clamp(progress,0,1),3);root.position.y=-2.7*(1-k);led.emissiveIntensity=reduced?.65:.65+Math.sin(time*1.4)*.18;fans.forEach((fan,i)=>fan.rotation.z=reduced?0:-time*(1.8+i*.16));signals.forEach(({dot,route},i)=>dot.position.copy(route.getPointAt(reduced?.55:(time*.13+i*.5)%1)));},dispose(){resources.forEach(x=>x.dispose())}};
}
