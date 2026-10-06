import * as THREE from './vendor/three.module.js';
import {createEdgeHost} from './edge-host.js?v=learning-life-1';

export function createDataScene({parent,brick,addLabel}){
 const group=new THREE.Group();group.name='numeric-perception';parent.add(group);group.visible=false;
 const V=(...v)=>new THREE.Vector3(...v),clamp=t=>THREE.MathUtils.clamp(t,0,1),ease=t=>1-Math.pow(1-t,3);
 const metal=new THREE.MeshStandardMaterial({color:'#b2c1c6',metalness:.54,roughness:.34}),dark=new THREE.MeshStandardMaterial({color:'#2c4246',metalness:.45,roughness:.4}),black=new THREE.MeshStandardMaterial({color:'#07191e',roughness:.3}),green=new THREE.MeshStandardMaterial({color:'#699989',roughness:.45});
 const light=new THREE.MeshStandardMaterial({color:'#b6dbc9',emissive:'#76ad96',emissiveIntensity:.6,roughness:.25});
 function box(g,w,h,d,mat,p){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);m.position.set(...p);m.castShadow=true;g.add(m);return m}
 function numericFace(g,text,w,h,p){
  if(typeof document==='undefined')return;
  const c=document.createElement('canvas');c.width=1024;c.height=256;const ctx=c.getContext('2d');ctx.fillStyle='#06171d';ctx.fillRect(0,0,1024,256);ctx.textAlign='center';ctx.textBaseline='middle';ctx.font='500 154px monospace';ctx.fillStyle='#bce0cf';ctx.fillText(text,512,135);
  const map=new THREE.CanvasTexture(c);map.colorSpace=THREE.SRGBColorSpace;map.anisotropy=4;
  const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map,toneMapped:false}));m.position.set(...p);g.add(m);
 }
 const inputs=[],packets=[],wires=[];
 const specs=[{title:'Modbus',sub:'儀表・感測器',type:'meter',x:-4.65,y:1.3},{title:'MC Protocol',sub:'PLC・設備狀態',type:'plc',x:0,y:2.1},{title:'Database',sub:'資料庫・歷史紀錄',type:'database',x:4.65,y:1.3}];
 for(const [i,s]of specs.entries()){
  const g=new THREE.Group();g.name=s.type+'-input';group.add(g);const target=V(s.x,s.y,.2);g.position.copy(target);
  if(s.type==='meter'){
   box(g,2.0,1.45,.95,metal,[0,.05,0]);box(g,1.80,1.20,.1,dark,[0,.05,.51]);box(g,1.56,.63,.06,black,[0,.19,.60]);numericFace(g,'023.4',1.45,.47,[0,.20,.636]);
   for(let j=0;j<4;j++)box(g,.21,.12,.06,j===3?green:metal,[-.57+j*.38,-.41,.61]);
   for(let j=0;j<5;j++){box(g,.25,.26,.25,green,[-.67+j*.33,.87,-.16]);box(g,.06,.06,.28,metal,[-.67+j*.33,.88,-.14]);}
   box(g,.28,.66,.28,metal,[0,-1.0,0]);box(g,1.55,.13,1.1,dark,[0,-1.37,0]);
  }else if(s.type==='plc'){
   box(g,3.1,.17,1.0,metal,[0,-.87,0]);box(g,3.1,.17,1.0,metal,[0,.87,0]);
   for(let j=0;j<5;j++){
    const x=(j-2)*.59;box(g,.55,1.58,.90,j===0?dark:metal,[x,0,0]);box(g,.39,.76,.06,black,[x,.06,.49]);
    for(let k=0;k<4;k++){box(g,.067,.048,.035,light,[x-.11,.30-k*.13,.538]);box(g,.18,.24,.14,green,[x+(k%2-.5)*.22,k<2?.70:-.70,.48]);}
   }
   numericFace(g,'PLC',.49,.18,[-1.18,-.18,.548]);
  }else{
   box(g,2.12,2.25,1.10,dark,[0,0,0]);
   for(let j=0;j<3;j++){
    const y=.72-j*.72;box(g,2.02,.62,.13,metal,[0,y,.6]);box(g,1.35,.43,.06,black,[-.13,y,.69]);
    for(let k=0;k<8;k++)box(g,.052,.30,.025,dark,[-.72+k*.155,y,.736]);box(g,.08,.08,.03,light,[.79,y+.11,.70]);box(g,.08,.045,.03,green,[.79,y-.12,.70]);
   }
  }
  const label=addLabel(g,V(0,s.type==='meter'?-1.85:s.type==='plc'?-1.35:-1.65,1),s.title,'numeric','#b5d8c9','data-source-label','growth');
  label.innerHTML=`<strong>${s.title}</strong><small>${s.sub}</small>`;
  const curve=new THREE.CatmullRomCurve3([target.clone().add(V(0,-.7,.45)),V(s.x*.78,-1.15,.9),V(s.x*.23,-1.30,.7),V(0,-1.42,.55)]);
  const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(70)),new THREE.LineBasicMaterial({color:'#a6cabb',transparent:true,opacity:0}));group.add(line);wires.push({line,delay:i*.65});
  for(let j=0;j<4;j++){const packet=new THREE.Mesh(new THREE.BoxGeometry(.09,.09,.09),light);group.add(packet);packets.push({packet,curve,delay:i*.65,offset:j/4})}
  inputs.push({g,target,delay:i*.65});
 }
 // Signal traces open the data branch, then continue a restrained live-data motion.
 const traces=new THREE.Group();group.add(traces);traces.position.y=4.5;
 const traceGeometry=new THREE.BufferGeometry();
 const linePoints=[];for(let j=0;j<3;j++)for(let i=0;i<79;i++){for(const n of[i,i+1])linePoints.push((n/79-.5)*4.3,(j-1)*.30+Math.sin(n*.24+j)*.15,0)}
 traceGeometry.setAttribute('position',new THREE.Float32BufferAttribute(linePoints,3));const waves=new THREE.LineSegments(traceGeometry,new THREE.LineBasicMaterial({color:'#a8d1c0',transparent:true,opacity:.65}));traces.add(waves);
 const host=createEdgeHost({parent:group,brick,addLabel,id:'numeric',name:'WinEdge-N',color:'#367961'});
 return {group,update(time,reduced){
  group.visible=true;const t=reduced?8:time;
  traces.scale.setScalar(.65+.35*ease(clamp(t/1.0)));traces.rotation.z=reduced?0:Math.sin(time*.25)*.022;
  inputs.forEach(({g,target,delay})=>{const p=ease(clamp((t-.8-delay)/1.35));g.visible=p>0;g.position.copy(target).add(V(0,(1-p)*1.3,-(1-p)*1.1));g.scale.setScalar(.2+.8*p);g.rotation.y=(1-p)*.45+(reduced?0:Math.sin(time*.25+delay)*.045)});
  wires.forEach(({line,delay})=>{const p=clamp((t-2-delay)/1.4);line.material.opacity=.42*p;line.geometry.setDrawRange(0,Math.ceil(71*p))});
  packets.forEach(({packet,curve,delay,offset})=>{packet.visible=t>3.3+delay;packet.position.copy(curve.getPoint(reduced?.5:(time*.17+offset)%1))});
  host.update(time,clamp((t-4.25)/1.7),reduced);
 }};
}
